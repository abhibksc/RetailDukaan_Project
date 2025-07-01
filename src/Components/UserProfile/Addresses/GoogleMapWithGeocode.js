import React, { useEffect, useState } from "react";

const GOOGLE_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

const GoogleMapWithGeocode = ({handleLocateOnMap, onLocationSelect }) => {
  const [position, setPosition] = useState(null); // { lat, lng }
  const [searchText, setSearchText] = useState("");
  const [locationDetails, setLocationDetails] = useState(null);
  const [error, setError] = useState("");

  // Get current location using browser API
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
      },
      () => setError("Unable to retrieve your location")
    );
  }, []);

  // Reverse geocode to get address from lat/lng
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const formattedAddress = data.results[0]?.formatted_address;
        setLocationDetails(formattedAddress);
        onLocationSelect && onLocationSelect({ lat, lng }, formattedAddress);
      } else {
        setError("Failed to reverse geocode location");
      }
    } catch (e) {
      setError("Error fetching location details");
    }
  };

  // Geocode address or pincode to get lat/lng
  const geocodeAddress = async () => {
    if (!searchText.trim()) {
      alert("Please enter address or pincode");
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchText
        )}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        const formattedAddress = data.results[0].formatted_address;
        setPosition(location);
        setLocationDetails(formattedAddress);
        onLocationSelect && onLocationSelect(location, formattedAddress);
      } else {
        alert("Location not found, please try a different query.");
      }
    } catch (e) {
      setError("Error fetching location data");
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-opacity-40 bg-black flex justify-center items-center">
      <div className="bg-white border p-5 w-96 flex flex-col gap-4 rounded-lg shadow-lg relative">

        <div onClick={handleLocateOnMap} className="cursor-pointer text-3xl">
            x
        </div>
        <div className="p-4 max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-2">Find Your Location</h2>

          <input
            type="text"
            placeholder="Enter address or pincode"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <button
            onClick={geocodeAddress}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Search
          </button>

          {error && <p className="text-red-600 mb-2">{error}</p>}

          {position && (
            <div>
              <p>
                <strong>Latitude:</strong> {position.lat}
              </p>
              <p>
                <strong>Longitude:</strong> {position.lng}
              </p>
              <p>
                <strong>Address:</strong> {locationDetails}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapWithGeocode;
