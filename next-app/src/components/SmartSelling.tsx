import React from 'react'

const SmartSelling = () => {
    return (
        <div className='w-1/3 flex flex-col items-center justify-between bg-modal-theme p-10 rounded-md border-[1px] border-blue-theme drop-shadow-md shadow-blue-theme shadow-md transition duration-200 ease-in-out hover:shadow-lg hover:shadow-blue-theme'>
            <div className='text-white uppercase font-extrabold tracking-wider'>
                SmartSelling
            </div>
            <hr className='border-0 w-full h-[1px] mt-3 mb-8 bg-blue-theme' />
            <div className='text-white'>
                ParSeLL harnesses the power of NLP and Generative AI to create a seamless and intuitive global selling experience. By simplifying language barriers and optimizing seller-buyer interactions, it enables businesses to connect with international markets effortlessly.
            </div>
        </div>
    )
}

export default SmartSelling;