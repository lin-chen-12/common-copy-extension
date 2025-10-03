// import { render } from 'preact'
// import './index.css'
// import { App } from './app.tsx'

// render(<App />, document.getElementById('app')!)


// src/main.tsx
import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'

// Check if we're in an extension context
const targetElement = document.getElementById('extension-app') || document.getElementById('app');

if (targetElement) {
  render(<App />, targetElement);
}