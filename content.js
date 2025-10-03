// Track overlay state
let overlayExists = false;
let overlayContainer = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleOverlay") {
    toggleOverlay();
  }
});

function toggleOverlay() {
  if (overlayExists) {
    removeOverlay();
  } else {
    createOverlay();
  }
}

function createOverlay() {
  // Prevent multiple overlays
  if (overlayExists) return;

  // Create container div
  overlayContainer = document.createElement("div");
  overlayContainer.id = "common-copy-overlay";
  overlayContainer.innerHTML = `
    <div class="common-copy-container">
      <div class="common-copy-header">
        <h3>Common Copy</h3>
        <button class="common-copy-close" onclick="window.removeCommonCopyOverlay()">×</button>
      </div>
      <div class="common-copy-content">
        <div class="common-copy-loading">Loading...</div>
      </div>
    </div>
  `;

  // Add to page
  document.body.appendChild(overlayContainer);
  overlayExists = true;

  // Load your React app into the overlay
  loadReactApp();
}

function removeOverlay() {
  if (overlayContainer) {
    overlayContainer.remove();
    overlayContainer = null;
    overlayExists = false;
  }
}

function loadReactApp() {
  const contentDiv = overlayContainer.querySelector(".common-copy-content");

  // Create a div for your Preact app to mount to
  contentDiv.innerHTML = '<div id="extension-app"></div>';

  // Inject your built CSS and JS files
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("dist/assets/index-C_dcRlyO.css");
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("dist/assets/index-DVvQPh2w.js");
  script.type = "module";
  document.head.appendChild(script);
}

// Global function to remove overlay (called from close button)
window.removeCommonCopyOverlay = removeOverlay;

// Global function to copy text
window.copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // Show success feedback
    showCopyFeedback();
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

function showCopyFeedback() {
  const feedback = document.createElement("div");
  feedback.className = "copy-feedback";
  feedback.textContent = "Copied!";
  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.remove();
  }, 2000);
}
