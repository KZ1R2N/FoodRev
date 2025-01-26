import React from 'react';

export default function FoodCart({ food, onShowDetails }) {
    return (
        <div className="card card-compact bg-base-100 w-96 shadow-xl">
            <figure>
                <img
                    className="h-60 w-full"
                    src={food.image}
                    alt={food.name}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{food.name}</h2>
                <p>Price: {food.price}</p>
                <p>Ratings: {food.ratings}</p>
                <div className="card-actions justify-end">
                    <button
                        className="btn btn-primary"
                        onClick={onShowDetails}
                    >
                        Show Details
                    </button>
                </div>
            </div>
        </div>
    );
}
