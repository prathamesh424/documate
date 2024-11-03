document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const toggle = document.getElementById('toggle');

    // Load stored email and toggle status
    chrome.storage.sync.get(['email', 'isActive'], (data) => {
        if (data.email) {
            emailInput.value = data.email;
        }
        if (data.isActive) {
            toggle.checked = data.isActive;
        }
    });

    // Save email when input changes
    emailInput.addEventListener('input', () => {
        const email = emailInput.value;
        chrome.storage.sync.set({ email }, () => {
            console.log("Email saved:", email);
        });
    });

    // Save toggle status when it changes
    toggle.addEventListener('change', () => {
        const isActive = toggle.checked;
        chrome.storage.sync.set({ isActive }, () => {
            console.log("Toggle status saved:", isActive);
        });
    });
});
