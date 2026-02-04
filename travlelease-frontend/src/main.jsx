import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// ✅ Initialize Sentry
Sentry.init({
  dsn: "YOUR_SENTRY_DSN_HERE", // replace with your DSN from Sentry project settings
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // adjust for performance monitoring
});

// ✅ Initialize MSW only in development
if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  worker.start();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);