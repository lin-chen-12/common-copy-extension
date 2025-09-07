// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Send message to content script to toggle the overlay
  chrome.tabs.sendMessage(tab.id, {
    action: "toggleOverlay",
  });
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Common Copy extension installed");
});
