// Listen for extension icon clicks, tab is current active tab
chrome.action.onClicked.addListener(async (tab) => {
  

    if (!tab.url) return;

    // Check if we can send messages to this tab

    // guard clauses for restricted pages
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://") ||
      tab.url.startsWith("about:")
    ) {
      console.log("Cannot inject content script on this page");
      return;
    }
    if (!tab.id) return;

    // Send message to content/index.ts to toggle the overlay
    await chrome.tabs.sendMessage(tab.id, {action: "toggleOverlay"});
});
 

    

// // Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Common Copy extension installed");
});


