chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed');
});

// Listen for the 'authenticate' message from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'authenticate') {
    authenticateUser(); // Trigger authentication
  }
});

// Function to handle OAuth flow
function authenticateUser() {
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
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error('Authentication failed');
        return;
      }

      // Extract the token from the redirect URL
      const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
      const accessToken = urlParams.get('access_token');
      if (accessToken) {
        // console.log('Access Token:', accessToken);
        getUserProfile(accessToken);  // Fetch user profile data using the access token
      }
    }
  );
}

// Function to fetch user profile data using the access token
function getUserProfile(accessToken) {
  fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('User Profile:', data);
      // Here you can process and store user data as needed
    })
    .catch((error) => {
      console.error('Error fetching user profile:', error);
    });
}
