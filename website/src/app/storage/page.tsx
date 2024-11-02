"use client"
import { useEffect, useState } from 'react';

export default function Memory() {
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    async function openDB() {
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

    async function getAllHighlights(db) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["highlights"], "readonly");
        const store = transaction.objectStore("highlights");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = (event) => {
          resolve(event.target.result);
        };

        getAllRequest.onerror = (event) => {
          console.error("Error retrieving entries:", event.target.errorCode);
          reject(event.target.errorCode);
        };
      });
    }

    async function fetchHighlights() {
      try {
        const db = await openDB();
        const entries = await getAllHighlights(db);
        setHighlights(entries);
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
      }
    }

    fetchHighlights();
  }, []);

  return (
    <div className='bg-white'>
      <h1>Highlighted Texts</h1>
      <ul>
        {highlights.map((highlight) => (
          <li key={highlight.id}>
            <p><strong>Text:</strong> {highlight.text}</p>
            <p><strong>Timestamp:</strong> {highlight.timestamp}</p>
            <p><strong>URL:</strong> <a href={highlight.url} target="_blank" rel="noopener noreferrer">{highlight.url}</a></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
