import React from 'react'

export default function FoodCart({food}) {
    return (
        <div className="card card-compact bg-base-100 w-96 shadow-xl">
            <figure>
                <img
                    src={food.image}
                    alt={food.name}/>
                    {console.log(food.image)}
            </figure>
            <div className="card-body">
                <h2 className="card-title">{food.ratings}</h2>
                <p>{food.price}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Show Details</button>
                </div>
            </div>
        </div>
    )
}
