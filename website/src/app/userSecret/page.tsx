// src/app/userSecret/page.tsx
"use client";

import React, { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [encryptedToken, setEncryptedToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Call your Convex API directly
      const response = await fetch("/api/storeUserSecret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, encryptedToken }),
      });

      const result = await response.json();

      if (result.success) {
        alert("User secret stored successfully!");
      } else {
        setError("Failed to store user secret.");
      }
    } catch (err) {
      setError("An error occurred while storing the user secret.");
    }
  };

  return (
    <div className="bg-white">
      <h1>Store User Secret</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Secret Token:</label>
          <input
            type="text"
            value={encryptedToken}
            onChange={(e) => setEncryptedToken(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Store Secret</button>
      </form>
    </div>
  );
};

export default Page;
