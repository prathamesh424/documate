// Open the IndexedDB database
const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('highlightsDB', 1);
  
      request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
        reject(event.target.errorCode);
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('highlights')) {
          db.createObjectStore('highlights', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  };
  
  // Save data to the IndexedDB
  const saveHighlight = (db, data) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['highlights'], 'readwrite');
      const store = transaction.objectStore('highlights');
      const request = store.add(data);
  
      request.onsuccess = () => {
        resolve();
      };
  
      request.onerror = (event) => {
        console.error('Save error:', event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  };
  
  // Retrieve all highlights from the IndexedDB
  const getAllHighlights = (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['highlights'], 'readonly');
      const store = transaction.objectStore('highlights');
      const request = store.getAll();
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        console.error('Get all error:', event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  };
  