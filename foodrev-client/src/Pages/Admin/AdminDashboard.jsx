import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../Context";

export default function AdminDashboard() {
    const { users, reviews, foods } = useContext(Context);
    const navigate = useNavigate();

    const stats = [
        {
            title: "Users",
            count: users.length,
            bgColor: "bg-blue-500",
            navigateTo: "/admin/users",
        },
        {
            title: "Reviews",
            count: reviews.length,
            bgColor: "bg-green-500",
            navigateTo: "/admin/reviews",
        },
        {
            title: "Foods",
            count: foods.length,
            bgColor: "bg-red-500",
            navigateTo: "/admin/foods",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-lg shadow-lg text-white ${stat.bgColor} cursor-pointer hover:scale-105 transform transition duration-200`}
                        onClick={() => navigate(stat.navigateTo)}
                    >
                        <h2 className="text-2xl font-semibold text-center">{stat.title}</h2>
                        <p className="text-4xl font-bold text-center mt-4">{stat.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
