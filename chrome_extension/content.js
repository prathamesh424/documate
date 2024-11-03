// Define the domain variable
const API_DOMAIN = 'http://localhost:3000';

// Listen for mouseup events to detect when text is highlighted
document.addEventListener("mouseup", async () => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText) {
    const url = window.location.href;
    const domain = new URL(url).hostname; // Extract the domain from the URL

    const data = {
      id: Date.now(), // Unique ID
      title: domain, // Set title to the domain
      description: selectedText,
      timestamp: new Date().toISOString(),
      website: url // Store the full URL
    };

    console.log("Highlight data:", data);
    
    // Send the highlight data to the background script
    chrome.runtime.sendMessage({ type: 'SAVE_HIGHLIGHT', payload: data }, (response) => {
      if (response.status === 'success') {
        console.log("Highlight data sent to background script successfully.");
      } else {
        console.error("Failed to send highlight data to background script.");
      }
    });
  }
});
