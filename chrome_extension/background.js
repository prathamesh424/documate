// Define the domain variable
const API_DOMAIN = 'http://localhost:3000';

// Function to send highlight data to the API
async function sendHighlightToEndpoint(data) {
  try {
    const response = await fetch(`${API_DOMAIN}/api/highlights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error("Failed to send highlight to the API:", error);
    throw error;
  }
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_HIGHLIGHT') {
    const highlightData = request.payload;
    console.log("Received highlight data:", highlightData);
    
    // Send the highlight data to the API
    sendHighlightToEndpoint(highlightData)
      .then(response => {
        console.log("Highlight saved to API:", response);
        sendResponse({ status: 'success', data: response });
      })
      .catch(error => {
        console.error("Error saving highlight to API:", error);
        sendResponse({ status: 'error', message: error.message });
      });

    // Return true to indicate you want to send a response asynchronously
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
    console.log("Highlight Capture extension installed.");
  });
  
  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "highlightedText") {
      console.log("Highlighted text received:", request.data);
    }
  });

  
  