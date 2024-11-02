// Open (or create) the database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("highlightsDB", 1);

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      console.log("Database opened successfully");
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("highlights")) {
        db.createObjectStore("highlights", { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

// Add a highlight to IndexedDB
function addHighlightToDB(db, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["highlights"], "readwrite");
    const store = transaction.objectStore("highlights");
    const request = store.add(data);

    request.onsuccess = () => {
      console.log("Highlight added to the database");
      resolve();
    };

    request.onerror = (event) => {
      console.error("Error adding highlight to the database", event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}

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

    // Open IndexedDB and add the highlight
    try {
      const db = await openDB();
      await addHighlightToDB(db, data);
      console.log("Text highlight saved to IndexedDB:", data);
    } catch (error) {
      console.error("Failed to save highlight to IndexedDB:", error);
    }
  }
});
