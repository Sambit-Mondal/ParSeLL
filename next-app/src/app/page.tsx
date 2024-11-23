'use client';
import { redirect } from 'next/navigation';

const Home = () => {
  redirect('/auth');
  return null;
}

export default Home