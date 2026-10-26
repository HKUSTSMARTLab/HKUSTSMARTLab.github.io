/* AIDP 2026 registration forms. No framework and no secrets in browser code. */
(function () {
  "use strict";

  var formElements = Array.from(document.querySelectorAll("[data-registration-form]"));
  if (!formElements.length) return;

  var serviceStatus = document.getElementById("registration-service-status");
  var browserConfig = window.AIDP_REGISTRATION_CONFIG || {};
  var isLocal = ["localhost", "127.0.0.1"].indexOf(window.location.hostname) !== -1;
  var apiBase = String(browserConfig.apiBase || "").replace(/\/+$/u, "");
  var localFallback = !apiBase && isLocal && window.location.port !== "8787" ? "http://127.0.0.1:8787" : "";
  var scriptPromises = {};
  var DEFAULT_MAX_PDF_BYTES = 5 * 1024 * 1024;

  function apiUrl(path) {
    return apiBase + "/api/aidp2026/" + path;
  }

  function randomUuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    if (!window.crypto || !window.crypto.getRandomValues) {
      throw new Error("A secure browser random-number generator is required.");
    }
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    var hex = Array.from(bytes, function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
  }

  function fetchJson(url, options, timeoutMs) {
    var controller = new AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, timeoutMs || 15000);
    options = Object.assign({}, options || {}, { signal: controller.signal });
    return fetch(url, options).then(async function (response) {
      var body;
      try {
        body = await response.json();
      } catch (_error) {
        throw new Error("The registration service returned an invalid response.");
      }
      if (!response.ok) {
        var error = new Error(body && body.error && body.error.message ? body.error.message : "Submission failed. Please try again.");
        error.code = body && body.error ? body.error.code : "REQUEST_FAILED";
        error.fields = body && body.error ? body.error.fields : null;
        throw error;
      }
      return body;
    }).finally(function () {
      window.clearTimeout(timer);
    });
  }

  function loadScript(key, url, globalName) {
    if (window[globalName]) return Promise.resolve();
    if (scriptPromises[key]) return scriptPromises[key];
    scriptPromises[key] = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = function () {
        if (window[globalName]) resolve();
        else reject(new Error(globalName + " did not initialize."));
      };
      script.onerror = function () {
        reject(new Error("Could not load " + globalName + "."));
      };
      document.head.appendChild(script);
    }).catch(function (error) {
      delete scriptPromises[key];
      throw error;
    });
    return scriptPromises[key];
  }

  function setMessage(element, message, type) {
    element.textContent = message;
    element.classList.remove("is-error", "is-verified");
    if (type) element.classList.add(type === "verified" ? "is-verified" : "is-error");
  }

  function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
    return bytes + " bytes";
  }

  function RegistrationForm(form) {
    this.form = form;
    this.kind = form.dataset.kind;
    this.endpoint = form.dataset.endpoint;
    this.submitButton = form.querySelector("[data-submit]");
    this.submitLabel = this.submitButton.textContent;
    this.formStatus = form.querySelector("[data-form-status]");
    this.success = form.querySelector("[data-success]");
    this.reference = form.querySelector("[data-reference]");
    this.providerSelect = form.querySelector("[data-captcha-provider]");
    this.captchaMount = form.querySelector("[data-captcha-mount]");
    this.captchaStatus = form.querySelector("[data-captcha-status]");
    this.retryButton = form.querySelector("[data-captcha-retry]");
    this.captcha = null;
    this.provider = null;
    this.widgetId = null;
    this.tencentInstance = null;
    this.challengeGeneration = 0;
    this.idempotencyKey = randomUuid();
    this.startedAt = Date.now();
    this.busy = false;
    this.closed = true;
    this.config = null;
    this.maxPdfBytes = DEFAULT_MAX_PDF_BYTES;
    this.hasAttempted = false;

    this.providerSelect.addEventListener("change", function () {
      this.setProvider(this.providerSelect.value);
    }.bind(this));
    this.retryButton.addEventListener("click", function () {
      if (this.provider) this.setProvider(this.provider);
    }.bind(this));
    this.form.addEventListener("submit", this.submit.bind(this));

    if (this.kind === "conference") {
      var dateInputs = Array.from(this.form.querySelectorAll('input[name="dates"]'));
      dateInputs.forEach(function (input) {
        input.addEventListener("change", function () {
          dateInputs.forEach(function (dateInput) {
            dateInput.setCustomValidity("");
          });
        });
      });
    } else {
      this.fileInput = this.form.querySelector('input[type="file"]');
      this.fileInfo = this.form.querySelector("[data-file-info]");
      this.fileInput.addEventListener("change", function () {
        this.fileInput.setCustomValidity("");
        this.updateFileInfo();
        if (this.hasAttempted) this.idempotencyKey = randomUuid();
      }.bind(this));
      this.form.addEventListener("reset", function () {
        window.setTimeout(this.updateFileInfo.bind(this), 0);
      }.bind(this));
      this.updateFileInfo();
    }
  }

  RegistrationForm.prototype.configure = function (config) {
    this.config = config;
    this.maxPdfBytes = config.posters.maxPdfBytes || DEFAULT_MAX_PDF_BYTES;
    this.closed = this.kind === "conference" ? !config.registration.open : !config.posters.open;
    if (this.closed) {
      this.providerSelect.disabled = true;
      setMessage(this.captchaStatus, this.kind === "conference" ? "Conference registration is currently closed." : "Poster submissions are currently closed.", "error");
      this.updateSubmit();
      return;
    }

    var providers = [];
    if (config.captcha.turnstile) providers.push({ value: "turnstile", label: "Cloudflare Turnstile" });
    if (config.captcha.tencent) providers.push({ value: "tencent", label: "Tencent Captcha (China Mainland)" });
    if (!providers.length) {
      setMessage(this.captchaStatus, "No verification provider is configured. Please contact the organizers.", "error");
      return;
    }

    this.providerSelect.replaceChildren();
    providers.forEach(function (provider) {
      this.providerSelect.add(new Option(provider.label, provider.value));
    }, this);
    this.providerSelect.disabled = false;
    this.providerSelect.closest(".form-field").hidden =
      config.captcha.preferredProvider === "auto" || providers.length === 1;

    var preferred = config.captcha.preferredProvider;
    if (preferred === "auto") {
      // Auto mode chooses without asking the visitor to manage providers. Language
      // is only a fallback when no trusted edge-country answer is available.
      var mainlandLanguage = String(navigator.language || "").toLowerCase() === "zh-cn";
      preferred = mainlandLanguage && config.captcha.tencent ? "tencent" : "turnstile";
    }
    if (!providers.some(function (provider) { return provider.value === preferred; })) {
      preferred = providers[0].value;
    }
    this.providerSelect.value = preferred;
    this.setProvider(preferred);
  };

  RegistrationForm.prototype.unavailable = function () {
    this.closed = true;
    this.captcha = null;
    this.providerSelect.disabled = true;
    setMessage(this.captchaStatus, "The registration service is unavailable. Your form cannot be submitted right now.", "error");
    this.updateSubmit();
  };

  RegistrationForm.prototype.updateSubmit = function () {
    this.submitButton.disabled = this.closed || this.busy || !this.captcha;
    if (this.fileInput) this.fileInput.disabled = this.closed || this.busy;
  };

  RegistrationForm.prototype.isCurrentChallenge = function (generation) {
    return generation === this.challengeGeneration && !this.closed;
  };

  RegistrationForm.prototype.destroyChallenge = function () {
    if (this.widgetId !== null && window.turnstile) {
      try {
        window.turnstile.remove(this.widgetId);
      } catch (_error) {
        // The mount is also cleared below; removal is best-effort.
      }
    }
    if (this.tencentInstance) {
      try {
        this.tencentInstance.destroy();
      } catch (_error) {
        // Older provider versions may not implement destroy consistently.
      }
    }
    this.widgetId = null;
    this.tencentInstance = null;
    this.captchaMount.replaceChildren();
  };

  RegistrationForm.prototype.setProvider = async function (provider) {
    this.provider = provider;
    this.providerSelect.value = provider;
    this.challengeGeneration += 1;
    var generation = this.challengeGeneration;
    this.captcha = null;
    this.updateSubmit();
    this.destroyChallenge();
    this.retryButton.hidden = true;

    if (this.closed) return;
    setMessage(this.captchaStatus, "Loading security verification…");
    try {
      if (provider === "turnstile") {
        await this.setupTurnstile(generation);
      } else if (provider === "tencent") {
        await this.setupTencent(generation);
      } else {
        throw new Error("Unknown verification provider.");
      }
    } catch (_error) {
      if (!this.isCurrentChallenge(generation)) return;
      this.captcha = null;
      this.updateSubmit();
      setMessage(this.captchaStatus, "Verification could not be loaded. Retry or choose the other provider if available.", "error");
      this.retryButton.hidden = false;
    }
  };

  RegistrationForm.prototype.setupTurnstile = async function (generation) {
    await loadScript(
      "turnstile",
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
      "turnstile"
    );
    if (!this.isCurrentChallenge(generation)) return;
    var self = this;
    this.widgetId = window.turnstile.render(this.captchaMount, {
      sitekey: this.config.captcha.turnstile.siteKey,
      theme: "light",
      size: "flexible",
      action: "aidp2026-" + this.kind,
      callback: function (token) {
        if (!self.isCurrentChallenge(generation)) return;
        self.captcha = { provider: "turnstile", token: token };
        setMessage(self.captchaStatus, "Verification completed. You can submit the form.", "verified");
        self.retryButton.hidden = true;
        self.updateSubmit();
      },
      "expired-callback": function () {
        if (!self.isCurrentChallenge(generation)) return;
        self.captcha = null;
        self.updateSubmit();
        setMessage(self.captchaStatus, "Verification expired. A new challenge is starting…", "error");
        if (self.widgetId !== null) window.turnstile.reset(self.widgetId);
      },
      "error-callback": function () {
        if (!self.isCurrentChallenge(generation)) return;
        self.captcha = null;
        self.updateSubmit();
        setMessage(self.captchaStatus, "Verification failed to load. Retry or choose another provider.", "error");
        self.retryButton.hidden = false;
      },
      "timeout-callback": function () {
        if (!self.isCurrentChallenge(generation)) return;
        self.captcha = null;
        self.updateSubmit();
        setMessage(self.captchaStatus, "Verification timed out. Please retry.", "error");
        self.retryButton.hidden = false;
      },
    });
    if (!this.captcha) setMessage(this.captchaStatus, "Complete the Cloudflare security check to enable submission.");
  };

  RegistrationForm.prototype.setupTencent = async function (generation) {
    await loadScript("tencent", "https://turing.captcha.qcloud.com/TJCaptcha.js", "TencentCaptcha");
    if (!this.isCurrentChallenge(generation)) return;
    var self = this;
    this.tencentInstance = new window.TencentCaptcha(
      String(this.config.captcha.tencent.appId),
      function (result) {
        self.onTencentResult(result, generation);
      },
      { userLanguage: navigator.language || "en" }
    );
    var button = document.createElement("button");
    button.type = "button";
    button.className = "button button--outline";
    button.textContent = "Verify with Tencent Captcha";
    button.addEventListener("click", function () {
      self.captcha = null;
      self.updateSubmit();
      setMessage(self.captchaStatus, "Complete the Tencent security check in the dialog.");
      try {
        self.tencentInstance.show();
      } catch (_error) {
        setMessage(self.captchaStatus, "The verification dialog could not open. Please retry.", "error");
        self.retryButton.hidden = false;
      }
    });
    this.captchaMount.replaceChildren(button);
    setMessage(this.captchaStatus, "Select “Verify with Tencent Captcha”, then return here to submit.");
  };

  RegistrationForm.prototype.onTencentResult = function (result, generation) {
    if (!this.isCurrentChallenge(generation)) return;
    var valid = result && result.ret === 0 && result.ticket && result.randstr
      && !result.errorCode && String(result.ticket).indexOf("trerror_") !== 0;
    if (valid) {
      this.captcha = { provider: "tencent", token: result.ticket, randstr: result.randstr };
      setMessage(this.captchaStatus, "Verification completed. You can submit the form.", "verified");
      this.retryButton.hidden = true;
    } else {
      this.captcha = null;
      var message = result && result.ret === 2
        ? "Verification was cancelled. Select the verification button to try again."
        : "Verification did not complete. Please try again; disaster-recovery tickets are not accepted.";
      setMessage(this.captchaStatus, message, "error");
    }
    this.updateSubmit();
  };

  RegistrationForm.prototype.payload = function () {
    var data = new FormData(this.form);
    var payload = {
      fullName: data.get("fullName"),
      email: data.get("email"),
      affiliation: data.get("affiliation"),
      consent: data.get("consent") === "on",
      website: data.get("website"),
      formStartedAt: this.startedAt,
      captcha: this.captcha,
    };
    if (this.kind === "conference") {
      payload.role = data.get("role");
      payload.dates = data.getAll("dates");
    } else {
      var file = this.fileInput.files[0];
      payload.title = data.get("title");
      payload.authors = data.get("authors");
      payload.topic = data.get("topic");
      payload.posterFile = file ? { name: file.name, size: file.size } : { name: "", size: 0 };
    }
    return payload;
  };

  RegistrationForm.prototype.updateFileInfo = function () {
    if (!this.fileInput) return;
    var file = this.fileInput.files[0];
    this.fileInfo.textContent = file ? file.name + " · " + formatFileSize(file.size) : "No file selected";
  };

  RegistrationForm.prototype.validatePdf = function () {
    if (this.kind !== "poster") return true;
    var file = this.fileInput.files[0];
    var error = "";
    if (!file) error = "Select your poster PDF.";
    else if (!/\.pdf$/iu.test(file.name)) error = "The file name must end in .pdf.";
    else if (file.size < 1) error = "The selected PDF is empty.";
    else if (file.size > this.maxPdfBytes) error = "The PDF must be no larger than 5 MB.";
    this.fileInput.setCustomValidity(error);
    if (error) {
      this.fileInput.reportValidity();
      return false;
    }
    return true;
  };

  RegistrationForm.prototype.validateDates = function () {
    if (this.kind !== "conference") return true;
    var dateInputs = Array.from(this.form.querySelectorAll('input[name="dates"]'));
    if (dateInputs.some(function (input) { return input.checked; })) return true;
    dateInputs[0].setCustomValidity("Select at least one conference day.");
    dateInputs[0].reportValidity();
    return false;
  };

  RegistrationForm.prototype.submit = async function (event) {
    event.preventDefault();
    if (this.busy || this.closed || !this.validateDates() || !this.validatePdf()) return;
    if (!this.form.reportValidity()) return;
    if (!this.captcha) {
      setMessage(this.formStatus, "Complete security verification before submitting.", "error");
      return;
    }

    this.busy = true;
    this.hasAttempted = true;
    this.updateSubmit();
    this.submitButton.textContent = "Submitting…";
    setMessage(this.formStatus, "Submitting securely. Please do not close this page.");
    this.success.hidden = true;

    try {
      var result = await fetchJson(apiUrl(this.endpoint), {
        method: "POST",
        credentials: "omit",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Idempotency-Key": this.idempotencyKey,
        },
        body: JSON.stringify(this.payload()),
      }, 20000);

      if (this.kind === "poster" && result.uploadRequired) {
        this.submitButton.textContent = "Uploading PDF…";
        setMessage(this.formStatus, "Details verified. Uploading your PDF…");
        var posterFile = this.fileInput.files[0];
        if (!posterFile) throw new Error("Select the PDF again before uploading.");
        result = await fetchJson(apiBase + result.upload.url, {
          method: "POST",
          credentials: "omit",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/pdf",
            "X-Upload-Token": result.upload.token,
          },
          body: posterFile,
        }, 120000);
      }

      this.reference.textContent = result.reference;
      this.success.hidden = false;
      this.form.reset();
      this.form.dispatchEvent(new Event("reset", { bubbles: false }));
      setMessage(this.formStatus, result.message || "Submission received. Save your reference.", "verified");
      this.idempotencyKey = randomUuid();
      this.hasAttempted = false;
      this.startedAt = Date.now();
      this.success.focus({ preventScroll: true });
      this.success.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "nearest",
      });
    } catch (error) {
      var message = error && error.message ? error.message : "The service could not be reached. Please try again.";
      if (error && error.name === "AbortError") message = "The request timed out. Your entries have been kept; please try again.";
      setMessage(this.formStatus, message + " Your entries have been kept.", "error");
      if (error && error.code === "FORM_TIMING_INVALID") this.startedAt = Date.now();
      if (error && error.code === "IDEMPOTENCY_CONFLICT") this.idempotencyKey = randomUuid();
    } finally {
      this.busy = false;
      this.submitButton.textContent = this.submitLabel;
      // CAPTCHA tickets are single-use. A fresh challenge is required after
      // every attempt; the idempotency key safely handles a network retry.
      this.setProvider(this.provider);
    }
  };

  var controllers = formElements.map(function (form) {
    return new RegistrationForm(form);
  });

  document.querySelectorAll("[data-character-count]").forEach(function (counter) {
    var input = document.getElementById(counter.dataset.characterCount);
    if (!input) return;
    var update = function () {
      counter.textContent = input.value.length + " / " + input.maxLength;
    };
    input.addEventListener("input", update);
    input.form.addEventListener("reset", function () {
      window.setTimeout(update, 0);
    });
    update();
  });

  function loadPublicConfig() {
    var options = {
      headers: { "Accept": "application/json" },
      credentials: "omit",
    };
    return fetchJson(apiUrl("config"), options, 8000).catch(function (error) {
      if (!localFallback) throw error;
      apiBase = localFallback;
      localFallback = "";
      return fetchJson(apiUrl("config"), options, 8000);
    });
  }

  loadPublicConfig().then(function (config) {
    document.querySelectorAll("[data-retention-days]").forEach(function (element) {
      element.textContent = config.retentionDays;
    });
    controllers.forEach(function (controller) {
      controller.configure(config);
    });
    serviceStatus.hidden = true;
  }).catch(function () {
    controllers.forEach(function (controller) {
      controller.unavailable();
    });
    serviceStatus.hidden = false;
    serviceStatus.textContent = "Online registration is temporarily unavailable. Please try again later or contact the organizers at aidp2026hk@outlook.com.";
    serviceStatus.classList.remove("is-ready");
    serviceStatus.classList.add("is-error");
  });
})();
