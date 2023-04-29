import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={new QueryClient()}>
    <Auth0Provider
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
      clientId="6X88wrUZPFHnNDoKdQmCdbXYV7Hw1uwM"
      domain="unsent-voice-notes.eu.auth0.com"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </QueryClientProvider>
);
