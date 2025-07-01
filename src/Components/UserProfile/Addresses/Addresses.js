import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Delete_Particular_addresss } from "../../CrudOperations/DeleteOperation";
import GoogleMapWithGeocode from "./GoogleMapWithGeocode";
import AddressForm from "./AddressParts/AddressForm";
import ValidationModal from "./ValidationModal";
import AddressList from "./AddressParts/AddressList";
import useAddressActions from "../../Product/useAddressActions";

const AddressesPage = () => {
  const { ImportAddress } = useAddressActions();

  const token = useSelector((state) => state.auth.token);
  const SavedAddresss = useSelector((state) => state.auth.address);

  const [editMode, setEditMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mapModal, setMapModal] = useState(false);
  const [validationModal, setValidationModal] = useState(false);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const response = await Delete_Particular_addresss({ id, token });
    if (response?.data?.message === "Address deleted successfully") {
      ImportAddress();
      toast.success("Deleted successfully");
    } else {
      toast.error(response?.data?.message);
    }
    setLoading(false);
    setActiveDropdown(null);
  };

  return (
    <div className="flex justify-center mt-14 xl:mt-0">
      {mapModal && (
        <GoogleMapWithGeocode
          handleLocateOnMap={() => setMapModal(false)}
          onLocationSelect={(coords, address) => {
            setLocation(coords);
            toast.success("Location selected from map");
          }}
        />
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50">
          <div className="p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        </div>
      )}

      <div className="bg-white border p-4 w-[1100px]">
        <h1 className="font-bold text-2xl font-roboto">Manage Addresses</h1>

        {!showForm && (
          <h1
            className="font-roboto text-blue-600 font-bold cursor-pointer mt-2"
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              setSelectedAddress(null);
            }}
          >
            ➕ ADD A NEW ADDRESS
          </h1>
        )}

        {showForm && (
          <AddressForm
            location={location}
            setLocation={setLocation}
            editMode={editMode}
            selectedAddress={selectedAddress}
            setEditMode={setEditMode}
            setShowForm={setShowForm}
            setValidationModal={setValidationModal}
            setLoading={setLoading}
          />
        )}

        {validationModal && (
          <ValidationModal onClose={() => setValidationModal(false)} />
        )}

        <AddressList
          addresses={SavedAddresss}
          onEdit={handleEdit}
          onDelete={handleDelete}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
        />
      </div>
    </div>
  );
};

export default AddressesPage;
