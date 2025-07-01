import { useState } from "react";
import { toast } from "react-toastify";
import { checkPincodeAvailability } from "../Components/CrudOperations/GetOperation";

const usePincodeValidation = () => {
  const [loading, setLoading] = useState(false);

  const Address_cleanUP = (setAddressDetails , setLocation) => {
    setAddressDetails((prev) => ({
      ...prev,
      Locality: "",
      City: "",
      full_addresss: "",
      state: "",
      pin_code: "",
      landmark: "",
    }));

    setLocation({ latitude: "", longitude: "" });

  };

  const getLatLongFromPincode = async (pincode, setAddressDetails , setLocation) => {
    const apiKey = "2b803d74b243492a860e3659937ab0a4";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      } else {
        Address_cleanUP(setAddressDetails , setLocation);
        toast.error("No results found for this pincode.");
        return null;
      }
    } catch (error) {
      Address_cleanUP(setAddressDetails);
      toast.error("Error fetching coordinates");
      return null;
    }
  };

  const fetchAddressFromCoords = async (lat, lng, setAddressDetails , setLocation) => {
    try {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();

      if (data.address?.postcode) {
        const pincodeResponse = await checkPincodeAvailability(data.address.postcode);

        if (pincodeResponse?.data?.message === "Available") {
          setAddressDetails((prev) => ({
            ...prev,
            Locality: data?.address?.suburb || "",
            City: data?.address?.city || data?.address?.state_district || "",
            full_addresss: data?.display_name || "",
            state: data?.address?.state || "",
            pin_code: data?.address?.postcode || "",
            landmark: data?.address?.neighbourhood || "",
          }));


          setLocation(

            { latitude: lat,
              
              longitude: lng }


          )
        } else {
          Address_cleanUP(setAddressDetails);
          toast.warn(pincodeResponse?.data?.message || "Unavailable pincode");
        }
      } else {
        Address_cleanUP(setAddressDetails);
        toast.warn("Pincode not found or incorrect.");
      }
    } catch (err) {
      Address_cleanUP(setAddressDetails);
      toast.error("Failed to fetch address from coordinates.");
    }
  };

  const verifyPincode = async (pincode, setAddressDetails , setLocation) => {
    setLoading(true);
    const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;

    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();

      if (data[0].Status === "Success") {
        const coords = await getLatLongFromPincode(pincode, setAddressDetails , setLocation);
        if (coords?.latitude && coords?.longitude) {
          await fetchAddressFromCoords(coords.latitude, coords.longitude, setAddressDetails ,setLocation);
          return coords;
        } else {
          Address_cleanUP(setAddressDetails , setLocation);
          toast.error("Lat/Long not found.");
        }
      } else {
        Address_cleanUP(setAddressDetails , setLocation);
        toast.warn("Invalid pincode.");
      }
    } catch (err) {
      Address_cleanUP(setAddressDetails , setLocation);
      toast.error("Error verifying pincode.");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = async (setAddressDetails, setLocation) => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });

        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          const address = data?.address || {};

          if (address?.postcode) {
            setAddressDetails((prev) => ({
              ...prev,
              Locality: address?.suburb || "",
              City: address?.city || address?.state_district || "",
              full_addresss: data?.display_name || "",
              state: address?.state || "",
              pin_code: address?.postcode || "",
              landmark: address?.neighbourhood || "",
            }));
            verifyPincode(address?.postcode, setAddressDetails);
          }
        } catch (err) {
          toast.error("Error getting current location address.");
                Address_cleanUP(setAddressDetails , setLocation);
        }
      },
      (err) => {
          Address_cleanUP(setAddressDetails , setLocation);
        toast.error("Permission denied or failed to fetch location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return {
    loading,
    verifyPincode,
    handleCurrentLocation,
  };
};

export default usePincodeValidation;
