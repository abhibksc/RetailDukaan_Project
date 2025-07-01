import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  GoogleMap, 
  Marker, 
  InfoWindow, 
  useLoadScript,
  Autocomplete
} from "@react-google-maps/api";

const libraries = ["places"]; // needed for Autocomplete

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const defaultCenter = { lat: 20.27, lng: 85.84 }; // fallback default (e.g., India center)

export default function LocateOnGoogleMap({ onLocationSelect }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef();

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    libraries,
  });

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setCurrentPosition(defaultCenter);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        reverseGeocode(position.coords.latitude, position.coords.longitude);
      },
      () => {
        alert("Unable to retrieve your location");
        setCurrentPosition(defaultCenter);
      }
    );
  }, []);

  // Reverse geocode latlng to address
  const reverseGeocode = useCallback((lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setAddress(results[0].formatted_address);
          setSelected({ lat, lng });
          onLocationSelect && onLocationSelect({
            lat,
            lng,
            address: results[0].formatted_address,
          });
        } else {
          setAddress("No address found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }, [onLocationSelect]);

  // On map click to select location manually
  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  // When autocomplete loads
  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  // When place selected from autocomplete
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelected({ lat, lng });
        setAddress(place.formatted_address || place.name);
        setCurrentPosition({ lat, lng });
        onLocationSelect && onLocationSelect({
          lat,
          lng,
          address: place.formatted_address || place.name,
        });
        mapRef.current && mapRef.current.panTo({ lat, lng });
      } else {
        alert("No details available for input: '" + place.name + "'");
      }
    } else {
      alert("Autocomplete is not loaded yet!");
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Select Location on Google Map</h2>

      <Autocomplete
        onLoad={onLoadAutocomplete}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search location"
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            width: "100%",
            height: "40px",
            padding: "0 12px",
            borderRadius: "3px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={currentPosition || defaultCenter}
        options={options}
        onClick={onMapClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        {selected && (
          <Marker position={selected}>
            <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
              <div>
                <h4>Selected Location</h4>
                <p>{address}</p>
                <p>
                  Lat: {selected.lat.toFixed(5)}, Lng: {selected.lng.toFixed(5)}
                </p>
              </div>
            </InfoWindow>
          </Marker>
        )}
      </GoogleMap>
    </div>
  );
}
