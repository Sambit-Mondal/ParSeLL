'use client';
import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation';

const SignoutButton = () => {
    const router = useRouter();

    const handleSignout = async () => {
        try {
            await axios.post('/api/signout');
            router.push('/auth');
        } catch (error) {
            console.error('Signout Error:', error);
        }
    };

    return (
        <button className='w-full border-2 border-blue-theme py-2 px-8 rounded-md text-white transition duration-200 ease-in-out hover:bg-red-600' onClick={handleSignout}>
            Signout
        </button>
    )
}

export default SignoutButton