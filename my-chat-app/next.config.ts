import type { NextConfig } from "next";
require('dotenv').config();
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, 
  env: { 
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID, 
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
   },
};

export default nextConfig;
