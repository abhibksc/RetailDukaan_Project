import React, { useEffect, useState } from "react";
import Sidebar from "../Header&SideBar/Sidebar";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { postAddress } from "../CrudOperations/PostOperation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Update_Particular_addresss } from "../CrudOperations/Update&Edit";
import { Delete_Particular_addresss } from "../CrudOperations/DeleteOperation";
import { addAddress, addSingleAddress, modifyAddress, removeAddress } from "../ReduxStore/Slices/auth";
import LocateOnMap from "./LocateOnMap";
import { getAllAddress } from "../CrudOperations/GetOperation";


const Addresses = () => {
  const SavedAddresss = useSelector((state) => state.auth.address);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [hide, setHide] = useState({ hide: "" });
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [SavedAddress, setSavedAddress] = useState(SavedAddresss);

  const [mapModal, setMapModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSavedAddress(SavedAddresss);
  }, [SavedAddresss]); // Depend on SavedAddresss

  useEffect(() => {
    
    setLoading(true);

    const fun = async()=>{


      const response = await getAllAddress();
      if(response){

        console.log(response);
        setSavedAddress(response.data.addresses)
        setLoading(false);

        

      }
      

    }
    fun();

  }, []); // Depend on SavedAddresss






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
              console.log(data);
              
              const address = data.address || {};
              setAddressDetails({
                name: "",
                phone: "",
                Locality: address.suburb || "",
                City: address.City || "",
                full_addresss: data.display_name || "",
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

  // handleLocateOnMap

  const handleLocateOnMap = () => {

    setMapModal(!mapModal);
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const { latitude, longitude } = position.coords;
    //       setLocation({ latitude, longitude });

    //       fetch(
    //         `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    //       )
    //         .then((response) => response.json())
    //         .then((data) => {
    //           console.log(data);
              
    //           const address = data.address || {};
    //           setAddressDetails({
    //             name: "",
    //             phone: "",
    //             Locality: address.suburb || "",
    //             City: address.City || "",
    //             full_addresss: address.road || "",
    //             state: address.state || "",
    //             alternate_phone: "",
    //             pin_code: address.postcode || "",
    //             landmark: address.neighbourhood || "",
    //             address_type: "",
    //           });
    //         })
    //         .catch((error) => console.error("Error fetching address details: ", error));
    //     },
    //     (error) => {
    //       switch (error.code) {
    //         case error.PERMISSION_DENIED:
    //           console.error("User denied the request for Geolocation.");
    //           break;
    //         case error.POSITION_UNAVAILABLE:
    //           console.error("Location information is unavailable.");
    //           break;
    //         case error.TIMEOUT:
    //           console.error("The request to get user location timed out.");
    //           break;
    //         case error.UNKNOWN_ERROR:
    //           console.error("An unknown error occurred.");
    //           break;
    //       }
    //     },
    //     {
    //       enableHighAccuracy: true,
    //       timeout: 10000,
    //       maximumAge: 0,
    //     }
    //   );
    // } else {
    //   console.error("Geolocation is not supported by this browser.");
    // }
  };


  
  const handleLocateOnMapDetails = (details,lat, lng) => {

 console.log(details);

 setAddressDetails({
  name: "",
  phone: "",
  Locality: details.address.county
   || "",
  City: details.address.state_district || "",
  full_addresss: details.display_name || "",
  state: details.address.state || "",
  alternate_phone: "",
  pin_code: details.address.postcode || "",
  landmark: details.address.neighbourhood || "",
  address_type: "",
});


setLocation({

  latitude: lat,
   longitude: lng

})
 

  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
  
    console.log("Form submitted");
    console.log(addressDetails);
    
  
    const isAddressComplete = Object.entries(addressDetails).every(([key, detail]) => {
      console.log(`Key: ${key}, Value: ${detail}`); // Debugging: prints keys and values
      return detail ; // Ensures no empty or whitespace-only values
    });
    
    
    const isLocationValid = location.latitude && location.longitude;

    console.log(isAddressComplete);
    

    console.log(isLocationValid);
    
  
    if (isAddressComplete && isLocationValid) {

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
            const responses = await getAllAddress();
            console.log(responses);
           
            setSavedAddress(responses.data.addresses);
          }
        } else {
          response = await postAddress(combinedObject);
          if (response) {
            const responses = await getAllAddress();
            console.log(responses);

            
           
            setSavedAddress(responses.data.addresses);
            setLoading(false);
          }
        }
  
        // Reset the form state
        resetForm();
      } catch (error) {
        console.error('Error during address submission:', error);
        setLoading(false);

        // Optionally show an error message to the user
      }
    } else {
      console.warn('Incomplete address or location details');
      // Optionally show a validation error message to the user
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
    if (response && response.data.message === "Address deleted successfully") {
      console.log(response);
      const responses = await getAllAddress();
     
      setSavedAddress(responses.data.addresses);
      setActiveDropdown(null);
      setLoading(false);

    }
    else{
      console.log(response);
      setLoading(false);

    }
  };

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="flex gap-4 justify-center mt-14 xl:mt-0">

     {mapModal && <LocateOnMap handleLocateOnMap = {handleLocateOnMap} handleLocateOnMapDetails = {handleLocateOnMapDetails}/>}
      <Sidebar />

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


            <span
              className="  p-2 flex gap-2 px-3 "
            >
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

{loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      



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
