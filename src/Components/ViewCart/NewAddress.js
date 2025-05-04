import React, { useEffect, useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { postAddress } from "../CrudOperations/PostOperation";
import { Update_Particular_addresss } from "../CrudOperations/Update&Edit";
import { Delete_Particular_addresss } from "../CrudOperations/DeleteOperation";
import { addSingleAddress ,addAddress, addSingleAddress, modifyAddress, removeAddress} from "../ReduxStore/Slices/auth";


const NewAddress = ({props}) => {
  const SavedAddresss = useSelector((state) => state.auth.address);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [hide, setHide] = useState({ hide: "" });
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [SavedAddress, setSavedAddress] = useState(SavedAddresss);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
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
              const address = data.address || {};
              setAddressDetails({
                name: "",
                phone: "",
                Locality: address.suburb || "",
                City: address.City || "",
                full_addresss: address.road || "",
                state: address.state || "",
                alternate_phone: "",
                pin_code: address.postcode || "",
                landmark: address.neighbourhood || "",
                address_type: "",
              });
            })
            .catch((error) => console.error("Error fetching address details: ", error));
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              console.error("An unknown error occurred.");
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
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      Object.values(addressDetails).every((detail) => detail) &&
      location.latitude &&
      location.longitude
    ) {
      const combinedObject = {
        ...addressDetails,
        latitude: location.latitude,
        longitude: location.longitude,
        token,
      };

      if (editMode && selectedAddress) {
        const updatedAddress = { ...combinedObject, id: selectedAddress.id };
        const response = await Update_Particular_addresss(updatedAddress);
        if (response) {
          dispatch(modifyAddress(response));
        }
      } else {
        const response = await postAddress(combinedObject);
        if (response) {
          dispatch(addSingleAddress(response));
        }
      }

      setHide({ hide: "" });
      setEditMode(false);
      setSelectedAddress(null);
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setAddressDetails(address);
    setLocation({ latitude: address.latitude, longitude: address.longitude });
    setEditMode(true);
    setHide("new address");
    setActiveDropdown(null);
  };

  const handleDelete = async (id) => {
    const response = await Delete_Particular_addresss({ id, token });
    if (response && response.data.message === "Address deleted successfully") {
      console.log(response);
      dispatch(removeAddress(id));
      setActiveDropdown(null);
    }
    else{
      console.log(response);
    }
  };

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <form
            className="bg-blue-100 border p-3 flex flex-col gap-5 mb-7"
            onSubmit={handleSubmit}
          >
            <h1
              className="text-blue-600 font-bold font-roboto cursor-pointer"
             
            >
            ADD A NEW ADDRESS
            </h1>

            <span
              onClick={handleCurrentLocation}
              className="border w-60 cursor-pointer bg-blue-400 p-2 flex gap-2 px-3 rounded-sm shadow-sm shadow-blue-300"
            >
              <FaLocationCrosshairs className="mt-1" />
              <span>Use My Current Location</span>
            </span>

            <div className="flex flex-row gap-4">
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="Name"
                name="name"
                value={addressDetails.name}
                onChange={handleChange}
              />
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="10-digit"
                name="phone"
                value={addressDetails.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-row gap-4">
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="Locality"
                name="Locality"
                value={addressDetails.Locality}
                onChange={handleChange}
              />
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="City"
                name="City"
                value={addressDetails.City}
                onChange={handleChange}
              />
            </div>

            <input
              className="border bg-white p-2 h-24"
              placeholder="Address"
              type="text"
              name="full_addresss"
              value={addressDetails.full_addresss}
              onChange={handleChange}
            />

            <div className="flex flex-row gap-4">
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="state"
                name="state"
                value={addressDetails.state}
                onChange={handleChange}
              />
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="Pincode"
                name="pin_code"
                value={addressDetails.pin_code}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-row gap-4">
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="Alternate Phone"
                name="alternate_phone"
                value={addressDetails.alternate_phone}
                onChange={handleChange}
              />
              <input
                className="border bg-white p-2"
                type="text"
                placeholder="Landmark"
                name="landmark"
                value={addressDetails.landmark}
                onChange={handleChange}
              />
            </div>


            <div className="flex flex-col">
              <h1>Address Type</h1>
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
                    props();
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
  );
};

export default NewAddress;
