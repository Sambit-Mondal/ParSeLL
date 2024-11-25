import Image from 'next/image';
import React, { useState } from 'react';
import axios from 'axios';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';

function ParsX() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  interface Message {
    role: string;
    content: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('http://localhost:5000/chat', { message: input });
      const botMessage = { role: 'bot', content: response.data.response };
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInput('');
  };

  return (
    <div>
      <div
        className="select-none fixed flex items-center justify-center bottom-4 right-4 lg:bottom-6 lg:right-6 overflow-hidden w-12 h-12 lg:w-16 lg:h-16 cursor-pointer rounded-full bg-background-theme p-3 border-2 border-blue-theme"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src="/Chatbot.png" alt="Chatbot" width={50} height={50} />
      </div>
      {isOpen && (
        <div className="fixed bottom-5 right-4 lg:right-4 w-[330px] h-[520px] z-40 bg-gray-700 border-2 border-blue-theme shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-theme text-black font-bold py-2 px-4 flex items-center justify-between">
            <p>ParsX</p>
            <XMarkIcon
              className="w-6 h-6 font-bold text-blue-theme p-[2px] bg-background-theme rounded-full cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="flex flex-col h-full">
            <div className="flex-[0.9] overflow-hidden overflow-y-auto p-4 text-white">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.role === 'user' ? 'text-right text-black' : 'text-left bg-white text-black'}`}
                >
                  <p className={`${msg.role === 'user' ? 'bg-blue-theme' : ''}`}>
                  <strong>{msg.role}:</strong> {msg.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-gray-800 p-2 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message"
                className="flex-1 p-2 border border-gray-300 rounded mr-2"
              />
              <PaperAirplaneIcon
                className="w-8 h-8 text-blue-theme cursor-pointer"
                onClick={sendMessage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParsX;