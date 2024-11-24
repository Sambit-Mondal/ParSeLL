'use client';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        username: '',
        name: '',
        email: '',
        phone: '',
        address: '',
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

            toast.info('Loading user data...', { autoClose: 1000 });
            try {
                const response = await fetch(`/api/profile?email=${email}`);
                if (!response.ok) {
                    throw new Error('Error fetching user data');
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                toast.error('Failed to load user data');
                console.error('Fetch User Error:', error);
            }
        };

        fetchUserData();
    }, [router]);

    const handleUpdate = async () => {
        try {
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                toast.success('Profile updated successfully!', { autoClose: 2000 });
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            toast.error('Profile update failed');
            console.error('Update Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/profile/delete?email=${userData.email}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Profile deleted successfully', { autoClose: 2000 });
                router.push('/auth');
            } else {
                throw new Error('Failed to delete profile');
            }
        } catch (error) {
            toast.error('Profile deletion failed');
            console.error('Delete Error:', error);
        }
    };

    return (
        <div className='bg-background-theme w-full h-screen p-10 flex gap-10 items-center justify-center pt-24'>
            <ToastContainer />
            <div className='w-1/3 bg-modal-theme flex items-center flex-col justify-between p-10 gap-8 rounded-md drop-shadow-md shadow-blue-theme shadow-lg border-[1px] border-blue-theme'>
                <div className='flex items-center justify-center flex-col gap-3 w-full'>
                    <div className='relative'>
                        <div className='bg-black rounded-full flex items-center justify-center border-2 border-blue-theme'>
                            <UserCircleIcon className='size-28 text-white' />
                        </div>
                    </div>
                    <div className='flex items-center justify-center gap-3'>
                        <div className='text-white font-extrabold text-lg tracking-wider'>{userData.username}</div>
                        <div className='text-blue-theme font-normal text-sm tracking-wider'>{userData.role}</div>
                    </div>
                </div>
                <div className='w-full'>
                    <div className='w-full flex flex-col justify-center gap-2'>
                        <label className='text-white font-bold'>Name</label>
                        <input
                            type='text'
                            value={userData.name}
                            className='w-full bg-modal-theme text-white border-[1px] tracking-wider px-3 border-blue-theme rounded-md py-2 text-sm'
                            disabled
                        />
                    </div>
                </div>
                <div className='w-full'>
                    <div className='w-full flex flex-col justify-center gap-2'>
                        <label className='text-white font-bold'>Email</label>
                        <input
                            type='text'
                            value={userData.email}
                            className='w-full bg-modal-theme text-white border-[1px] tracking-wider rounded-md px-3 border-blue-theme py-2 text-sm'
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div className='w-2/3 bg-modal-theme flex items-center flex-col justify-between p-10 gap-8 rounded-md drop-shadow-md shadow-blue-theme shadow-lg border-[1px] border-blue-theme'>
                <div className='w-full flex flex-col items-center justify-center gap-6 overflow-hidden overflow-y-auto'>
                    <div className='w-full'>
                        <div className='w-full flex flex-col justify-center gap-2'>
                            <label className='text-white font-bold'>Name</label>
                            <input
                                type='text'
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className='w-full bg-modal-theme text-white border-[1px] tracking-wider px-3 border-blue-theme rounded-md py-2 text-sm'
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='w-full flex flex-col justify-center gap-2'>
                            <label className='text-white font-bold'>Phone Number</label>
                            <input
                                type='text'
                                value={userData.phone}
                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                className='w-full bg-modal-theme text-white border-[1px] tracking-wider px-3 border-blue-theme rounded-md py-2 text-sm'
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='w-full flex flex-col justify-center gap-2'>
                            <label className='text-white font-bold'>Address</label>
                            <textarea
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                className='w-full bg-modal-theme text-white border-[1px] tracking-wider px-3 border-blue-theme rounded-md py-2 text-sm'
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full flex items-center justify-center gap-10 pt-4'>
                    <button
                        className='w-full border-blue-theme border-[1px] text-white py-2 rounded-md transition duration-200 ease-in-out hover:bg-gray-700'
                        onClick={handleUpdate}
                    >
                        Update Profile
                    </button>
                    <button
                        className='w-full bg-red-600 border-blue-theme border-[1px] text-white py-2 rounded-md transition duration-200 ease-in-out hover:bg-red-900'
                        onClick={handleDelete}
                    >
                        Delete Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;