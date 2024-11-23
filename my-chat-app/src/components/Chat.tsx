'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to backend Socket.io server

const Chat = () => {
  const [messages, setMessages] = useState<{ text: string; user: string; sender: boolean }[]>([]);
  const [input, setInput] = useState<string>('');
  const [username, setUsername] = useState<string>('User');
  const [isIndianSeller, setIsIndianSeller] = useState<boolean>(true); // Toggle user role for testing
  const [sourceLang, setSourceLang] = useState<string>('en'); // Default language: English

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const targetLang = isIndianSeller ? 'en' : 'hi'; // Translate based on user type
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: input,
        sourceLang: isIndianSeller ? 'hi' : sourceLang,
        targetLang,
      }),
    });
    const data = await response.json();

    const translatedMessage = {
      text: data.translatedText,
      user: username,
      sender: isIndianSeller,
    };

    socket.emit('message', translatedMessage);
    setMessages((prev) => [...prev, translatedMessage]);
    setInput('');
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
      <h1>Real-Time Chat with Translation</h1>
      {!isIndianSeller && (
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="language" style={{ marginRight: '10px' }}>Choose Language:</label>
          <select
            id="language"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            style={{
              padding: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
      )}
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          height: '400px',
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.sender ? 'flex-end' : 'flex-start',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                background: msg.sender ? '#DCF8C6' : '#FFF',
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '70%',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: 'calc(100% - 80px)',
          padding: '10px',
          marginRight: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
