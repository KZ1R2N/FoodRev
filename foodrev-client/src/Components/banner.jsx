import React from 'react'
import bannerimg from '../../Images/bbqpizza.jpg'
export default function banner() {
    return (
        <div className='w-full'>
            <img src={bannerimg} className="relative w-full h-[400px] overflow-hidden" alt="Banner Image" />

        </div>
    )
}
