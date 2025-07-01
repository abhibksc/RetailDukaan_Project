import React, { useState, useEffect } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LocationButtons from "./LocationButtons";
import useAddressActions from "../../../Product/useAddressActions";
import { Update_Particular_addresss } from "../../../CrudOperations/Update&Edit";
import { postAddress } from "../../../CrudOperations/PostOperation";
import usePincodeValidation from "../../../../hooks/usePincodeValidation";











const AddressForm = ({
  location,
  setLocation,
  editMode,
  selectedAddress,
  setEditMode,
  setShowForm,
  setValidationModal,
  setLoading,
}) => {

    const { verifyPincode, handleCurrentLocation, loading } = usePincodeValidation();

  const token = useSelector((state) => state.auth.token);
  const { ImportAddress } = useAddressActions();

  const [validationMessage, setValidationMessage] = useState("");
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

  useEffect(() => {
    if (editMode && selectedAddress) {
      setAddressDetails({
        name: selectedAddress.name || "",
        phone: selectedAddress.phone || "",
        Locality: selectedAddress.Locality || "",
        City: selectedAddress.City || "",
        full_addresss: selectedAddress.full_addresss || "",
        state: selectedAddress.state || "",
        alternate_phone: selectedAddress.alternate_phone || "",
        pin_code: selectedAddress.pin_code || "",
        landmark: selectedAddress.landmark || "",
        address_type: selectedAddress.address_type || "",
      });
      setLocation({
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
      });
    }
  }, [editMode, selectedAddress, setLocation]);

 const handleChange = async (e) => {
  const { name, value } = e.target;

  if (name === "pin_code") {
    setAddressDetails((prev) => ({ ...prev, [name]: value }));
    if (value.length === 6) {
      await verifyPincode(value, setAddressDetails , setLocation);
    }
    return;
  }

  setAddressDetails((prev) => ({ ...prev, [name]: value }));
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !addressDetails.name ||
      !addressDetails.phone ||
      !addressDetails.pin_code ||
      !location.latitude
    ) {
      setLoading(false);

      console.log(addressDetails.name);
      console.log(addressDetails.phone);
      console.log(addressDetails.pin_code);
      console.log(location.latitude);
      
      toast.error("Fill all required fields , use My Current Location or Locate On Map!!");
      return;
    }

    const payload = {
      ...addressDetails,
      latitude: location.latitude,
      longitude: location.longitude,
      token,
    };

    try {
      let response;
      if (editMode && selectedAddress) {
        response = await Update_Particular_addresss({
          ...payload,
          id: selectedAddress.id,
        });
      } else {
        response = await postAddress(payload);
      }

      if (response?.data?.message?.includes("successfully")) {
        toast.success(response.data.message);
        ImportAddress();
        setShowForm(false);
        setEditMode(false);
      } else {

        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error( err.response?.data?.message || err?.response?.data?.error || "Error saving address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-blue-100 border p-3 flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
  {/* // Then inside JSX */}
<LocationButtons
  onCurrentLocationClick={() => handleCurrentLocation(setAddressDetails, setLocation)}
  onMapLocateClick={() => setValidationModal(true)}
/>


      <div className="flex gap-4">
        <input className="border p-2" placeholder="Name *" name="name" value={addressDetails.name} onChange={handleChange} />
        <input className="border p-2" placeholder="10-digit *" name="phone" value={addressDetails.phone} onChange={handleChange} />
      </div>

      <div className="flex gap-4">
        <input className="border p-2" placeholder="Locality *" name="Locality" value={addressDetails.Locality} onChange={handleChange} />
        <input className="border p-2" placeholder="City *" name="City" value={addressDetails.City} onChange={handleChange} />
      </div>

      <textarea className="border p-2 h-24" placeholder="Address *" name="full_addresss" value={addressDetails.full_addresss} onChange={handleChange} />

      <div className="flex gap-4">
        <input className="border p-2" placeholder="State *" name="state" value={addressDetails.state} onChange={handleChange} />
        <div className="flex flex-col">
          <input className="border p-2" placeholder="Pincode *" name="pin_code" value={addressDetails.pin_code} onChange={handleChange} />
          {validationMessage && <span className="text-red-500 text-sm">{validationMessage}</span>}
        </div>
      </div>

      <div className="flex gap-4">
        <input className="border p-2" placeholder="Alt. Phone" name="alternate_phone" value={addressDetails.alternate_phone} onChange={handleChange} />
        <input className="border p-2" placeholder="Landmark" name="landmark" value={addressDetails.landmark} onChange={handleChange} />
      </div>

      <div className="flex flex-col gap-2">
        <label>Address Type *</label>
        <div className="flex gap-4">
          {["Home", "Office"].map((type) => (
            <label key={type}>
              <input type="radio" name="address_type" value={type} checked={addressDetails.address_type === type} onChange={handleChange} />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" className="p-3 w-40 bg-blue-500 text-white rounded-md">Save</button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setEditMode(false);
          }}
          className="p-3 w-40 border rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
