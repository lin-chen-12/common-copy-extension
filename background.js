// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Check if we can send messages to this tab
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://") ||
      tab.url.startsWith("about:")
    ) {
      console.log("Cannot inject content script on this page");
      return;
    }

    // Send message to content script to toggle the overlay
    await chrome.tabs.sendMessage(tab.id, {
      action: "toggleOverlay",
    });
  } catch (error) {
    console.log("Content script not ready, injecting...", error);

    // If content script isn't loaded, inject it first
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      // Also inject CSS
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["content.css"],
      });

      // Now try sending the message again
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {
          action: "toggleOverlay",
        });
      }, 100);
    } catch (injectionError) {
      console.error("Failed to inject content script:", injectionError);
    }
  }
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Common Copy extension installed");
});
