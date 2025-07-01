import React, { useState, useEffect } from "react";
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

const LOCATIONIQ_API_KEY = "YOUR_LOCATIONIQ_API_KEY";

const LocateOnMap = ({ handleLocateOnMap, handleLocateOnMapDetails }) => {
  const [position, setPosition] = useState(null); // Will be [lat, lng]
  const [searchQuery, setSearchQuery] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [isModalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  // Get user's current location on component mount
  useEffect(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        await fetchLocationDetails(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        toast.error("Unable to retrieve your location");
        setLoading(false);
      }
    );
  }, []);

  // Function to fetch reverse geocode from LocationIQ
  const fetchLocationDetails = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();

      if (data.error) {
        toast.error("Reverse geocoding error: " + data.error);
        setLocationDetails("No details available");
      } else {
        setLocationDetails(data.display_name);
        handleLocateOnMapDetails && handleLocateOnMapDetails(data, lat, lon);
      }
    } catch (error) {
      toast.error("Failed to fetch location details");
      setLocationDetails("No details available");
    }
  };

  // Handle search by place name using LocationIQ search API
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a location to search.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
          searchQuery
        )}&format=json`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        setPosition([latNum, lonNum]);
        setLocationDetails(display_name);
        handleLocateOnMapDetails && handleLocateOnMapDetails(data[0], latNum, lonNum);
      } else {
        alert("Location not found. Please try a different query.");
      }
    } catch (error) {
      toast.error("Error fetching search results.");
    }
    setLoading(false);
  };

  // Component to update map view and handle double-click for manual location pick
  const UpdateMapView = ({ position }) => {
    const map = useMap();

    useEffect(() => {
      toast.warn(
        "Location may not be 100% accurate. Please double-click on the map to select the exact location."
      );

      map.setView(position, 13);

      const onDblClick = async (e) => {
        const { lat, lng } = e.latlng;
        setLoading(true);
        try {
          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          setPosition([lat, lng]);
          setLocationDetails(data.display_name || "No details available");
          handleLocateOnMapDetails && handleLocateOnMapDetails(data, lat, lng);
          setModalVisible(false);
        } catch (error) {
          toast.error("Error fetching location details. Please try again.");
        }
        setLoading(false);
      };

      map.on("dblclick", onDblClick);
      return () => {
        map.off("dblclick", onDblClick);
      };
    }, [map, position]);

    return null;
  };

  if (!isModalVisible) return null;

  if (loading || !position) return <LoadingModal />;

  return (
    <div className="fixed inset-0 z-40 bg-opacity-40 bg-black flex justify-center items-center">
      <div className="bg-white border p-5 w-96 flex flex-col gap-4 rounded-lg shadow-lg relative">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">Search and Locate</h1>
          <button
            onClick={() => {
              setModalVisible(false);
              handleLocateOnMap && handleLocateOnMap();
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
            <Popup>
              {locationDetails || "Searched Location"}
              <br />
              Lat: {position[0].toFixed(5)}, Lng: {position[1].toFixed(5)}
            </Popup>
          </Marker>
          <UpdateMapView position={position} />
        </MapContainer>

        {/* Location Details */}
        {locationDetails && (
          <div className="bg-gray-100 p-3 rounded shadow">
            <h2 className="font-bold text-lg">Selected Location:</h2>
            <p>{locationDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocateOnMap;
