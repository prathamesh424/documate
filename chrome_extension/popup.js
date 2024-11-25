document.getElementById('authButton').addEventListener('click', () => {
  // Send message to background to start the authentication process
  chrome.runtime.sendMessage({ type: 'authenticate' });
});
