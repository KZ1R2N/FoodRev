import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../Components/banner';
import FoodCart from '../Components/FoodCart';
import { Context } from '../Context';
import { FiSearch } from 'react-icons/fi'; // Import the search icon

export default function Home() {
    const { foods, loading } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFoods, setFilteredFoods] = useState([]);
    const navigate = useNavigate();
    const searchInputRef = useRef(null); // Ref for search input

    useEffect(() => {
        // Filter foods based on the search term
        const results = foods.filter((food) =>
            food.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFoods(results);
    }, [searchTerm, foods]);

    useEffect(() => {
        // Focus on the search input when the page loads
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    const handleShowDetails = (foodId) => {
        navigate(`/food-details/${foodId}`);
    };

    return (
        <div>
            <Banner />
            <div className="absolute left-8 top-[250px] flex w-full max-w-md">
                <div className="relative w-full">
                    <input
                        type="text"
                        ref={searchInputRef} // Attach the ref to the search input
                        className="w-full px-4 py-2 pr-10 rounded border-2 border-blue-900 focus:outline-none"
                        placeholder="Search for foods"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiSearch size={20} />
                    </span>
                </div>
            </div>
            <h2>Foods: {filteredFoods.length}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
                {filteredFoods.map((food, index) => (
                    <FoodCart
                        key={index}
                        food={food}
                        onShowDetails={() => handleShowDetails(food._id)}
                    />
                ))}
            </div>
        </div>
    );
}
