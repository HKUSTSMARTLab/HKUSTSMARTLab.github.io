import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadConfig, loadEnvFile } from "./src/config.js";
import { createRegistrationService } from "./src/app.js";

const serviceDirectory = dirname(fileURLToPath(import.meta.url));
loadEnvFile(resolve(serviceDirectory, ".env"));
const config = loadConfig();
const dataDirectory = resolve(process.env.DATA_DIR || resolve(serviceDirectory, "data"));
const staticDirectory = resolve(serviceDirectory, "../../conference/aidp2026");
const { server } = createRegistrationService({ config, dataDirectory, staticDirectory });

server.listen(config.port, config.host, () => {
  console.log(`AIDP 2026 registration service listening on http://${config.host}:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}; CAPTCHA: ${config.captchaProvider}; static pages: ${config.serveStatic ? "enabled" : "disabled"}`);
});

function shutdown(signal) {
  console.log(`${signal} received; closing registration service.`);
  server.close((error) => {
    process.exitCode = error ? 1 : 0;
  });
  setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
