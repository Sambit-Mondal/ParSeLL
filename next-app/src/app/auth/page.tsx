'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BriefcaseIcon, EnvelopeIcon, KeyIcon, PhoneIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import axios, { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
    const route = useRouter();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    const handleSignupClick = () => {
        setIsSignup(!isSignup);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSignup) {
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match. Check and try again!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            try {
                await axios.post('/api/signup', {
                    username: formData.username,
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password,
                    phone: formData.phone,
                });

                toast.success('Signup successful', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setIsSignup(false);
            } catch (error) {
                toast.error('Login failed: ' + ((error as AxiosError<{ message: string }>).response?.data?.message || 'Unknown error'), {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } else {

            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match. Check and try again!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            try {
                const response = await axios.post('/api/login', {
                    email: formData.email,
                    role: formData.role,
                    password: formData.password,
                });
            
                if (response.status === 200) {
                    const token = response.data.token;
                    const dashboard = response.data.dashboard;
            
                    // Store the token and user email in localStorage
                    localStorage.setItem('auth-token', token);
                    localStorage.setItem('user-email', formData.email);
            
                    toast.success('Login successful', {
                        position: 'top-center',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
            
                    // Redirect to the respective dashboard
                    route.push(`/${dashboard}`);
                }
            } catch (error) {
                toast.error('Login failed: ' + ((error as AxiosError<{ message: string }>).response?.data?.message || 'Unknown error'), {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }            
        }
    };

    return (
        <div className='bg-body-bg w-full h-screen flex items-center justify-center'>
            <ToastContainer />
            <div className={`bg-navbar-bg w-[70%] flex items-center justify-center rounded-lg drop-shadow-xl shadow-xl shadow-gray-700 h-[70%] transition-all duration-500 ease-in-out ${isSignup ? 'flex-row-reverse' : ''}`}>

                {/* Welcome Section */}
                <div className='w-1/2 h-full flex items-center justify-between gap-28 flex-col text-center text-white p-10'>
                    <div className='flex gap-5 flex-col items-center justify-between'>
                        <div className='font-bold text-3xl'>{isSignup ? 'Welcome!' : 'Welcome Back!'}</div>
                        <div>{isSignup ? 'Please fill in your details to signup and continue.' : 'Please login with your credentials to continue.'}</div>
                    </div>
                    <div className='w-full gap-2 flex flex-col'>
                        <div className='text-sm'>
                            {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}
                        </div>
                        <button
                            className='text-white border-[1px] border-white rounded-md w-full py-2 text-sm transition duration-200 ease-in-out hover:bg-green-950'
                            onClick={handleSignupClick}
                        >
                            {isSignup ? 'Login' : 'Signup'}
                        </button>
                    </div>
                </div>

                {/* Signin/Signup */}
                <form className={`w-3/4 h-full flex items-center flex-col p-8 py-4 bg-auth-bg ${!isSignup ? 'rounded-r-md' : 'rounded-l-md'}`} onSubmit={handleSubmit}>
                    <div className={`w-full h-full overflow-hidden overflow-y-auto flex flex-col items-center justify-between px-4 ${isSignup ? 'p-5 gap-6' : ''}`}>
                        {isSignup &&
                            <>
                                <div className='relative flex flex-col w-full'>
                                    <label className={`text-white pb-1 font-bold ${isSignup ? '' : 'mt-5'}`}>Name</label>
                                    <div className='relative'>
                                        <UserCircleIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-gray-600' />
                                        <input
                                            type='text'
                                            name='name'
                                            placeholder='Enter your Name'
                                            className='pl-10 p-2 border border-gray-300 rounded w-full'
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='relative flex flex-col w-full'>
                                    <label className={`text-white pb-1 font-bold ${isSignup ? '' : 'mt-5'}`}>Username</label>
                                    <div className='relative'>
                                        <UserCircleIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-gray-600' />
                                        <input
                                            type='text'
                                            name='username'
                                            placeholder='Enter your Username'
                                            className='pl-10 p-2 border border-gray-300 rounded w-full'
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        }

                        <div className='relative flex flex-col w-full'>
                            <label className={`text-white pb-1 font-bold ${isSignup ? '' : 'mt-5'}`}>Email</label>
                            <div className='relative'>
                                <EnvelopeIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-gray-600' />
                                <input
                                    type='email'
                                    name='email'
                                    placeholder='Enter your email'
                                    className='pl-10 p-2 border border-gray-300 rounded w-full'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className='relative flex flex-col w-full'>
                            <label className={`text-white pb-1 font-bold ${isSignup ? '' : 'mt-5'}`}>Role</label>
                            <div className='relative'>
                                <BriefcaseIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-gray-600' />
                                <select
                                    name='role'
                                    className='pl-10 p-2 border border-gray-300 rounded w-full'
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value=''>Select your role</option>
                                    <option value='Seller'>Seller</option>
                                    <option value='Buyer'>Buyer</option>
                                </select>
                            </div>
                        </div>


                        {isSignup &&
                            <div className='relative flex flex-col w-full'>
                                <label className={`text-white pb-1 font-bold ${isSignup ? '' : 'mt-5'}`}>Phone</label>
                                <div className='relative'>
                                    <PhoneIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-gray-600' />
                                    <input
                                        type='phone'
                                        name='phone'
                                        placeholder='Enter your Phone number'
                                        className='pl-10 p-2 border border-gray-300 rounded w-full'
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        }

                        <div className='relative flex flex-col w-full'>
                            <label className={`text-white pb-1 font-bold ${isSignup ? '' : 'mt-5'}`}>Password</label>
                            <div className='relative'>
                                <KeyIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-gray-600' />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    placeholder='Enter your password'
                                    className='pl-10 pr-10 p-2 border border-gray-300 rounded w-full'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <div
                                    className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOpenIcon className='size-5 text-gray-600' />
                                    ) : (
                                        <EyeClosedIcon className='size-5 text-gray-600' />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='relative flex flex-col w-full'>
                            <label className={`text-white pb-1 font-bold ${isSignup ? '' : 'mt-5'}`}>Confirm Password</label>
                            <div className='relative'>
                                <KeyIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-gray-600' />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    placeholder='Confirm your password'
                                    className='pl-10 pr-10 p-2 border border-gray-300 rounded w-full'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <div
                                    className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOpenIcon className='size-5 text-gray-600' />
                                    ) : (
                                        <EyeClosedIcon className='size-5 text-gray-600' />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className='w-full py-2 bg-black mt-8 font-bold text-white rounded-md transition duration-200 ease-in-out hover:bg-gray-800'>
                        {isSignup ? 'Signup' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;