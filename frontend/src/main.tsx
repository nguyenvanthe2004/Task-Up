import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { YOUR_GOOGLE_CLIENT_ID } from "./constants";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={YOUR_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
        <ToastContainer />
      </Provider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
