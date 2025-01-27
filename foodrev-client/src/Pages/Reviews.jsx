import React, { useContext } from "react";
import { Context } from "../Context";
import ReviewCard from "../Components/ReviewCard.jsx";
import UserList from "../Components/userList";
import { AiOutlineDislike, AiOutlineLike, AiFillDislike, AiFillLike } from "react-icons/ai";
import axiosInstance from "../shared/AxiosInstance";
import { useNavigate } from "react-router";

export default function Reviews() {
    const navigate = useNavigate()
    const {
        userId,
        foods,
        setFoods,
        reviews,
        likes,
        setReviews,
        foodReviewState,
        setFoodReviewState,
        newReviewText,
        setNewReviewText,
        foodIdToReview,
        setFoodIdToReview,
        loading,
        setLikes,
        users, // User data
    } = useContext(Context);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    const calculateReactions = (reviewId, type) =>
        likes.filter((reaction) => reaction.reviewId === reviewId && reaction.type === type).length;

    const handleReaction = async(reviewId, type) => {
        if (userId === null) {
           
            return  navigate("/login");
        }
        const existingReaction = likes.find(
            (reaction) => reaction.reviewId === reviewId && reaction.userId === userId
        );

        const newLikes = likes.filter(
            (reaction) => reaction.reviewId !== reviewId || reaction.userId !== userId
        );
        try {
            const response = await axiosInstance.post('/likedislikes', {
                reviewId,
                userId,
                type,
            });
    
            if (response.status === 200) {

                if (!existingReaction || existingReaction.type !== type) {
                    newLikes.push({
                        id: likes.length + 1,
                        reviewId,
                        userId,
                        type,
                    });
                }
        
                setLikes(newLikes);
            }
        } catch (error) {
            console.error("Error updating reaction:", error);
        }

    };

    const handleShowAll = (foodId) => {
        setFoodReviewState((prevState) => ({
            ...prevState,
            [foodId]: { ...prevState[foodId], showAll: !prevState[foodId]?.showAll },
        }));
    };

    const getMostLikedReview = (foodId) => {
        const foodReviews = reviews.filter((review) => review.foodId === foodId);
        if (foodReviews.length === 0) return null;

        return foodReviews.reduce((prev, current) =>
            calculateReactions(current._id, "like") >
            calculateReactions(prev._id, "like")
                ? current
                : prev
        );
    };

    const getUserIdByReviewId = (reviewId) => {
        const review = reviews.find((review) => review._id === reviewId);
        return review ? review.userId : null;
    };

    const getIcon = (reviewId, type) => {
        const reaction = likes.find(
            (reaction) => reaction.reviewId === reviewId && reaction.userId === userId
        );

        if (reaction?.type === type) {
            return type === "like" ? AiFillLike : AiFillDislike;
        }

        return type === "like" ? AiOutlineLike : AiOutlineDislike;
    };

    const handleAddReview = async(foodId) => {
        if (userId === null) {
           
            return  navigate("/login");
        }
        if (newReviewText.trim() === "") return;

        const newReview = {
           
            foodId,
            reviewText: newReviewText,
            userId,
        };


        try {
            const response = await axiosInstance.post("/reviews", newReview);
            if (response.status === 201) {
              // Update the local state with the newly added review
              setReviews([...reviews, newReview]);
              setNewReviewText("");
              setFoodIdToReview(null);
              console.log("Review added successfully");
            }
          } catch (error) {
            console.error("Error adding review:", error);
          }
    };

    return (
        <div className="p-4 flex">
            {/* Left Section: Reviews */}
            <div className="w-3/4 space-y-6">
                {foods.map((food) => {
                    const mostLikedReview = getMostLikedReview(food._id);
                    const totalLikes = reviews
                        .filter((review) => review.foodId === food._id)
                        .reduce((total, review) => total + calculateReactions(review._id, "like"), 0);
                    const totalDislikes = reviews
                        .filter((review) => review.foodId === food._id)
                        .reduce((total, review) => total + calculateReactions(review._id, "dislike"), 0);

                    return (
                        <ReviewCard
                            key={food._id}
                            food={food}
                            mostLikedReview={mostLikedReview}
                            reviews={reviews}
                            setReviews={setReviews}
                            totalLikes={totalLikes}
                            totalDislikes={totalDislikes}
                            calculateReactions={calculateReactions}
                            handleReaction={handleReaction}
                            getUserIdByReviewId={getUserIdByReviewId}
                            getIcon={getIcon}
                            foodReviewState={foodReviewState}
                            handleShowAll={handleShowAll}
                            foodIdToReview={foodIdToReview}
                            setFoodIdToReview={setFoodIdToReview}
                            newReviewText={newReviewText}
                            setNewReviewText={setNewReviewText}
                            handleAddReview={handleAddReview}
                        />
                    );
                })}
            </div>

            {/* Right Section: User List */}
            <UserList users={users} />
        </div>
    );
}
