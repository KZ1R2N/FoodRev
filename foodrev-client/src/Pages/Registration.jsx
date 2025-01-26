import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import auth from "../Firebase/firebase";

export default function Registration() {
    const handleSubmit = async (e) => {
 // Destructure setUserId from Context
    e.preventDefault();
    const fullName = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value; 
    const confirmPassword = e.target.confirmPassword.value;
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
       updateProfile(user, {
        displayName: fullName,
    });
      console.log(user)

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
  
    });

          }
    return (
        <div className="flex items-center justify-center h-5/6 bg-gray-900">
            <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <div>
                        <label htmlFor="userName" className="block font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            placeholder="Enter Username"
                            className="input input-bordered w-full"
                            required
                        />
                    </div> */}
                    <div>
                        <label htmlFor="name" className="block font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Create a password"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary hover:underline font-medium"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
