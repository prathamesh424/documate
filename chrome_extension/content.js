// Define the domain variable
// const API_DOMAIN = 'https://documateit.vercel.app';
const API_DOMAIN = 'http://localhost:3000';

// Listen for mouseup events to detect when text is highlighted
document.addEventListener("mouseup", async () => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText) {
    const url = window.location.href;
    const domain = new URL(url).hostname; // Extract the domain from the URL

    // Fetch email ID from storage
    chrome.storage.sync.get(['email', 'isActive'], async (data) => {
      console.log("data is ",data)
      if (data&&!data.isActive) {
        console.log("Extension is deactivated.");
        return; // Don't proceed if the extension is deactivated
      }

      const dataToSend = {
        id: data.email || "unknown_email", // Use the email ID as the Unique ID
        title: domain, // Set title to the domain
        description: selectedText,
        timestamp: new Date().toISOString(),
        website: url // Store the full URL
      };

      console.log("Highlight data:", dataToSend);
      
      // Send the highlight data to the background script
      chrome.runtime.sendMessage({ type: 'SAVE_HIGHLIGHT', payload: dataToSend }, (response) => {
        if (response.status === 'success') {
          console.log("Highlight data sent to background script successfully.");
        } else {
          console.error("Failed to send highlight data to background script.");
        }
      });
    });
  }
});
