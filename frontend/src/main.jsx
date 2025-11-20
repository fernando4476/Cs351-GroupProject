import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; 
import Feedback from "./Pages/Feedback.jsx";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);