import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface CardProps {
    resource: {
        image: string;
        title: string;
        description: string;
        url: string;
    };
}

const Card = ({ resource }: CardProps) => {
    return (
        <div className='flex items-center justify-center gap-10 w-full p-10 border-2 border-blue-theme rounded-md transition duration-200 ease-in-out shadow-md bg-modal-theme drop-shadow-sm shadow-blue-theme hover:drop-shadow-sm hover:shadow-lg hover:shadow-blue-theme hover:scale-105 z-10 cursor-pointer'>
            <Image
                src={resource.image}
                alt={resource.title}
                className='rounded-full size-[9.5rem]'
                width={140}
                height={140}
            />
            <div className='flex flex-col h-full justify-center gap-6'>
                <div className='font-bold text-white text-xl'>{resource.title}</div>
                <div className='font-normal text-white text-[1.05rem]'>
                    {resource.description}
                </div>
            </div>
        </div>
    );
};

const buyerResources = [
    {
        image: '/Buyer-Orders.png',
        title: 'Track Your Orders',
        description: 'Monitor your orders in real-time with detailed tracking information.',
        url: '/buyer/orders',
    },
    {
        image: '/Buyer-Wishlist.png',
        title: 'Product Management',
        description: 'Save your favorite products and manage your wishlist effortlessly.',
        url: '/buyer/wishlist',
    },
    {
        image: '/Buyer-Analytics.png',
        title: 'Analytics and Insights',
        description: 'Gain insights into your shopping behavior and trends.',
        url: '/buyer/analytics',
    },
];

const sellerResources = [
    {
        image: '/Disaster-Analysis.jpeg',
        title: 'Manage Orders',
        description: 'View and manage your orders with ease.',
        url: '/seller/orders',
    },
    {
        image: '/Victim-Detection.png',
        title: 'Manage Your Documents',
        description: 'Utilize advanced technology for seamless document management.',
        url: '/seller/documents',
    },
    {
        image: '/Insurance-Claims.png',
        title: 'Manage Your Products',
        description: 'Manage your products and inventory efficiently.',
        url: '/seller/products',
    },
    {
        image: '/Chatbot.png',
        title: 'Realtime-Chat',
        description: 'Connect with Buyers and resolve their queries instantly.',
        url: '/seller/chat',
    },
];

const Services = () => {
    const [role, setRole] = useState<'Buyer' | 'Seller' | null>(null);

    useEffect(() => {
        // Fetch user role from local storage or API
        const fetchUserRole = async () => {
            const email = localStorage.getItem('user-email');
            if (!email) {
                toast.error('User email not found');
                return;
            }

            try {
                const response = await fetch(`/api/profile?email=${email}`);
                if (!response.ok) throw new Error('Failed to fetch user role');
                const data = await response.json();
                setRole(data.role);
            } catch (error) {
                toast.error('Failed to load user data');
                console.error('Fetch User Error:', error);
            }
        };

        fetchUserRole();
    }, []);

    const resources = role === 'Buyer' ? buyerResources : role === 'Seller' ? sellerResources : [];

    return (
        <div className='grid grid-cols-2 gap-x-20 mt-14 gap-y-16 pb-10'>
            {resources.map((resource, index) => (
                <Link href={resource.url} key={index}>
                    <Card resource={resource} />
                </Link>
            ))}
        </div>
    );
};

export default Services;