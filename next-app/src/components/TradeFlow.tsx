import React from 'react'

const TradeFlow = () => {
    return (
        <div className='w-1/3 flex flex-col items-center justify-between bg-modal-theme p-10 rounded-md border-[1px] border-blue-theme drop-shadow-md shadow-blue-theme shadow-md transition duration-200 ease-in-out hover:shadow-lg hover:shadow-blue-theme'>
            <div className='text-white uppercase font-extrabold tracking-wider'>
                TradeFlow
            </div>
            <hr className='border-0 w-full h-[1px] mt-3 mb-8 bg-blue-theme' />
            <div className='text-white'>
                ParSeLL&apos;s dynamic shipment management system offers real-time shipment tracking for importers and robust negotiation tools for exporters to arrange logistics efficiently. The AWS-powered "May I Help You" chatbot further enhances user experience.
            </div>
        </div>
    )
}

export default TradeFlow