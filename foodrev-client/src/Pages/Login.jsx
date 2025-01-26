import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BsGoogle } from "react-icons/bs";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import auth from "../Firebase/firebase";
import { Context } from "../Context";

export default function Login() {
  const provider = new GoogleAuthProvider();
  const { setUserId, setUserDetails } = useContext(Context);
  const [errorMessage, setErrorMessage] = useState(""); // State to store the error message

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUserId(result.user.uid);
        setUserDetails(result.user);
      })
      .catch((error) => {
        console.error("Error during Google Sign-In:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setUserId(result.user.uid);
        setUserDetails(result.user);
        setErrorMessage(""); 
      })
      .catch((error) => {
        setErrorMessage("Invalid email or password. Please try again."); // Set the error message
        // console.error("Error during email/password login:", error);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              className="input input-bordered w-full"
              required
            />
          </div>
          {/* Display error message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-500">Or</p>
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline btn-primary w-full flex items-center justify-center space-x-2"
          >
            <BsGoogle className="text-lg text-gray-700" />
            <span className="text-gray-700">Continue with Google</span>
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/Registration"
            className="text-primary hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
