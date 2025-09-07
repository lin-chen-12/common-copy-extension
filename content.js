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
  // This will load your built React app
  // We'll inject the built CSS and JS files
  const contentDiv = overlayContainer.querySelector(".common-copy-content");

  // For now, let's create a simple version
  // Later we'll inject your actual React app
  contentDiv.innerHTML = `
    <div class="entry-item">
      <label>Email:</label>
      <span>john@example.com</span>
      <button class="copy-btn" onclick="copyToClipboard('john@example.com')">Copy</button>
    </div>
    <div class="entry-item">
      <label>Name:</label>
      <span>John Doe</span>
      <button class="copy-btn" onclick="copyToClipboard('John Doe')">Copy</button>
    </div>
  `;
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
