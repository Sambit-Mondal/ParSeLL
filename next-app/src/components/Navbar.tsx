'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import SignoutButton from './SignoutButton';
import Image from 'next/image';
import ProfileButton from './ProfileButton';
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';

const Navbar = () => {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (pathname === '/seller/dashboard') {
            setActiveTab('Dashboard');
        } else if (pathname.startsWith('/seller/orders')) {
            setActiveTab('Manage Your Orders');
        } else if (pathname === '/seller/documents') {
            setActiveTab('Manage Your Documents');
        } else if (pathname === '/seller/shipment') {
            setActiveTab('Shipment Management');
        } else if (pathname === '/seller/analytics') {
            setActiveTab('Analytics and Insights');
        } else {
            setActiveTab('');
        }
    }, [pathname]);

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
            <div onClick={toggleNavbar} className='fixed top-4 left-4 z-[90] text-white cursor-pointer'>
                {isOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
            </div>
            {isOpen &&
                <div className='fixed inset-0 bg-black bg-opacity-70 z-40' />
            }
            <div id="navbar" className={`text-white bg-background-theme h-full fixed left-0 flex flex-col items-center justify-between p-5 px-10 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='text-2xl font-extrabold tracking-wider'>
                    <Link href='/' className='flex items-center justify-center gap-5'>
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
                        <li
                            className={`nav-item cursor-pointer ${activeTab === 'Dashboard' ? 'active' : ''}`}
                        >
                            <Link href='/seller/dashboard'>
                                Dashboard
                            </Link>
                        </li>
                        <li
                            className={`nav-item cursor-pointer ${activeTab === 'Manage Your Orders' ? 'active' : ''}`}
                        >
                            <Link href='/seller/orders'>
                                Manage Your Orders
                            </Link>
                        </li>
                        <li
                            className={`nav-item cursor-pointer ${activeTab === 'Manage Your Documents' ? 'active' : ''}`}
                        >
                            <Link href='/seller/documents'>
                                Manage Your Documents
                            </Link>
                        </li>
                        <li
                            className={`nav-item cursor-pointer ${activeTab === 'Shipment Management' ? 'active' : ''}`}
                        >
                            <Link href='/seller/shipment'>
                                Shipment Management
                            </Link>
                        </li>
                        <li
                            className={`nav-item cursor-pointer ${activeTab === 'Analytics and Insights' ? 'active' : ''}`}
                        >
                            <Link href='/seller/analytics'>
                                Analytics and Insights
                            </Link>
                        </li>
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