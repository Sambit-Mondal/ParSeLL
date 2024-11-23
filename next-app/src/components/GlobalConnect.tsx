import React from 'react'

const GlobalConnect = () => {
    return (
        <div className='w-1/3 flex flex-col items-center justify-between bg-modal-theme p-10 rounded-md border-[1px] border-blue-theme drop-shadow-md shadow-blue-theme shadow-md transition duration-200 ease-in-out hover:shadow-lg hover:shadow-blue-theme'>
            <div className='text-white uppercase font-extrabold tracking-wider'>
                GlobalConnect
            </div>
            <hr className='border-0 w-full h-[1px] mt-3 mb-8 bg-blue-theme' />
            <div className='text-white'>
                With a real-time multilingual chat system powered by AWS translation services, ParSeLL ensures effective communication across time zones and languages. Additionally, its VerifyBOT automatically cross-verifies import-export documentation.
            </div>
        </div>
    )
}

export default GlobalConnect;