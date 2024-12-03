// src/app/create-page/page.tsx
"use client"
import { useState } from "react";


export default function CreatePage() {
    const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/createPage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      setTitle('');
      setContent('');
      window.alert("content uploaded successfully !!! ")
      setMessage(data.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error creating page');
    }
  };
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Create a Notion Page</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Page Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2"
        required
      />
      <textarea
        placeholder="Page Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2"
        required
      ></textarea>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Page
      </button>
      {message && <p>{message}</p>}
    </form>
    </div>
  );
}
