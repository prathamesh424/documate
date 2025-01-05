console.log("Documate is up and running");
// Define the domain variable
const API_DOMAIN = 'https://documateit.vercel.app';
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
// Function to check if user is authenticated and return email
function checkAuthentication() {
  chrome.storage.local.get("user", (result) => {
    if (result.user) {
      console.log("Logged in email is ", result.user.email);
      return result.user.email;
    } else {
      console.log("Not yet authenticated");
      return "Not yet authenticated";
    }
  });
}

// Run the function on first load
checkAuthentication();

// Listen for mouseup events to detect when text is highlighted
document.addEventListener("mouseup", async () => {
  console.log("Mouse up event detected.");
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    const url = window.location.href;
    const domain = new URL(url).hostname; // Extract the domain from the URL
    // Fetch email ID from storage
    chrome.storage.local.get("user", (result) => {
      if (result.user) {
        const email = result.user.email;
        console.log("email id is ", email);
      } else {
        console.log("Not yet authenticated");
      }
      const dataToSend = {
        id:  result.user.email, // Use the email ID as the Unique ID
        title: domain, // Set title to the domain
        description: selectedText,
        timestamp: new Date().toISOString(),
        website: url // Store the full URL
      };

      console.log("Highlight data:", dataToSend);
      // Call sendHighlightToEndpoint directly
      sendHighlightToEndpoint(dataToSend)
        .then(response => {
          console.log("Highlight data sent to API successfully:", response);
        })
        .catch(error => {
          console.error("Failed to send highlight data to API:", error);
        });
    });
  }
});
