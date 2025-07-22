'use client';
import { useState } from 'react';

export default function PolicyForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) formData.append('file', file);
    else formData.append('text', text);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        rows={6}
        className="w-full border p-2 rounded"
        placeholder="Paste TOS or Privacy Policy here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div>
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Analyze Policy
      </button>
    </form>
  );
}
