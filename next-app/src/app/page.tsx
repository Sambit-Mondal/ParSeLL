'use client';
import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Home = () => {
  const router = useRouter(); // Hook for navigation
  const [userData, setUserData] = useState({
    uniqueID: '',
    role: ''
  });

  const fetchUserData = async () => {
    const email = localStorage.getItem('user-email');

    if (!email) {
      toast.error('User email not found');
      router.push('/auth');
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

      // Redirect based on role
      if (data.role) {
        router.push(`/${data.role.toLowerCase()}/dashboard`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data');
      router.push('/auth'); // Redirect in case of error
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="bg-background-theme w-full h-screen">
      Redirecting...
    </div>
  );
};

export default Home;