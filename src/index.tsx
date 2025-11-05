// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StytchB2BProvider } from "@stytch/react/b2b";
import { config } from "./config";
import { StytchB2BHeadlessClient } from "@stytch/vanilla-js/b2b/headless";

const stytchClient = new StytchB2BHeadlessClient(config.stytchPublicToken, {
  cookieOptions: {
    availableToSubdomains: false,
    domain: undefined, // Let browser handle it
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <StytchB2BProvider stytch={stytchClient}>
    <App />
  </StytchB2BProvider>
  // </React.StrictMode>
);
