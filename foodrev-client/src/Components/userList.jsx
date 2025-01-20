import React from "react";
import { Link } from "react-router-dom";

export default function UserList({ users }) {
    return (
        <div className="w-1/4 p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-white">Users</h3>
            <ul className="space-y-2">
                {users.map((user, index) => (
                    <li key={index}>
                        <Link
                            to={`/profile/${user.user_id}`}
                            className="btn btn-wide hover:bg-blue-600 text-white bg-blue-500"
                        >
                            {`User ${user.user_id}`}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
