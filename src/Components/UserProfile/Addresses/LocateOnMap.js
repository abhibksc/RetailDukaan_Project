import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LoadingModal from "../../LoadingModal";
import { toast } from "react-toastify";

// Fix for Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocateOnMap = ({ handleLocateOnMap, handleLocateOnMapDetails }) => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)
  const [searchQuery, setSearchQuery] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [isModalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);


  const UpdateMapView = ({ position }) => {
    setLoading(true)
    const map = useMap();

    map.on("dblclick", async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();


        handleLocateOnMapDetails(data, lat, lng);

        setPosition([lat, lng]);
        setLocationDetails(data.display_name || "No details available");
        setModalVisible(false);
      } catch (error) {
        setLoading(false)
        console.error("Error fetching location details:", error);

        toast.error("Try Again!!")
      }
    });

    map.setView(position, 13); // Pan to the new position with zoom level 13

    setLoading(false)
    return null;
  };

  const handleSearch = async () => {
    setLoading(true)
    if (!searchQuery.trim()) {
      alert("Please enter a location to search.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setLocationDetails(display_name);
      } else {
        alert("Location not found. Please try a different query.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Unable to perform the search. Please try again.");
    }
    setLoading(false)

  };

  if (!isModalVisible) return null;

  if(loading) return <LoadingModal/>

  return (
    <div className="fixed inset-0 z-20 bg-opacity-40 bg-black flex justify-center items-center">
      <div className="bg-white border p-5 w-96 flex flex-col gap-4 rounded-lg shadow-lg relative">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">Search and Locate</h1>
          <button
            onClick={() => {
              setModalVisible(false);
              handleLocateOnMap();
            }}
            className="bg-gray-400 text-white px-2 py-1 rounded-full"
          >
            X
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search for a city, town, or place"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded p-2 flex-grow"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* Map */}
        <MapContainer
          center={position}
          zoom={13}
          className="h-80 w-full rounded-lg"
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>{locationDetails || "Searched Location"}</Popup>
          </Marker>
          <UpdateMapView position={position} />
        </MapContainer>

        {/* Location Details */}
        {locationDetails && (
          <div className="bg-gray-100 p-3 rounded shadow">
            <h2 className="font-bold text-lg">Searched Location:</h2>
            <p>{locationDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocateOnMap;
