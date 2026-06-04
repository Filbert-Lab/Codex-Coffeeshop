import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
import "./index.css";

const initialHomeData = window.__INITIAL_DATA__?.home ?? null;

if (window.__INITIAL_DATA__) {
  delete window.__INITIAL_DATA__;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App initialHomeData={initialHomeData} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
