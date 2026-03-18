


// src/main.tsx

import { createRoot } from "react-dom/client"

import './index.css'
import { App } from './app.tsx'

// Check if we're in an extension context
const targetElement = document.getElementById("app");

if (targetElement) {
  createRoot(targetElement).render(<App />);

}