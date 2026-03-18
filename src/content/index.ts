// Track overlay state
let overlayExists = false;
let overlayContainer: HTMLIFrameElement | null = null;
// Listen for messages from background script
chrome.runtime.onMessage.addListener((request) => {
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
  if (overlayExists) return;

  overlayContainer = document.createElement("iframe");
  overlayContainer.id = "common-copy-root";
  overlayContainer.src = chrome.runtime.getURL("src/popup/index.html");
  overlayContainer.style.cssText = "position:fixed;top:20px;right:20px;width:600px;height:500px;border:none;z-index:2147483647;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.15);";

  document.body.appendChild(overlayContainer);
  overlayExists = true;
}

function removeOverlay() {
  if (overlayContainer) {
    overlayContainer.remove();
    overlayContainer = null;
    overlayExists = false;
  }
}


window.addEventListener('message', (event) => {
  if (event.data?.action === 'closeOverlay') {
    removeOverlay();
  }
});

