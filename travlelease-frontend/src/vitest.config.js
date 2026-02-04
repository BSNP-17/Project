import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom", // simulates browser DOM
    setupFiles: "./src/setupTests.js", // MSW + RTL setup
  },
});