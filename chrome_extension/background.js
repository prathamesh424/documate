// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log("Highlight Capture extension installed.");
  });
  
  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "highlightedText") {
      console.log("Highlighted text received:", request.data);
    }
  });
  