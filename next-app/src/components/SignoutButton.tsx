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
        <button className='bg-red-600 h-full w-full z-50' onClick={handleSignout}>
            Signout</button>
    )
}

export default SignoutButton