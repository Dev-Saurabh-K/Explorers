import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const apiBaseUrl = String(env.VITE_API_BASE_URL || "https://explorers-77tr.onrender.com")
    .trim()
    .replace(/\/+$/, "");
  const extraHosts = String(env.VITE_DEV_ALLOWED_HOSTS || "https://explorers-77tr.onrender.com")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  return {
    envDir: rootDir,
    envPrefix: "VITE_",
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(apiBaseUrl),
    },
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: ["gitocx.duckdns.org", ...extraHosts],
      hmr: {
        protocol: "wss",
        host: extraHosts[0] || "https://explorers-77tr.onrender.com" ,
        clientPort: 443,
      },
    },
  };
});
