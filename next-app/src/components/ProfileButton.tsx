'use client';
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation';

const ProfileButton = () => {
    const pathname = usePathname();
    const isProfilePage = pathname === '/profile';

    return (
        <Link href='/profile' className={`w-full flex items-center justify-center border-2 border-blue-theme py-2 px-8 rounded-md text-white transition duration-200 ease-in-out ${isProfilePage ? 'bg-blue-theme text-black' : 'hover:bg-gray-700'}`}>
            My Profile
        </Link>
    )
}

export default ProfileButton