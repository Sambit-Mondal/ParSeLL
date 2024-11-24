'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // Connect to backend Socket.io server

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
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-full h-full p-4 max-w-xl mx-auto font-sans">
        {!isIndianSeller && (
          <div className="mb-4">
            <label htmlFor="language" className="mr-2">Choose Language:</label>
            <select
              id="language"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="p-2 rounded border border-gray-300"
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
        <div className="bg-background-theme border border-gray-300 rounded p-4 h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`p-2 rounded max-w-xs shadow ${msg.sender ? 'bg-green-200' : 'bg-white'}`}
              >
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 mr-2 rounded border border-gray-300"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;