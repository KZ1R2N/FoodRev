import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../shared/AxiosInstance';
import { Context } from '../Context';
import PopupConfirm from '../shared/PopupConfirm';

export default function FoodDetails() {
    const { foodId } = useParams();
    const { reviews, setReviews, userId } = useContext(Context); // Get reviews and userId from Context
    const [food, setFood] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [showReviewsState, setShowReviewsState] = useState(false); // State to toggle reviews
    const [newReviewText, setNewReviewText] = useState(''); // State for new review text
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    useEffect(() => {
        // Fetch food details
        const fetchFoodDetails = async () => {
            try {
                const response = await axiosInstance.get(`/foods/${foodId}`);
                setFood(response.data);
            } catch (error) {
                console.error('Error fetching food details:', error);
            }
        };

        fetchFoodDetails();
    }, [foodId]);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }, []);

    useEffect(() => {
        if (userLocation && food) {
            // Initialize the map and directions
            const initializeMap = () => {
                const mapInstance = new window.google.maps.Map(
                    document.getElementById('map'),
                    {
                        center: userLocation,
                        zoom: 14,
                    }
                );

                const service = new window.google.maps.DirectionsService();
                const renderer = new window.google.maps.DirectionsRenderer();
                renderer.setMap(mapInstance);

                // Add a marker for the food location
                const marker = new window.google.maps.Marker({
                    position: { lat: food.latitude, lng: food.longitude },
                    map: mapInstance,
                    title: food.name,
                });

                // Adjust the map to fit both user and food locations
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend(userLocation);
                bounds.extend({ lat: food.latitude, lng: food.longitude });
                mapInstance.fitBounds(bounds);

                // Add a click listener to the marker to show directions
                marker.addListener('click', () => {
                    calculateRoute();
                });

                setMap(mapInstance);
                setDirectionsService(service);
                setDirectionsRenderer(renderer);
            };

            const script = document.createElement('script');
            script.src = `https://maps.gomaps.pro/maps/api/js?key=${import.meta.env.VITE_MAP_API}&libraries=geometry,places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [userLocation, food]);

    const calculateRoute = () => {
        if (directionsService && directionsRenderer && userLocation && food) {
            const request = {
                origin: userLocation,
                destination: { lat: food.latitude, lng: food.longitude },
                travelMode: 'DRIVING',
            };

            directionsService.route(request, (result, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error('Error calculating route:', status);
                }
            });
        }
    };

    const showReviews = () => {
        setShowReviewsState(!showReviewsState); // Toggle the review display state
    };

    const handleAddReview = async () => {
        if (newReviewText.trim() === '') return;

        const newReview = {
            foodId: foodId,
            reviewText: newReviewText,
            userId,
        };

        try {
            const response = await axiosInstance.post('/reviews', newReview);
            if (response.status === 201) {
                setReviews([...reviews, newReview]); // Add the new review to the state
                setNewReviewText(''); // Clear the input field
            }
        } catch (error) {
            console.error('Error adding review:', error);
        }
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
    if (!food) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    const foodReviews = reviews.filter((review) => review.foodId === foodId); // Filter reviews by foodId

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <div className="card bg-gray-800 shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">{food.name}</h1>
                <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2 text-gray-100">
                    <p><strong>Price:</strong> {food.price}</p>
                    <p><strong>Ratings:</strong> {food.ratings}</p>
                    <p><strong>Description:</strong> {food.description}</p>
                    <p><strong>Location:</strong> {food.location}</p>
                </div>
                <div id="map" className="mt-8 rounded-lg" style={{ height: '300px', width: '100%' }}></div>
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={showReviews}
                        className="btn btn-primary px-4 py-2 rounded-lg"
                    >
                        {showReviewsState ? 'Hide Reviews' : 'Show Reviews'}
                    </button>
                </div>
            </div>

            {showReviewsState && (
                <div className="mt-6 space-y-4">
                    <h2 className="text-xl font-semibold">Reviews</h2>
                    {foodReviews.length > 0 ? (
                        foodReviews.map((review) => (
                            <div
                                key={review._id}
                                className="p-4 bg-gray-800 rounded-lg shadow-md"
                            >
                                <p>{review.reviewText}</p>
                                <p className="text-sm text-gray-500">Reviewed by: User {review.userId}</p>
                                {review.userId === userId && (
                                    <button
                                        onClick={() => {
                                            console.log(review._id)
                                            setReviewToDelete(review._id);
                                            setIsPopupVisible(true);
                                        }}
                                        className="btn btn-danger mt-2 px-4 py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 mt-4">No reviews available for this food.</p>
                    )}
                </div>
            )}
                      {isPopupVisible && (
                <PopupConfirm
                    onConfirm={handleDeleteReview}
                    onCancel={() => setIsPopupVisible(false)}
                />
            )}
            <div className="mt-6">
                <textarea
                    placeholder="Write your review here..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="textarea textarea-bordered w-full rounded-lg p-2"
                ></textarea>
                <button
                    onClick={handleAddReview}
                    className="btn btn-secondary mt-4 px-4 py-2 rounded-lg w-full"
                >
                    Add Review
                </button>
            </div>
        </div>
    );
}
