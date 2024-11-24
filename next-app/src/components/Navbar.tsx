'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import SignoutButton from './SignoutButton';
import Image from 'next/image';
import ProfileButton from './ProfileButton';
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState({
        role: ''
    });

    const router = useRouter();

    useEffect(() => {
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
                toast.success('User data loaded successfully!', { autoClose: 2000 });
            } catch (error) {
                toast.error('Failed to load user data');
                console.error('Fetch User Error:', error);
            }
        };

        fetchUserData();
    }, [router]);

    useEffect(() => {
        if (userData.role === 'Seller') {
            if (pathname === '/seller/dashboard') {
                setActiveTab('Dashboard');
            } else if (pathname.startsWith('/seller/orders')) {
                setActiveTab('Manage Your Orders');
            } else if (pathname === '/seller/documents') {
                setActiveTab('Manage Your Documents');
            } else if (pathname === '/seller/products') {
                setActiveTab('Manage Your Products');
            } else if (pathname === '/seller/chat') {
                setActiveTab('Realtime-Chat');
            } else {
                setActiveTab('');
            }
        } else if (userData.role === 'Buyer') {
            if (pathname === '/buyer/dashboard') {
                setActiveTab('Dashboard');
            } else if (pathname.startsWith('/buyer/orders')) {
                setActiveTab('Your Orders');
            } else if (pathname === '/buyer/orders') {
                setActiveTab('Wishlist');
            } else if (pathname === '/buyer/chat') {
                setActiveTab('Realtime-Chat');
            } else {
                setActiveTab('');
            }
        }
    }, [pathname, userData.role]);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const closeNavbar = useCallback((e: MouseEvent) => {
        if (isOpen && (e.target as HTMLElement).id !== 'navbar' && !(e.target as HTMLElement).closest('#navbar')) {
            setIsOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', closeNavbar);
        } else {
            document.removeEventListener('click', closeNavbar);
        }

        return () => {
            document.removeEventListener('click', closeNavbar);
        };
    }, [isOpen, closeNavbar]);

    return (
        <>
            <div onClick={toggleNavbar} className='fixed top-4 left-4 z-[90] text-white cursor-pointer size-10 p-2 font-extrabold bg-background-theme flex items-center justify-center rounded-full border-2 border-blue-theme'>
                {isOpen ? <Cross1Icon className='size-6' /> : <HamburgerMenuIcon className='size-6' />}
            </div>
            {isOpen &&
                <div className='fixed inset-0 bg-black bg-opacity-70 z-40' />
            }
            <div id="navbar" className={`text-white bg-background-theme h-full fixed left-0 flex flex-col items-center justify-between p-5 px-10 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='text-2xl font-extrabold tracking-wider pt-6'>
                    <Link href='/' className='flex items-center justify-center gap-3'>
                        <Image
                            src='/Logo.png'
                            alt='ParSeLL'
                            className='size-14 rounded-full'
                            width={200}
                            height={200}
                        />
                        <p>ParSeLL</p>
                    </Link>
                </div>
                <div className='flex items-center justify-center flex-col gap-10'>
                    <ul className='flex items-center justify-center flex-col gap-8 px-8 text-[0.92rem]'>
                        {userData.role === 'Seller' ? (
                            <>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Dashboard' ? 'active' : ''}`}>
                                    <Link href='/seller/dashboard'>Dashboard</Link>
                                </li>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Manage Your Orders' ? 'active' : ''}`}>
                                    <Link href='/seller/orders'>Manage Your Orders</Link>
                                </li>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Manage Your Documents' ? 'active' : ''}`}>
                                    <Link href='/seller/documents'>Manage Your Documents</Link>
                                </li>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Manage Your Products' ? 'active' : ''}`}>
                                    <Link href='/seller/products'>Manage Your Products</Link>
                                </li>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Realtime-Chat' ? 'active' : ''}`}>
                                    <Link href='/seller/analytics'>Realtime-Chat</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Dashboard' ? 'active' : ''}`}>
                                    <Link href='/buyer/dashboard'>Dashboard</Link>
                                </li>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Track Your Orders' ? 'active' : ''}`}>
                                    <Link href='/buyer/orders'>Track Your Orders</Link>
                                </li>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Product Management' ? 'active' : ''}`}>
                                    <Link href='/buyer/product'>Product Management</Link>
                                </li>
                                <li className={`nav-item cursor-pointer ${activeTab === 'Chat' ? 'active' : ''}`}>
                                    <Link href='/buyer/chat'>Realtime-Chat</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className='w-full flex flex-col justify-center items-center gap-4'>
                        <ProfileButton />
                        <SignoutButton />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;