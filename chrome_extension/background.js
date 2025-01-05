console.log("Documate up and running");


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

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed');
});

// Listen for the 'authenticate' message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("message recieved from content js")
  if (request.type === 'authenticate') {
    authenticateUser(sendResponse); // Trigger authentication
    return true; // Keep the response open for async processing
  }
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

// Function to handle OAuth flow
function authenticateUser(sendResponse) {
  const clientId = '632635626162-mib8unurg6jgs265ll2vtefd9nihkf20.apps.googleusercontent.com';
  const redirectUri = 'https://aoikajdfmhdnhpdmnphpljdlgpcodaml.chromiumapp.org/'; // Use your extension ID here
  const scope = 'profile email';

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  chrome.identity.launchWebAuthFlow(
    {
      url: authUrl,
      interactive: true,
    },
    (redirectUrl) => {
      console.log("redirectUrl", redirectUrl);
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error('Authentication failed');
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }

      // Extract the token from the redirect URL
      const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
      const accessToken = urlParams.get('access_token');

      if (accessToken) {
        console.log('Access Token:', accessToken);
        getUserProfile(accessToken, sendResponse); // Fetch user profile data
      }
    }
  );
}

// Function to fetch user profile data using the access token
function getUserProfile(accessToken, sendResponse) {
  fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('User Profile:', data);

      // Save user email to chrome.storage.sync
      const email = data.email; // Extract the email from the response

      chrome.storage.sync.set({ email: email, isActive: true }, () => {
        console.log('Email saved to chrome.storage.sync:', email);
        sendResponse({ success: true, user: data });
      });
    })
    .catch((error) => {
      console.error('Error fetching user profile:', error);
      sendResponse({ success: false, error: error.message });
    });
}
