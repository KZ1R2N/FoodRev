import React from 'react'
import bannerimg from '../../Images/bbqpizza.jpg'
export default function banner() {
    return (
        <div className='w-full'>
            <img src={bannerimg} className="relative w-full h-[400px] overflow-hidden" alt="Banner Image" />
            <div className="absolute left-8 top-[250px] flex w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search..."
                    className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none"
                />
                <button className="px-4 py-2 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 transition duration-300">
                    Search
                </button>
            </div>
        </div>
    )
}
