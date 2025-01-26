import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../shared/AxiosInstance";
import PopupConfirm from "../../shared/PopupConfirm";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
export default function FoodsPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    ratings: "",
    description: "",
    image: "",
  });
  const [foods, setFoods] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const fetchFoods = async () => {
    try {
      const response = await axiosInstance.get("/foods");
      setFoods(response.data);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      console.log("Please select a location on the map.");
      return;
    }

    const foodData = {
      ...formData,
      location: selectedLocation.address,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };

    try {
      if (isEditing) {
        // Update food
        await axiosInstance.put(`/foods/${editingFoodId}`, foodData);
        console.log("Food updated successfully!");
      } else {
        // Add new food
        await axiosInstance.post("/foods", foodData);
        console.log("Food added successfully!");
      }

      setFormData({
        name: "",
        price: "",
        ratings: "",
        description: "",
        image: "",
      });
      setSelectedLocation(null);
      setIsEditing(false);
      setEditingFoodId(null);
      fetchFoods();
    } catch (error) {
      console.error("Error saving food:", error.response?.data || error.message);
      console.log("Failed to save food. Please try again.");
    }
  };

  const handleEdit = (food) => {
    setFormData({
      name: food.name,
      price: food.price,
      ratings: food.ratings,
      description: food.description,
      image: food.image,
    });
    setSelectedLocation({
      lat: food.latitude,
      lng: food.longitude,
      address: food.location,
    });
    setIsEditing(true);
    setEditingFoodId(food._id);
  };

  const handleDelete = (foodId) => {
    setFoodToDelete(foodId);
    setIsPopupVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/foods/${foodToDelete}`);
      console.log("Food deleted successfully!");
      setFoodToDelete(null);
      fetchFoods();
    } catch (error) {
      console.error("Error deleting food:", error.response?.data || error.message);
      console.log("Failed to delete food. Please try again.");
    } finally {
      setIsPopupVisible(false);
    }
  };

  const cancelDelete = () => {
    setFoodToDelete(null);
    setIsPopupVisible(false);
  };

  const handleLoadMap = () => {
    const script = document.createElement("script");
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${import.meta.env.VITE_MAP_API}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const defaultLocation = { lat: 23.8103, lng: 90.4125 }; // Dhaka, Bangladesh

      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 12,
      });

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "bd" },
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setSelectedLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
          });

          new window.google.maps.Marker({
            position: place.geometry.location,
            map,
          });

          map.setCenter(place.geometry.location);
        }
      });
    };

    document.body.appendChild(script);
    setIsMapLoaded(true);
  };

  return (
    <div className="w-3/4 container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Foods</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Fields */}
        <div>
          <label className="block font-medium">Food Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter food name"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter price"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Ratings</label>
          <input
            type="number"
            name="ratings"
            value={formData.ratings}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter ratings"
            step="0.1"
            max="5"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
            placeholder="Enter description"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter image link"
            required
          />
        </div>
        {!isMapLoaded && (
          <button
            type="button"
            onClick={handleLoadMap}
            className="btn btn-secondary w-full"
          >
            Set Location
          </button>
        )}
        {isMapLoaded && (
          <>
            <div>
              <label className="block font-medium">Location</label>
              <input
                id="pac-input"
                ref={inputRef}
                className="input input-bordered w-full"
                placeholder="Search for location"
              />
            </div>
            <div
              id="map"
              ref={mapRef}
              className="mt-4"
              style={{ height: "400px", width: "100%" }}
            ></div>
            {selectedLocation && (
              <p className="text-gray-600 mt-2">
                Selected Location: {selectedLocation.address} (Lat: {selectedLocation.lat}, Lng:{" "}
                {selectedLocation.lng})
              </p>
            )}
          </>
        )}
        <button type="submit" className="btn btn-primary w-full">
          {isEditing ? "Update Food" : "Add Food"}
        </button>
      </form>

      {/* Food List */}
      <h2 className="text-xl font-bold mt-8 mb-4">Foods List</h2>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food._id}>
              <td className="border px-4 py-2">{food.name}</td>
              <td className="border px-4 py-2">${food.price}</td>
              <td className="border px-4 py-2">
                <button
                  className="btn btn-sm btn-warning mr-6 ml-2"
                  onClick={() => handleEdit(food)}
                >
                 <FaEdit></FaEdit>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(food._id)}
                >
                  <MdDeleteForever></MdDeleteForever>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup for Delete Confirmation */}
      {isPopupVisible && (
        <PopupConfirm onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
}
