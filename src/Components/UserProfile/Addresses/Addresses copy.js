import React, { useEffect, useState } from "react";
import Sidebar from "../../Header&SideBar/Sidebar";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { postAddress } from "../../CrudOperations/PostOperation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Update_Particular_addresss } from "../../CrudOperations/Update&Edit";
import { Delete_Particular_addresss } from "../../CrudOperations/DeleteOperation";
import {
  addAddress,
  addSingleAddress,
  modifyAddress,
  removeAddress,
} from "../../ReduxStore/Slices/auth";
import LocateOnMap from "./LocateOnMap";
import {
  checkPincodeAvailability,
  getAllAddress,
} from "../../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import ValidationModal from "./ValidationModal";
import { log } from "tone/build/esm/core/util/Debug";
import useAddressActions from "../../Product/useAddressActions";
import LoadingModal from "../../LoadingModal";
import LocateOnGoogleMap from "./LocateOnGoogleMap";
import GoogleMapWithGeocode from "./GoogleMapWithGeocode";

const Addresses = () => {
  const { ImportAddress } = useAddressActions();

  const SavedAddresss = useSelector((state) => state.auth.address);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [hide, setHide] = useState({ hide: "" });
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [editMode, setEditMode] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // setValidationMessage
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [SavedAddress, setSavedAddress] = useState(SavedAddresss);

  const [IsValidationModal, setIsValidationModal] = useState(false);

  const handleLocationValidation = (value) => {
    console.log("Chala");
  };

  const onClose = () => {
    setIsValidationModal(!IsValidationModal);
  };

  const [mapModal, setMapModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSavedAddress(SavedAddresss);
  }, [SavedAddresss]); // Depend on SavedAddresss

  const [addressDetails, setAddressDetails] = useState({
    name: "",
    phone: "",
    Locality: "",
    City: "",
    full_addresss: "",
    state: "",
    alternate_phone: "",
    pin_code: "",
    landmark: "",
    address_type: "",
  });

  const Address_cleanUP = () => {
    setAddressDetails({
      name: "",
      phone: "",
      Locality: "",
      City: "",
      full_addresss: "",
      state: "",
      alternate_phone: "",
      // pin_code: "",
      landmark: "",
      address_type: "",
    });
  };

  async function getLatLongFromPincode(pincode) {
    const apiKey = "2b803d74b243492a860e3659937ab0a4"; // Replace with your actual API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      } else {
        Address_cleanUP();
        toast.error("No results found for this pincode.");

        return null;
      }
    } catch (error) {
      Address_cleanUP();
      toast.error("Error fetching coordinates:", error);
      return null;
    }
  }

  const verifyPincode = async (name = null, pincode) => {
    setLoading(true);
    // Replace with your actual Postman Pincode API endpoint
    const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;

    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();

      if (data[0].Status === "Success") {
        const getLat_Long = await getLatLongFromPincode(pincode);

        if (getLat_Long.latitude && getLat_Long.longitude) {
          await fetchAddressFromCoords(
            getLat_Long.latitude,
            getLat_Long.longitude,
            null
          );
        } else {
          Address_cleanUP();
          toast.error("Lat Long Data Not Found!!");
          setLoading(false);
        }
      } else {
        Address_cleanUP();

        toast.warn("wrong pincode");
        setLoading(false);
      }
    } catch (error) {
      Address_cleanUP();
    } finally {
      setLoading(false);
    }

    // setLoading(false);
  };

  // Function to fetch address details from coordinates
  const fetchAddressFromCoords = async (latitude, longitude, name = null) => {
    try {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        Address_cleanUP();
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Example: Check pincode availability
      if (data.address && data.address.postcode) {
        const pincodeResponse = await checkPincodeAvailability(
          data.address.postcode
        );

        if (pincodeResponse?.data?.message === "Available") {
          if (name) {
            setAddressDetails((prevDetails) => ({
              ...prevDetails,
              [name]: data.address.postcode,
            }));
          }

          setLoading(false);
        } else {
          Address_cleanUP();
          toast.warn(
            pincodeResponse?.data?.message || pincodeResponse?.data?.error
          );
          setLoading(false);
        }
      } else {
        Address_cleanUP();
        toast.warn("Pincode not found or incorrect pincode.");
        setLoading(false);
      }
    } catch (error) {
      Address_cleanUP();
      alert("An error occurred while fetching location data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "pin_code") {
      setAddressDetails((prevDetails) => ({ ...prevDetails, [name]: value }));

      if (value.length === 6) {
        verifyPincode(null, value);
        setValidationMessage("");
      } else {
        setValidationMessage("Enter Valid Pincode");
      }
    } else {
      setValidationMessage("");

      setAddressDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);

              const address = data.address || {};
              console.log(address);

              if (address.postcode) {
                setAddressDetails({
                  Locality: address?.suburb || "",
                  City: address?.City || "",
                  full_addresss: data?.display_name || "",
                  state: address?.state || "",
                  pin_code: address?.postcode || "",
                  landmark: address?.neighbourhood || "",
                });

                verifyPincode(null, address?.postcode);
              }
            })
            .catch((error) => {
              console.log("Error fetching address details: ", error);
              Address_cleanUP();
            });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              Address_cleanUP();
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              Address_cleanUP();
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              Address_cleanUP();
              break;
            case error.UNKNOWN_ERROR:
              console.error("An unknown error occurred.");
              Address_cleanUP();
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      Address_cleanUP();
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // handleLocateOnMap

  const handleLocateOnMap = () => {
    setMapModal(!mapModal);
  };

  const handleLocateOnMapDetails = (details, lat, lng) => {
    console.log(details);

    setAddressDetails({
      Locality: details?.address?.county || "",
      City: details.address?.state_district || "",
      full_addresss: details?.display_name || "",
      state: details?.address?.state || "",
      pin_code: details?.address?.postcode || "",
      landmark: details?.address?.neighbourhood || "",
    });

    setLocation({
      latitude: lat,
      longitude: lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !addressDetails.name &&
      !addressDetails.phone &&
      !addressDetails.Locality &&
      !addressDetails.City &&
      !addressDetails.full_addresss &&
      !addressDetails.state &&
      !addressDetails.address_type &&
      !addressDetails.pin_code
    ) {
      setLoading(false);
      return toast.error("Please fill in the required fields");
    }

    if (!location.latitude && !location.longitude) {
      setLoading(false);

      setIsValidationModal(true);

      return;
    }

    const combinedObject = {
      ...addressDetails,
      latitude: location.latitude,
      longitude: location.longitude,
      token,
    };

    try {
      let response;

      if (editMode && selectedAddress) {
        const updatedAddress = { ...combinedObject, id: selectedAddress.id };
        console.log(updatedAddress);

        response = await Update_Particular_addresss(updatedAddress);
        if (response) {
          ImportAddress();
        }
      } else {
        response = await postAddress(combinedObject);

        console.log(response);

        if (
          response &&
          response?.data?.message == "Address added successfully."
        ) {
          ImportAddress();

          setLoading(false);
          toast.success("Address added successfully");
        } else {
          console.log(response?.data?.message);

          toast.error(response?.data?.message);
        }
      }

      // Reset the form state
      resetForm();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setHide({ hide: "" });
    setEditMode(false);
    setSelectedAddress(null);
  };

  const handleEdit = (address) => {
    console.log(address);

    setSelectedAddress(address);
    setAddressDetails({
      name: address.name || "",
      phone: address.phone || "",
      Locality: address.Locality || "",
      City: address.City || "",
      full_addresss: address.full_addresss || "",
      state: address.state || "",
      alternate_phone: address.alternate_phone || "",
      pin_code: address.pin_code || "",
      landmark: address.landmark || "",
      address_type: address.address_type || "",
    });
    setLocation({ latitude: address.latitude, longitude: address.longitude });
    setEditMode(true);
    setHide("new address");
    setActiveDropdown(null);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    const response = await Delete_Particular_addresss({ id, token });
    if (
      response &&
      response?.data?.message === "Address deleted successfully"
    ) {
      ImportAddress();
      setActiveDropdown(null);
      setLoading(false);
    } else {
      toast.error(response?.data?.message);
      setLoading(false);
    }
  };

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // if(loading) return  <LoadingModal/>

  return (
    <div className="flex gap-4 justify-center mt-14 xl:mt-0">
      {/* {mapModal && (
        <LocateOnMap
          handleLocateOnMap={handleLocateOnMap}
          handleLocateOnMapDetails={handleLocateOnMapDetails}
        />
      )} */}
{/* 
      {

       mapModal &&   <LocateOnGoogleMap onLocationSelect={handleLocateOnMapDetails} />
      } */}

      {

        mapModal &&     <GoogleMapWithGeocode
           handleLocateOnMap={handleLocateOnMap}
        
  onLocationSelect={(coords, address) => {
    
    console.log("Selected coords:", coords);
    console.log("Selected address:", address);
  }}
/>
      }
      {/* <Sidebar /> */}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-30 z-50">
          <div className=" p-6 rounded-lg shadow-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        </div>
      )}

      <div className="bg-white flex flex-col gap-4 border p-4 w-[1100px]">
        <h1 className="font-bold text-2xl font-roboto">Manage Addresses</h1>

        {hide !== "new address" && (
          <h1
            className="font-roboto text-blue-600 font-bold cursor-pointer"
            onClick={() => {
              setHide({ hide: "new address" });

              setHide("new address");
              setEditMode(false);
              setSelectedAddress(null);
              setAddressDetails({
                name: "",
                phone: "",
                Locality: "",
                City: "",
                full_address: "",
                state: "",
                alternate_phone: "",
                pin_code: "",
                landmark: "",
                address_type: "",
              });
            }}
          >
            ➕ ADD A NEW ADDRESS
          </h1>
        )}

        {hide === "new address" && (
          <form
            className="bg-blue-100 border p-3 flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <h1
              className="text-blue-600 font-bold font-roboto cursor-pointer"
              onClick={() => setHide("")}
            >
              ➕ ADD A NEW ADDRESS
            </h1>

            <div className="flex flex-row gap-4">
              <span
                onClick={handleCurrentLocation}
                className="border w-60 cursor-pointer bg-blue-400 p-2 flex gap-2 px-3 rounded-sm shadow-sm shadow-blue-300"
              >
                <FaLocationCrosshairs className="mt-1" />
                <span>Use My Current Location</span>
              </span>

              <span className="  p-2 flex gap-2 px-3 ">
                <span> or</span>
              </span>

              <span
                onClick={handleLocateOnMap}
                className="border w-60 cursor-pointer bg-green-400 p-2 flex gap-2 px-3 rounded-sm shadow-sm shadow-blue-300"
              >
                <FaLocationCrosshairs className="mt-1" />
                <span>Locate on Map</span>
              </span>
            </div>

            <div className="flex flex-row gap-4">
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="Name *"
                name="name"
                value={addressDetails.name}
                onChange={handleChange}
              />
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="10-digit *"
                name="phone"
                value={addressDetails.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-row gap-4">
              <input
                required
                className="border bg-white p-2"
                type="text"
                placeholder="Locality *"
                name="Locality"
                value={addressDetails.Locality}
                onChange={handleChange}
              />
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="City *"
                name="City"
                value={addressDetails.City}
                onChange={handleChange}
              />
            </div>

            <input
              className="border bg-white p-2 h-24"
              placeholder="Address *"
              type="text"
              name="full_addresss"
              value={addressDetails.full_addresss}
              onChange={handleChange}
            />

            <div className="flex flex-row gap-4">
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="state *"
                name="state"
                value={addressDetails.state}
                onChange={handleChange}
              />
              <div className="flex flex-col ">
                <input
                  className="border bg-white p-2"
                  type="text"
                  placeholder="Pincode *"
                  name="pin_code"
                  value={addressDetails.pin_code}
                  onChange={handleChange}
                />
                <div className="text-sm text-red-500">{validationMessage}</div>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="Alt. Phone (optional)"
                name="alternate_phone"
                value={addressDetails.alternate_phone}
                onChange={handleChange}
              />
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="Landmark (optional)"
                name="landmark"
                value={addressDetails.landmark}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1>Address Type *</h1>
              <div className="flex flex-row gap-4">
                <label>
                  <input
                    type="radio"
                    id="home"
                    name="address_type"
                    value="Home"
                    checked={addressDetails.address_type === "Home"}
                    onChange={handleChange}
                  />
                  Home
                </label>
                <label>
                  <input
                    type="radio"
                    id="office"
                    name="address_type"
                    value="Office"
                    checked={addressDetails.address_type === "Office"}
                    onChange={handleChange}
                  />
                  Office
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="border p-3 w-40 bg-blue-500 rounded-md text-white"
              >
                Save
              </button>
              <button
                className="border p-3 w-40 rounded-md"
                type="button"
                onClick={() => {
                  setHide({ hide: "" });
                  setEditMode(false);
                  setSelectedAddress(null);
                  setAddressDetails({
                    name: "",
                    phone: "",
                    Locality: "",
                    City: "",
                    full_addresss: "",
                    state: "",
                    alternate_phone: "",
                    pin_code: "",
                    landmark: "",
                    address_type: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {IsValidationModal && <ValidationModal onClose={onClose} />}

        {SavedAddress ? (
          <div className="flex flex-col gap-4">
            {SavedAddress.map((address, id) => (
              <div
                key={id}
                onMouseLeave={() => toggleDropdown(null)}
                className="border bg-blue-100 p-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-3">
                    <div className="bg-gray-200 text-gray-500 w-20 text-center">
                      {address.address_type}
                    </div>

                    <div className="font-semibold flex gap-4">
                      <div>{address.name}</div>
                      <div>{address.phone}</div>
                    </div>

                    <div className="flex flex-col">
                      <p>{address.full_addresss}</p>
                      <h1 className="font-semibold">{address.pin_code}</h1>
                    </div>
                  </div>

                  <div className="relative">
                    <BsThreeDotsVertical
                      className="cursor-pointer"
                      onMouseEnter={() => toggleDropdown(address.id)}
                    />
                    {activeDropdown === address.id && (
                      <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                        <button
                          onClick={() => handleEdit(address)}
                          className="text-blue-500 block px-4 py-2 hover:bg-blue-100 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="text-red-500 block px-4 py-2 hover:bg-blue-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No addresses saved</div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
