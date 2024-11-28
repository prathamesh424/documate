document.addEventListener("DOMContentLoaded", () => {
  // Check if user data exists in local storage
  chrome.storage.local.get("user", (result) => {
    if (result.user) {
      displayUserData(result.user); // Show the user data
    } else {
      showLoginPage(); // Show the login page
    }
  });

  // Set up sign-in button
  document.getElementById("main-body").addEventListener("click", (event) => {
    if (event.target.id === "sign-in-button") {
      chrome.runtime.sendMessage({ type: "authenticate" }, (response) => {
        if (response.success) {
          chrome.storage.local.set({ user: response.user }, () => {
            displayUserData(response.user); // Update UI with user data
          });
        } else {
          console.error("Authentication failed:", response.error);
        }
      });
    }
    if (event.target.id === "logout-button") {
      chrome.storage.local.remove("user", () => {
        showLoginPage();
      });
    }
  });
});

function displayUserData(user) {
  // Display user data in the UI
  document.getElementById("main-body").innerHTML = `
    <div class="card">
        <div class="header">
            <div class="profile">
                <div class="profile-img">
                  <img src="${user.picture}">
                </div>
            </div>
            <div class="controls">
                <button class="control-btn" id="logout-button">🏃‍♂️</button>
                <button class="control-btn vp-btn">VP</button>
            </div>
        </div>

        <div class="total-time">
            <h2>TODAY'S TOTAL</h2>
            <div class="time">47:54</div>
        </div>

        <div class="website-card">
            <div class="website-icon" style="background: #ff0000;"></div>
            <div class="website-info">
                <div class="website-label">TOP WEBSITE</div>
                <div class="website-url">www.youtube.com</div>
            </div>
            <div class="website-time">35:43</div>
        </div>

        <div class="website-card">
            <div class="website-icon" style="background: #ea4c89;"></div>
            <div class="website-info">
                <div class="website-label">CURRENT WEBSITE</div>
                <div class="website-url">www.dribbble.com</div>
            </div>
            <div class="website-time">17:04</div>
        </div>

        <button class="dashboard-btn">
            <span>⋮</span>
            Open Dashboard
        </button>

        <div class="options">
            <h3>OPTIONS</h3>
            <div class="slider-container">
                <input type="range" min="30" max="120" value="30" class="slider">
                <div class="time-markers">
                    <span>30 sec</span>
                    <span>75 sec</span>
                    <span>120 sec</span>
                </div>
            </div>
            <div class="tracking-text">
                Stop tracking if no activity detected for <span>30</span> seconds
            </div>
        </div>

        <div class="footer">
            <div>Synced 42 seconds ago</div>
            <div>v2.5.3</div>
        </div>
    </div>
  `;
}

function showLoginPage() {
  // Reset the UI to show the login page
  document.getElementById("main-body").innerHTML = `
    <div class="container">
        <div class="illustration">
        </div>
        <h1>Get started</h1>
        <p>Connect your Chrome Extension with your CoinTracker account.</p>
        <button class="google-btn" id="sign-in-button">
            <span class="google-icon"></span>
            <span class="btn-text">Continue with Google</span>
            <span class="loading"></span>
        </button>
    </div>
  `;
}



// function showLoginPage() {
//   // Reset the UI to show the login page
//   document.getElementById("main-body").innerHTML = `
//     <header>
//       <h1>Welcome</h1>
//       <p id="login-prompt">Sign in to access features.</p>
//     </header>
//     <button id="sign-in-button">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="18"
//         height="18"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         stroke-width="2"
//         stroke-linecap="round"
//         stroke-linejoin="round"
//       >
//         <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//         <polyline points="22,6 12,13 2,6"></polyline>
//       </svg>
//       Sign in with Google
//     </button>
//   `;
// }
