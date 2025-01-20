import React from "react";
import {
    AiOutlineDislike,
    AiOutlineLike,
    AiFillDislike,
    AiFillLike,
} from "react-icons/ai";

export default function ReviewCard({
    food,
    mostLikedReview,
    reviews,
    setReviews,
    totalLikes,
    totalDislikes,
    calculateReactions,
    handleReaction,
    getUserIdByReviewId,
    getIcon,
    foodReviewState,
    handleShowAll,
    foodIdToReview,
    setFoodIdToReview,
    newReviewText,
    setNewReviewText,
    handleAddReview,
}) {
    const showAll = foodReviewState[food._id]?.showAll;

    return (
        <div
            key={food._id}
            className="card bg-base-100 shadow-xl mx-auto w-[95%] border-[2.5px] border-gray-500 rounded-lg mb-5"
        >
            <figure>
                <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{food.name}</h2>
                <p>{food.description}</p>
                <p>Total Likes: {totalLikes} | Total Dislikes: {totalDislikes}</p>
                <h4 className="mt-4 text-md font-semibold">Highest Liked Review</h4>
                {mostLikedReview ? (
                    <div className="my-4 border-b pb-2">
                        <p>{mostLikedReview.reviewText}</p>
                        <p className="text-sm text-gray-500">
                            Reviewed by: User {getUserIdByReviewId(mostLikedReview._id)}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-4">
                                <span
                                    onClick={() => handleReaction(mostLikedReview._id, "like")}
                                    className="cursor-pointer text-xl"
                                >
                                    {React.createElement(getIcon(mostLikedReview._id, "like"), {
                                        className: "hover:text-green-500",
                                    })}
                                </span>
                                <span
                                    onClick={() => handleReaction(mostLikedReview._id, "dislike")}
                                    className="cursor-pointer text-xl"
                                >
                                    {React.createElement(getIcon(mostLikedReview._id, "dislike"), {
                                        className: "hover:text-red-500",
                                    })}
                                </span>
                            </div>
                            <div className="text-sm flex items-center">
                                <span className="mr-2">
                                    Likes: {calculateReactions(mostLikedReview._id, "like")}
                                </span>
                                <span>
                                    Dislikes: {calculateReactions(mostLikedReview._id, "dislike")}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No reviews available for this food.</p>
                )}
                {showAll ? (
                    <>
                        {reviews
                            .filter(
                                (review) =>
                                    review.foodId === food._id &&
                                    review._id !== mostLikedReview?._id
                            )
                            .map((review) => (
                                <div key={review._id} className="my-4 p-2 border-b">
                                    <p>{review.reviewText}</p>
                                    <p className="text-sm text-gray-500">
                                        Reviewed by: User {getUserIdByReviewId(review._id)}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-4">
                                            <div
                                                onClick={() =>
                                                    handleReaction(review._id, "like")
                                                }
                                                className="cursor-pointer text-xl"
                                            >
                                                {React.createElement(getIcon(review._id, "like"), {
                                                    className: "hover:text-green-500",
                                                })}
                                            </div>
                                            <div
                                                onClick={() =>
                                                    handleReaction(review._id, "dislike")
                                                }
                                                className="cursor-pointer text-xl"
                                            >
                                                {React.createElement(getIcon(review._id, "dislike"), {
                                                    className: "hover:text-red-500",
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-sm flex ml-9">
                                            <span className="ml-6 mr-2">
                                                Likes: {calculateReactions(review._id, "like")}
                                            </span>
                                            <span>
                                                Dislikes: {calculateReactions(review._id, "dislike")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        <button
                            onClick={() => handleShowAll(food._id)}
                            className="text-blue-500 mt-2"
                        >
                            Show Less
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => handleShowAll(food._id)}
                        className="text-blue-500 mt-2"
                    >
                        Show All Reviews
                    </button>
                )}
                {foodIdToReview === food._id ? (
                    <div className="mt-4">
                        <input
                            type="text"
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            placeholder="Write your review"
                            className="input input-bordered w-full"
                        />
                        <div className="flex mt-2 gap-2">
                            <button
                                onClick={() => handleAddReview(food._id)}
                                className="btn btn-primary"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setFoodIdToReview(null)}
                                className="btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setFoodIdToReview(food._id)}
                        className="btn btn-secondary mt-4"
                    >
                        Add Review
                    </button>
                )}
            </div>
        </div>
    );
}
