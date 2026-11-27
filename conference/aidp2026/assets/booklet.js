/* AIDP 2026 booklet reader: local PDF.js rendering with responsive controls. */
(function () {
  "use strict";

  const root = document.querySelector("[data-booklet-reader]");
  if (!root) return;

  const canvas = root.querySelector("[data-pdf-canvas]");
  const viewport = root.querySelector(".booklet-reader__viewport");
  const status = root.querySelector("[data-booklet-status]");
  const previous = root.querySelector("[data-page-previous]");
  const next = root.querySelector("[data-page-next]");
  const pageInput = root.querySelector("[data-page-number]");
  const pageCount = root.querySelector("[data-page-count]");
  const zoomLabel = root.querySelector("[data-zoom-label]");
  const zoomOut = root.querySelector("[data-zoom-out]");
  const zoomIn = root.querySelector("[data-zoom-in]");
  const fitWidth = root.querySelector("[data-fit-width]");
  const context = canvas.getContext("2d", { alpha: false });

  let document_ = null;
  let currentPage = 1;
  let zoom = 1;
  let renderTask = null;
  let renderSequence = 0;
  let lastWidth = 0;
  let resizeFrame = 0;

  function setStatus(message, isError) {
    status.textContent = message || "";
    status.hidden = !message;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function updateControls() {
    previous.disabled = currentPage <= 1;
    next.disabled = !document_ || currentPage >= document_.numPages;
    pageInput.max = document_ ? document_.numPages : 1;
    pageInput.value = currentPage;
    pageCount.textContent = document_ ? document_.numPages : "…";
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    zoomOut.disabled = zoom <= 0.5;
    zoomIn.disabled = zoom >= 2;
  }

  async function renderPage() {
    if (!document_) return;
    const sequence = ++renderSequence;
    if (renderTask) {
      try { renderTask.cancel(); } catch (error) { /* Already complete. */ }
    }

    const page = await document_.getPage(currentPage);
    if (sequence !== renderSequence) return;

    const baseViewport = page.getViewport({ scale: 1 });
    const fitScale = viewport.clientWidth / baseViewport.width;
    const scale = fitScale * zoom;
    const maxOutputScale = 4096 / Math.max(baseViewport.width * scale, baseViewport.height * scale);
    const outputScale = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, maxOutputScale));
    const renderViewport = page.getViewport({ scale: scale * outputScale });

    canvas.width = Math.floor(renderViewport.width);
    canvas.height = Math.floor(renderViewport.height);
    canvas.style.width = `${Math.floor(baseViewport.width * scale)}px`;
    canvas.style.height = `${Math.floor(baseViewport.height * scale)}px`;
    canvas.setAttribute("aria-label", `Booklet page ${currentPage} of ${document_.numPages}`);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    renderTask = page.render({ canvasContext: context, viewport: renderViewport });
    try {
      await renderTask.promise;
    } catch (error) {
      if (error && error.name !== "RenderingCancelledException") {
        console.error("Booklet rendering failed:", error);
        setStatus("This page could not be displayed. Use Open in new tab or Download PDF.", true);
      }
      return;
    } finally {
      renderTask = null;
    }
  }

  async function goToPage(pageNumber) {
    if (!document_) return;
    const target = Math.min(document_.numPages, Math.max(1, Number(pageNumber) || 1));
    if (target === currentPage) {
      pageInput.value = target;
      return;
    }
    currentPage = target;
    updateControls();
    await renderPage();
  }

  function changeZoom(value) {
    zoom = Math.min(2, Math.max(0.5, value));
    updateControls();
    renderPage();
  }

  previous.addEventListener("click", () => goToPage(currentPage - 1));
  next.addEventListener("click", () => goToPage(currentPage + 1));
  pageInput.addEventListener("change", (event) => goToPage(event.target.value));
  pageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") goToPage(event.target.value);
  });
  zoomOut.addEventListener("click", () => changeZoom(zoom - 0.25));
  zoomIn.addEventListener("click", () => changeZoom(zoom + 0.25));
  fitWidth.addEventListener("click", () => changeZoom(1));

  function handleResize() {
    if (!document_) return;
    const width = viewport.clientWidth;
    if (Math.abs(width - lastWidth) < 8) return;
    lastWidth = width;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(renderPage);
  }

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(handleResize);
    observer.observe(viewport);
  } else {
    window.addEventListener("resize", handleResize);
  }

  if (!window.pdfjsLib) {
    setStatus("The PDF reader could not be loaded. Use Open in new tab or Download PDF.", true);
    return;
  }

  window.pdfjsLib.GlobalWorkerOptions.workerSrc = root.dataset.worker;
  setStatus("Loading booklet…");
  updateControls();

  window.pdfjsLib.getDocument({ url: root.dataset.pdf }).promise
    .then((loadedDocument) => {
      document_ = loadedDocument;
      lastWidth = viewport.clientWidth;
      updateControls();
      setStatus("");
      return renderPage();
    })
    .catch((error) => {
      console.error("Booklet loading failed:", error);
      setStatus("The embedded reader could not load this PDF. Use Open in new tab or Download PDF.", true);
    });
})();
