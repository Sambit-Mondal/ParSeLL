'use client';
import React from "react";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Features from "@/components/Features";
import SmartSelling from "@/components/SmartSelling";
import GlobalConnect from "@/components/GlobalConnect";
import TradeFlow from "@/components/TradeFlow";
import Services from "@/components/Services";

const SellerDashboard = () => {

  return (
    <div className="bg-background-theme w-full min-h-screen pt-12 px-10 pb-8 overflow-hidden overflow-y-auto">
      <div className="flex flex-col items-center justify-center gap-2 relative">
        <div className="font-extrabold text-4xl tracking-widest text-white">ParSeLL</div>
        <div className="font-semibold text-xl tracking-wider text-blue-theme flex items-center justify-center gap-3">Cross-border Exports simplified!</div>
        <button
          className="flex absolute right-0 items-center justify-center gap-2 my-auto py-3 text-white font-bold text-lg border-2 border-blue-theme rounded-md px-6 transition duration-200 ease-in-out hover:bg-gray-700"
          onClick={() => {
            const servicesSection = document.getElementById('services-section');
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Get Started
          <ArrowRightCircleIcon className="size-8" />
        </button>
      </div>
      <div className="w-full flex items-center justify-between gap-5 mt-16">
        <SmartSelling />
        <GlobalConnect />
        <TradeFlow />
      </div>
      <div className="mt-24">
        <div className="text-white font-bold text-3xl tracking-wider">FEATURES</div>
        <hr className='border-0 w-full h-[2px] mt-5 bg-blue-theme' />
      </div>
      <Features />
      <div className="mt-14" id="services-section">
        <div className="text-white font-bold text-3xl tracking-wider">SERVICES</div>
        <hr className='border-0 w-full h-[2px] mt-5 bg-blue-theme' />
      </div>
      <Services />
    </div>
  );
};

export default SellerDashboard;