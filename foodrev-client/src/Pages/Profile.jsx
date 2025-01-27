import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    AiOutlineDislike,
    AiOutlineLike,
    AiFillDislike,
    AiFillLike,
} from "react-icons/ai";
import { PiForkKnifeFill, PiForkKnifeLight } from "react-icons/pi";
import { GiKnifeFork } from "react-icons/gi";
import { Context } from "../Context";
import PopupConfirm from "../shared/PopupConfirm";
import LikersDislikers from "../shared/likersdislikers";
import axiosInstance from "../shared/AxiosInstance";

export default function Profile() {
    const navigate = useNavigate()
    const { userId } = useParams();
    const {
        users,
        reviews,
        setReviews,
        foods,
        likes,
        setLikes,
        follows,
        setFollows,
        userId: loggedinuser,
        loading,
        setLoading,
    } = useContext(Context);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [likers, setLikers] = useState([]);
    const [dislikers, setDislikers] = useState([]);


    useEffect(() => {
        setLoading(true); // Simulate a loading state
        setTimeout(() => {
            setLoading(false); // End loading after some time
        }, 1000); // Adjust the timeout duration as needed
    }, [setLoading]);

    const user = users.find((u) => u.user_id === parseInt(userId));
    const userReviews = reviews.filter((review) => review.userId === parseInt(userId));

    const calculateReactions = (reviewId, type) =>
        likes.filter((reaction) => reaction.reviewId === reviewId && reaction.type === type).length;

    const getIcon = (reviewId, type) => {
        const reaction = likes.find(
            (reaction) => reaction.reviewId === reviewId && reaction.userId === loggedinuser
        );

        if (reaction?.type === type) {
            return type === "like" ? AiFillLike : AiFillDislike;
        }

        return type === "like" ? AiOutlineLike : AiOutlineDislike;
    };

    const handleReaction = async (reviewId, type) => {
        if (loggedinuser === null) {
            
            return navigate("/login");
        }
        try {
            const response = await axiosInstance.post('/likedislikes', {
                reviewId,
                userId: loggedinuser,
                type,
            });
    
            if (response.status === 200 || response.status === 201) {
                // console.log(response.data.message);
    
                // Update the local likes state
                const updatedLikes = likes.filter(
                    (reaction) => !(reaction.reviewId === reviewId && reaction.userId === loggedinuser)
                );
                updatedLikes.push({ reviewId, userId: loggedinuser, type });
    
                setLikes(updatedLikes);
            } else {
                console.error('Unexpected response:', response.data);
            }
        } catch (error) {
            console.error('Error handling reaction:', error.response?.data || error.message);
        }
    };
    

    const handleFollow = async () => {
        if (loggedinuser === null) {
            
            return navigate("/login");
        }
        try {
            const response = await axiosInstance.post('/follow', {
                followerId: loggedinuser,
                followingId: user.user_id,
            });

            if (response.status === 201) {
                // Add to local state if follow was successful
                setFollows([...follows, { follower_id: loggedinuser, following_id: user.user_id }]);
            } else if (response.status === 200) {
                // Remove from local state if unfollow was successful
                setFollows(follows.filter(
                    (f) => !(f.follower_id === loggedinuser && f.following_id === user.user_id)
                ));
            }
        } catch (error) {
            console.error('Error following/unfollowing:', error);
        }
    };

    const getFoodDetails = (foodId) => {
        return foods.find((food) => food._id === foodId) || {};
    };

    const handleShowLikersDislikers = (reviewId, type) => {
        const targetUsers =
            type === "like"
                ? likes
                    .filter((like) => like.reviewId === reviewId && like.type === "like")
                    .map((like) => users.find((u) => u.user_id === like.userId))
                : likes
                    .filter((like) => like.reviewId === reviewId && like.type === "dislike")
                    .map((like) => users.find((u) => u.user_id === like.userId));

        if (type === "like") setLikers(targetUsers);
        else setDislikers(targetUsers);

        document.getElementById("likers-dislikers-modal").showModal();
    };

    const handleDeleteReview = async () => {
        console.log(reviewToDelete)
        if (!reviewToDelete) {
            console.error("No review selected for deletion.");
            return;
        }
    
        try {
            const response = await axiosInstance.delete(`/reviews/${reviewToDelete}`);
            if (response.status === 200) {
                // Remove the deleted review from the local state
                setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewToDelete));
                setReviewToDelete(null);
                console.log("Review deleted successfully!");
            } else {
                console.error("Failed to delete review:", response);
                console.log("Failed to delete the review. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting review:", error.response?.data || error.message);
            console.log("An error occurred while deleting the review.");
        } finally {
            setIsPopupVisible(false);
        }
    };
    

    const followersCount = follows.filter((follow) => follow.following_id === user.user_id).length;
    const isFollowing = follows.some(
        (follow) => follow.follower_id === loggedinuser && follow.following_id === user.user_id
    );

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return <div className="p-4">User not found.</div>;
    }

    return (
        <div className="p-4">
            <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">{user.gmail[0]}</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{user.gmail.split("@")[0]}</h1>
                    <p className="text-gray-500">Followers: {followersCount}</p>
                    <p className="text-gray-500">Email: {user.gmail}</p>
                    {loggedinuser !== parseInt(userId) && (
                        <button
                            className={`text-white ${isFollowing
                                ? "bg-red-700 hover:bg-red-800"
                                : "bg-green-700 hover:bg-green-800"
                                } font-medium rounded-full mt-3 text-sm px-5 py-2.5 text-center me-2 mb-2 flex`}
                            onClick={handleFollow}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                            {isFollowing ? (
                                <GiKnifeFork className="ml-2 text-xl text-white" />
                            ) : (
                                <PiForkKnifeFill className="ml-2 text-xl text-white" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
                <div className="space-y-6">
                    {userReviews.map((review) => {
                        const { name: foodName, image: foodImage } = getFoodDetails(review.foodId);

                        return (
                            <div
                                key={review._id}
                                className="card bg-base-100 shadow-xl mx-auto w-[95%] border-[2.5px] border-gray-500 rounded-lg mb-5"
                            >
                                <div className="flex">
                                    <img
                                        src={foodImage}
                                        alt={foodName}
                                        className="w-1/3 h-48 object-cover rounded-l-lg"
                                    />
                                    <div className="p-4 flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{foodName}</h3>
                                        <p className="mb-4">{review.reviewText}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className="cursor-pointer text-xl"
                                                    onClick={() => handleReaction(review._id, "like")}
                                                >
                                                    {React.createElement(getIcon(review._id, "like"), {
                                                        className: "hover:text-green-500",
                                                    })}
                                                </span>
                                                <span
                                                    className="cursor-pointer text-xl"
                                                    onClick={() =>
                                                        handleReaction(review._id, "dislike")
                                                    }
                                                >
                                                    {React.createElement(getIcon(review._id, "dislike"), {
                                                        className: "hover:text-red-500",
                                                    })}
                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <span
                                                    className="mr-4 text-gray-500 hover:text-gray-700 hover:underline cursor-pointer"
                                                    onClick={() =>
                                                        handleShowLikersDislikers(review._id, "like")
                                                    }
                                                >
                                                    Likes: {calculateReactions(review._id, "like")}
                                                </span>
                                                <span
                                                    className="text-gray-500 hover:text-gray-700 hover:underline cursor-pointer"
                                                    onClick={() =>
                                                        handleShowLikersDislikers(review._id, "dislike")
                                                    }
                                                >
                                                    Dislikes: {calculateReactions(review._id, "dislike")}
                                                </span>
                                            </div>
                                        </div>
                                        {loggedinuser === parseInt(userId) && (
                                            <button
                                                onClick={() => {
                                                    console.log(review._id)
                                                    setReviewToDelete(review._id);
                                                    setIsPopupVisible(true);
                                                }}
                                                className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-full text-sm px-4 py-2 mt-2"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PopupConfirm for Delete */}
            {isPopupVisible && (
                <PopupConfirm
                    onConfirm={handleDeleteReview}
                    onCancel={() => setIsPopupVisible(false)}
                />
            )}

            {/* Likers and Dislikers Popup */}
            <LikersDislikers
                id="likers-dislikers-modal"
                likers={likers}
                dislikers={dislikers}
                onClose={() =>
                    document.getElementById("likers-dislikers-modal").close()
                }
            />
        </div>
    );
}
