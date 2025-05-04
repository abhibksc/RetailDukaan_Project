import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // For custom marker icons

const Track_order = () => {
  const { lat, long } = useParams(); // Get lat and long from the URL params
  const [position, setPosition] = useState([lat, long]);

  // Log the data and update position when the component mounts
  useEffect(() => {
    console.log("Latitude:", lat); // Log latitude
    console.log("Longitude:", long); // Log longitude
    setPosition([parseFloat(lat), parseFloat(long)]); // Set the position in state
  }, [lat, long]); // Only run when lat or long change

  // Custom marker icon using Font Awesome rocket icon
  const customIcon = new L.DivIcon({
    className: "leaflet-rocket-icon", // Custom class for styling
    html: `<i class="fas fa-rocket text-4xl text-yellow-500"></i>`, // Rocket icon with Tailwind styles
    iconSize: [40, 40],  // Size of the icon
    iconAnchor: [20, 40], // Anchor to make the marker point correctly
    popupAnchor: [0, -40], // To adjust popup position
  });

  // Map styling from CartoDB for a more aesthetic view
  const tileLayerUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Track Order</h1>
      
      <div className="mb-4">
        <p className="text-xl text-gray-600"><strong>Latitude:</strong> {lat}</p>
        <p className="text-xl text-gray-600"><strong>Longitude:</strong> {long}</p>
      </div>

      <div className="h-96 mt-4">
        <MapContainer
          center={position}
          zoom={13}
          className="w-full h-full"
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer url={tileLayerUrl} />

          <Marker position={position} icon={customIcon}>
            <Popup>
              <div>
                <strong>Location:</strong>
                <p>{`Lat: ${lat}, Long: ${long}`}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Track_order;
