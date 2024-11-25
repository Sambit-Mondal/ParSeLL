'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

interface User {
  uniqueID: string;
  name: string;
  role: string;
}

interface Message {
  text: string;
  user: string;
  sender: boolean;
  timestamp: string;
}

const SellerChat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [userData, setUserData] = useState({ uniqueID: '', name: '', role: '' });
  const [targetLang, setTargetLang] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  const searchParams = useSearchParams();
  const sellerID = searchParams.get('sellerID');
  const buyerID = searchParams.get('buyerID');

  const fetchUserData = async () => {
    const email = localStorage.getItem('user-email');

    if (!email) {
      toast.error('User email not found');
      return;
    }

    try {
      const response = await fetch(`/api/profile?email=${email}`);
      if (!response.ok) {
        throw new Error('Error fetching user data');
      }
      const data = await response.json();
      setUserData(data);
      console.log('Fetched user data:', data);

      const languageResponse = await fetch(`/api/language?country=${data.country}`);
      const languageData = await languageResponse.json();
      setTargetLang(languageData.language);
      
      const usersResponse = await fetch('/api/users', {
        headers: {
          uniqueID: data.uniqueID,
        },
      });
      const usersData = await usersResponse.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (sellerID && buyerID) {
      const room = `${sellerID}-${buyerID}`;
      socket.emit('joinRoom', room);

      socket.on('previousMessages', (previousMessages) => {
        setMessages(previousMessages);
      });

      socket.on('message', (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        socket.off('previousMessages');
        socket.off('message');
      };
    }
  }, [sellerID, buyerID]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!targetLang) {
      toast.error('Target language is not set.');
      return;
    }

    const detectResponse = await fetch('/api/detect-language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    });

    const detectData = await detectResponse.json();
    const sourceLang = detectData.language;

    const translateResponse = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: input,
        sourceLang,
        targetLang,
      }),
    });

    const translateData = await translateResponse.json();

    const translatedMessage = {
      text: translateData.translatedText,
      user: userData.name,
      sender: userData.role === 'seller',
      timestamp: new Date().toISOString(),
      room: `${sellerID}-${buyerID}`,
    };

    socket.emit('message', translatedMessage);
    setMessages((prev) => [...prev, translatedMessage]);
    setInput('');
  };

  const handleUserClick = (user: User) => {
    const newRoom = `${user.uniqueID}-${userData.uniqueID}`;
    router.push(`/seller/chat?sellerID=${userData.uniqueID}&buyerID=${user.uniqueID}`);
  };

  return (
    <div className="flex bg-background-theme items-center justify-center w-screen h-screen">
      <div className="flex w-full h-full">
        <div className="w-1/4 h-full bg-sidebar-theme p-4 bg-gray-600">
          <h2 className="text-xl font-bold pt-4 mb-4 text-center text-blue-theme">Chats</h2>
          <hr className='border-0 h-[2px] bg-blue-theme' />
          <ul>
            {users.map((user, idx) => (
              <li key={idx} className="mb-2 p-2 rounded bg-chat-item hover:bg-chat-item-hover cursor-pointer" onClick={() => handleUserClick(user)}>
                <strong>{user.name}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Chat Section */}
        <div className="w-3/4 px-8 pt-8 pb-3 flex flex-col justify-between items-center font-sans">
          <div className="border-2 w-full h-full border-blue-theme rounded p-4 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`p-2 rounded max-w-xs shadow ${msg.sender ? 'bg-green-200' : 'bg-white'}`}
                >
                  <strong>{msg.user}:</strong> {msg.text}
                  <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex mt-4 w-full">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow p-2 mr-2 rounded border border-gray-300"
            />
            <button
              onClick={sendMessage}
              className="py-2 px-6 border-2 border-blue-theme text-white rounded-md transition duration-150 ease-in-out hover:bg-gray-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerChat;