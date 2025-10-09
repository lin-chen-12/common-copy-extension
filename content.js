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
        <button class="common-copy-close" id="common-copy-close-btn">×</button>
      </div>
      <div class="common-copy-content">
        <div class="common-copy-loading">Loading...</div>
      </div>
    </div>
  `;

  // Add to page
  document.body.appendChild(overlayContainer);
  overlayExists = true;

  // Add event listener to close button
  const closeBtn = overlayContainer.querySelector("#common-copy-close-btn");
  closeBtn.addEventListener("click", removeOverlay);

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

async function loadReactApp() {
  const contentDiv = overlayContainer.querySelector(".common-copy-content");
  contentDiv.innerHTML = '<div id="extension-app"></div>';

  try {
    // Fetch the manifest to get actual filenames
    const manifestResponse = await fetch(
      chrome.runtime.getURL("dist/.vite/manifest.json")
    );
    const manifest = await manifestResponse.json();

    const entry = manifest["src/main.tsx"];

    // Inject CSS first
    if (entry.css) {
      entry.css.forEach((cssFile) => {
        const link = document.createElement("link");
        link.href = chrome.runtime.getURL(`dist/${cssFile}`);
        link.rel = "stylesheet";
        document.head.appendChild(link);
      });
    }

    // Wait a bit for CSS to load, then inject JS
    setTimeout(() => {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL(`dist/${entry.file}`);
      script.type = "module";
      document.head.appendChild(script);
    }, 100);
  } catch (error) {
    console.error("Failed to load manifest:", error);
  }
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
