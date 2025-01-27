import React, { createContext, useState, useEffect } from "react";
import auth from './Firebase/firebase'
import {onAuthStateChanged ,signInWithPopup, signInWithEmailAndPassword  } from "firebase/auth";

// Create the Context
export const Context = createContext();
export const baseURL = "http://localhost:5000"
// Create the ContextProvider
export function ContextProvider({ children }) {
    const [foods, setFoods] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [likes, setLikes] = useState([]);
    const [users, setUsers] = useState([]);
    const [foodReviewState, setFoodReviewState] = useState({});
    const [newReviewText, setNewReviewText] = useState("");
    const [foodIdToReview, setFoodIdToReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [follows, setFollows] = useState([]);
const [userId, setUserId] = useState(null);

const [userDetails, setUserDetails] = useState(null)





const signout = () => {
    setLoading(true);
    auth.signOut().then(() => {
     setLoading(false);
        console.log("User signed out successfully");
        setUserDetails(null);
        setUserId(null);
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}
    // Fetch data from JSON files
    useEffect(() => {
       const unsubscribe= onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/auth.user
              setLoading(false);
              const uid = user.uid;
              setUserId(uid)
              setUserDetails(user)
              // ...
            } else {
              // User is signed out
              // ...
            }
          });
          return () => unsubscribe()
      
    },[])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const foodResponse = await fetch(`${baseURL}/foods`);
                const reviewResponse = await fetch(`${baseURL}/reviews`);
                const likeResponse = await fetch(`${baseURL}/likedislikes`);
                const userResponse = await fetch("/users.json");
                const followResponse = await fetch(`${baseURL}/follows`)

                const foodData = await foodResponse.json();
                const reviewData = await reviewResponse.json();
                const likeData = await likeResponse.json();
                const userData = await userResponse.json();
                const followData = await followResponse.json();

                setFoods(foodData);
                setReviews(reviewData);
                setLikes(likeData);
                setUsers(userData);
                setFollows(followData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching JSON data:", error);
            }
        };

        fetchData();
    }, []);

    // Provide the states and setters to children
    return (
        <Context.Provider
            value={{
                foods,
                setFoods,
                reviews,
                setReviews,
                likes,
                setLikes,
                users,
                setUsers,
                foodReviewState,
                setFoodReviewState,
                newReviewText,
                setNewReviewText,
                foodIdToReview,
                setFoodIdToReview,
                loading,
                setLoading,
                follows,
                setFollows,
                userId,
                setUserId,
                userDetails,
                setUserDetails,
                signout,
   
              
            }}
        >
            {children}
        </Context.Provider>
    );
}
