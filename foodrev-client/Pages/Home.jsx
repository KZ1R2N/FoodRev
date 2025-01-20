import React, {useContext, useEffect, useState } from 'react';
import Banner from '../src/Components/banner'; // Ensure the correct casing in the import
import FoodCart from '../src/Components/FoodCart'; // Import your FoodCart component if not done
import { baseURL } from '../src/Context';
import { Context } from '../src/Context';


export default function Home() {
    const {foods, loading } = useContext(Context); 

    
    if (loading) {
        return <div className="fixed inset-0 flex items-center justify-center z-50"><span className="loading loading-spinner text-primary"></span>
        </div>; // Show loading indicator
    }




    return (
        <div>
            <Banner />
            <h2>Foods: {foods.length}</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 py-8'>
            {
                    foods.map((food, index)=> <FoodCart key={index} food={food}></FoodCart>)
            }
            </div>

              
        </div>
    );
}
