import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../shared/AxiosInstance';

export default function FoodDetails() {
    const { foodId } = useParams();
    const [food, setFood] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);

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

    if (!food) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{food.name}</h1>
            <img
                src={food.image}
                alt={food.name}
                className="w-full max-w-md mx-auto"
            />
            <p className="mt-4">Price: {food.price}</p>
            <p>Ratings: {food.ratings}</p>
            <p>Description: {food.description}</p>
            <p>Location: {food.location}</p>
            <div id="map" className="mt-8" style={{ height: '400px', width: '100%' }}></div>
        </div>
    );
}
