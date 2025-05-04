// Delivery_management

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import React from "react";
import EmptyState from "../Animation/Empty";
import React, { useEffect, useState } from "react";

import {
  faBan,
  faLock,
  faPlus,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  addDeliveryChargesOnDistance,
  addDeliveryChargesOnValue,
} from "../CrudOperations/PostOperation";
import {
  GetdeliveryCargesOnDistance,
  GetdeliveryCargesOnValue,
} from "../CrudOperations/GetOperation";
import {
  updateDeliveryChargesOnDistance,
  updateDeliveryChargesOnValue,
} from "../CrudOperations/Update&Edit";
import {
  DeleteDeliveryChargeOnDistance,
  DeleteDeliveryChargeOnValue,
} from "../CrudOperations/DeleteOperation";
import LoadingModal from "../LoadingModal";

const Delivery_management = () => {
  const [
    deliveryChargesOnDistanceFormData,
    setDeliveryChargesOnDistanceFormData,
  ] = useState({
    min_distance: "",
    max_distance: "",
    delivery_charge: "",
    id: "",
  });

  const [deliveryChargesOnValueFormData, setDeliveryChargesOnValueFormData] =
    useState({
      Min_order_price: "",
      Max_order_price: "",
      delivery_charges: "",
      id: "",
    });

  const [
    isAddDeliveryOnDistanceModalOpen,
    setisAddDeliveryOnDistanceModalOpen,
  ] = useState(false);

  const [isAddDeliveryOnValueModalOpen, setisAddDeliveryOnValueModalOpen] =
    useState(false);

  const [deliveryChargesOnValue_var, setDeliveryChargesOnValue_var] = useState(
    []
  );
  const [deliveryChargesOnDistance_var, setDeliveryChargesOnDistance_var] =
    useState([]);

  const [Edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fun = async () => {
      const GetdeliveryCargesOnValueResponse = await GetdeliveryCargesOnValue();
      const GetdeliveryCargesOnDistanceResponse =
        await GetdeliveryCargesOnDistance();

      console.log(GetdeliveryCargesOnValueResponse);
      console.log(GetdeliveryCargesOnDistanceResponse);

      if (GetdeliveryCargesOnValueResponse) {
        console.log("reponse aaya");

        setDeliveryChargesOnValue_var(GetdeliveryCargesOnValueResponse.data);

        toast.success(GetdeliveryCargesOnValueResponse.data.message);
        //   closeAddDeliveryContraints(false);
      }

      if (GetdeliveryCargesOnDistanceResponse) {
        console.log("reponse aaya");

        setDeliveryChargesOnDistance_var(
          GetdeliveryCargesOnDistanceResponse.data
        );

        toast.success(GetdeliveryCargesOnDistanceResponse.data.message);
        //   closeAddDeliveryContraints(false);
      }
    };

    fun();
  }, []);

  const handleClickAddDeliveryOnDistance = () => {
    setisAddDeliveryOnDistanceModalOpen(true);
  };

  const handleClickAddDeliveryOnValue = () => {
    setisAddDeliveryOnValueModalOpen(true);
  };

  // handleDeliveryChargesOnDistanceEditClick

  const handleDeliveryChargesOnDistanceEditClick = async (
    e,
    deliveryDetails,
    index
  ) => {
    e.preventDefault();

    setEdit(true);

    console.log(e);
    console.log(deliveryDetails);
    console.log(index);
    setDeliveryChargesOnDistanceFormData({
      min_distance: deliveryDetails.min_distance,
      max_distance: deliveryDetails.max_distance,
      delivery_charge: deliveryDetails.delivery_charge,
      id: deliveryDetails.id,
    });

    setisAddDeliveryOnDistanceModalOpen(true);
  };

  const handleDeliveryChargesOnValueEditClick = async (
    e,
    deliveryDetails,
    index
  ) => {
    e.preventDefault();

    setEdit(true);

    console.log(e);
    console.log(deliveryDetails);
    console.log(index);

    setDeliveryChargesOnValueFormData({
      Min_order_price: deliveryDetails.Min_order_price,
      Max_order_price: deliveryDetails.Max_order_price,
      delivery_charges: deliveryDetails.delivery_charges,
      id: deliveryDetails.id,
    });

    setisAddDeliveryOnValueModalOpen(true);
  };

  // handleDeliveryChargesOnDistanceDelete
  const handleDeliveryChargesOnDistanceDelete = async (e, id) => {
    e.preventDefault();

    try {
      const response = await DeleteDeliveryChargeOnDistance(id);
      console.log(response);

      if (response.data.message === "Delivery charge deleted successfully!") {
        // Update the state by removing the deleted item
        setDeliveryChargesOnDistance_var((prevData) =>
          prevData.filter((item) => item.id !== id)
        );

        toast.success(response.data.message);
      } else {
        toast.error("Failed to delete the delivery charge on distance.");
      }
    } catch (error) {
      console.error("Error deleting delivery charge on distance:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  // handleDeliveryChargesOnValueDelete
  const handleDeliveryChargesOnValueDelete = async (e, id) => {
    e.preventDefault();

    try {
      const response = await DeleteDeliveryChargeOnValue(id);
      console.log(response);

      if (response.data.message === "Delivery charge deleted successfully!") {
        // Update the state by removing the deleted item
        setDeliveryChargesOnValue_var((prevData) =>
          prevData.filter((item) => item.id !== id)
        );

        toast.success(response.data.message);
      } else {
        toast.error("Failed to delete the delivery charge on value.");
      }
    } catch (error) {
      console.error("Error deleting delivery charge on value:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  const closeAddDeliveryOnDistanceModal = () => {
    setisAddDeliveryOnDistanceModalOpen(false);
  };

  const closeAddDeliveryOnValueModal = () => {
    setisAddDeliveryOnValueModalOpen(false);
  };

  const handleSubmitAddDeliveryChargesOnValueForm = async (event) => {
    event.preventDefault();

    try {
      if (Edit) {
        // Edit Mode: Update existing delivery charges
        console.log("Updating Delivery Charges on value...");
        const response = await updateDeliveryChargesOnValue(
          deliveryChargesOnValueFormData
        );
        console.log(response);

        if (response.message === "Delivery constraints updated successfully!") {
          // Only update the modified data in the state
          setDeliveryChargesOnValue_var((prevData) =>
            prevData.map((item) =>
              item.id === response.data.id ? response.data : item
            )
          );

          closeAddDeliveryOnValueModal();
          toast.success(response.message);

          setDeliveryChargesOnDistanceFormData({
            min_distance: "",
            max_distance: "",
            delivery_charge: "",
            id: "",
          });
        } else {
          toast.error("Failed to update delivery charges on distance.");
        }
      } else {
        // Add Mode: Add new delivery charges

        // Min_order_price: "",
        // Max_order_price: "",
        // delivery_charges: "",
        // id : "",

        const { Min_order_price, Max_order_price, delivery_charges } =
          deliveryChargesOnValueFormData;

        if (Min_order_price && Max_order_price && delivery_charges) {
          const response = await addDeliveryChargesOnValue(
            deliveryChargesOnValueFormData
          );
          console.log(response);

          if (response) {
            setDeliveryChargesOnValue_var((prevData) => [
              ...prevData,
              response.data.data, // Add the new item
            ]);

            // Reset form data after adding
            setDeliveryChargesOnValueFormData({
              Min_order_price: "",
              Max_order_price: "",
              delivery_charges: "",
              id: "",
            });

            closeAddDeliveryOnValueModal();
            toast.success(response.data.message);
          } else {
            toast.error("Failed to add new delivery charges on distance.");
          }
        } else {
          toast.warning("Please fill in all required fields.");
        }
      }
    } catch (error) {
      console.error("Error handling delivery charges:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  const handleSubmitAddDeliveryChargesOnDistanceForm = async (event) => {
    event.preventDefault();

    try {
      if (Edit) {
        // Edit Mode: Update existing delivery charges
        console.log("Updating Delivery Charges on Distance...");
        const response = await updateDeliveryChargesOnDistance(
          deliveryChargesOnDistanceFormData
        );
        console.log(response);

        if (response.message === "Delivery constraints updated successfully!") {
          // Only update the modified data in the state
          setDeliveryChargesOnDistance_var((prevData) =>
            prevData.map((item) =>
              item.id === response.data.id ? response.data : item
            )
          );

          closeAddDeliveryOnDistanceModal();
          toast.success(response.message);
        } else {
          toast.error("Failed to update delivery charges on distance.");
        }
      } else {
        // Add Mode: Add new delivery charges
        const { min_distance, max_distance, delivery_charge } =
          deliveryChargesOnDistanceFormData;

        if (min_distance && max_distance && delivery_charge) {
          const response = await addDeliveryChargesOnDistance(
            deliveryChargesOnDistanceFormData
          );
          console.log(response);

          if (response) {
            setDeliveryChargesOnDistance_var((prevData) => [
              ...(Array.isArray(prevData) ? prevData : []),
              response.data.data,
            ]);

            // Reset form data after adding
            setDeliveryChargesOnDistanceFormData({
              min_distance: "",
              max_distance: "",
              delivery_charge: "",
            });

            closeAddDeliveryOnDistanceModal();
            toast.success(response.data.message);
          } else {
            toast.error("Failed to add new delivery charges on distance.");
          }
        } else {
          toast.warning("Please fill in all required fields.");
        }
      }
    } catch (error) {
      console.error("Error handling delivery charges:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  const handleDeliveryChargesOnDistanceChange = (e) => {
    console.log(e);

    console.log("Chanhan yehi chala");

    setDeliveryChargesOnDistanceFormData({
      ...deliveryChargesOnDistanceFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeliveryChargesOnValueChange = (e) => {
    setDeliveryChargesOnValueFormData({
      ...deliveryChargesOnValueFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 ">
      {loading && <LoadingModal />}

      <div className="flex gap-4 flex-col">
  {/* Card Wrapper */}
  <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg w-full mx-auto">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-indigo-800">Delivery Charges On Distance</h2>
      <button
        onClick={handleClickAddDeliveryOnDistance}
        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-200 flex items-center space-x-2 shadow-md"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>Add Range</span>
      </button>
    </div>

    {/* Scrollable Table */}
    <div className="max-h-80 overflow-y-auto">
      {deliveryChargesOnDistance_var.length > 0 ? (
        <table className="w-full bg-white rounded-lg shadow-md border border-gray-200">
          <thead>
            <tr className="bg-indigo-100 text-indigo-900 text-sm font-semibold">
              <th className="py-3 px-5 text-left">S.No</th>
              <th className="py-3 px-5 text-left">Min. distance</th>
              <th className="py-3 px-5 text-left">Max. distance</th>
              <th className="py-3 px-5 text-left">Delivery Charges</th>
              <th className="py-3 px-5 text-center">Edit</th>
              <th className="py-3 px-5 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {deliveryChargesOnDistance_var.map((delivery, index) => (
              <tr
                key={delivery?.id || index}
                className="border-b border-gray-100 hover:bg-indigo-50"
              >
                <td className="py-4 px-5 text-gray-800">{index + 1}</td>
                <td className="py-4 px-5 text-gray-800">{`${delivery?.min_distance} km` ?? "N/A"}</td>
                <td className="py-4 px-5 text-gray-800">{`${delivery?.max_distance} km` ?? "N/A"}</td>
                <td className="py-4 px-5 text-gray-800">{`${delivery?.delivery_charge} ₹` ?? "N/A"}</td>
                <td className="py-4 px-5 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => handleDeliveryChargesOnDistanceEditClick(e, delivery, index)}
                    aria-label="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
                <td className="py-4 px-5 text-center">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={(e) => handleDeliveryChargesOnDistanceDelete(e, delivery.id)}
                    aria-label="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="border p-6 rounded-xl bg-white shadow-md mx-auto mt-6 max-w-lg">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-xl font-semibold text-gray-800">No Constraints Found</h2>
            <p className="text-gray-500">
              Looks like you don't have any constraints in this section. Add some to get started!
            </p>
          </div>
        </div>
      )}
    </div>
  </div>

  <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg w-full mx-auto">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-indigo-800">Delivery Charges On Order Value</h2>
      <button
        onClick={handleClickAddDeliveryOnValue}
        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-200 flex items-center space-x-2 shadow-md"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>Add Range</span>
      </button>
    </div>

    {/* Scrollable Table */}
    <div className="max-h-80 overflow-y-auto">
      {deliveryChargesOnValue_var.length > 0 ? (
        <table className="w-full bg-white rounded-lg shadow-md border border-gray-200">
          <thead>
            <tr className="bg-indigo-100 text-indigo-900 text-sm font-semibold">
              <th className="py-3 px-5 text-left">S.No</th>
              <th className="py-3 px-5 text-left">Min. Order Price</th>
              <th className="py-3 px-5 text-left">Max. Order Price</th>
              <th className="py-3 px-5 text-left">Delivery Charges</th>
              <th className="py-3 px-5 text-center">Edit</th>
              <th className="py-3 px-5 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {deliveryChargesOnValue_var.map((delivery, index) => (
              <tr
                key={delivery?.id || index}
                className="border-b border-gray-100 hover:bg-indigo-50"
              >
                <td className="py-4 px-5 text-gray-800">{index + 1}</td>
                <td className="py-4 px-5 text-gray-800">{`${delivery?.Min_order_price} ₹` ?? "N/A"}</td>
                <td className="py-4 px-5 text-gray-800">{`${delivery?.Max_order_price} ₹` ?? "N/A"}</td>
                <td className="py-4 px-5 text-gray-800">{`${delivery?.delivery_charges} ₹` ?? "N/A"}</td>
                <td className="py-4 px-5 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => handleDeliveryChargesOnValueEditClick(e, delivery, index)}
                    aria-label="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
                <td className="py-4 px-5 text-center">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={(e) => handleDeliveryChargesOnValueDelete(e, delivery.id)}
                    aria-label="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="border p-6 rounded-xl bg-white shadow-md mx-auto mt-6 max-w-lg">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-xl font-semibold text-gray-800">No Constraints Found</h2>
            <p className="text-gray-500">
              Looks like you don't have any constraints in this section. Add some to get started!
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
</div>


      {/* isAddDeliveryOnDistanceModalOpen Modal */}
      {isAddDeliveryOnDistanceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative max-w-lg w-full bg-white shadow-xl rounded-xl p-8 animate-fade-in">
            <button
              onClick={closeAddDeliveryOnDistanceModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Price & Delivery Charges
            </h2>

            <form onSubmit={handleSubmitAddDeliveryChargesOnDistanceForm}>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="minPrice"
                >
                  Min. distance
                </label>
                <input
                  type="text"
                  id="minPrice"
                  name="min_distance"
                  value={deliveryChargesOnDistanceFormData.min_distance}
                  onChange={handleDeliveryChargesOnDistanceChange}
                  placeholder="Enter minimum Distance"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-pink-300 focus:border-pink-400 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="maxPrice"
                >
                  Max. distance
                </label>
                <input
                  type="text"
                  id="maxPrice"
                  name="max_distance"
                  value={deliveryChargesOnDistanceFormData.max_distance}
                  onChange={handleDeliveryChargesOnDistanceChange}
                  placeholder="Enter maximum Distance"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-purple-300 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="delivery_charge"
                >
                  Delivery Charge
                </label>
                <input
                  type="number"
                  id="delivery_charge"
                  name="delivery_charge"
                  value={deliveryChargesOnDistanceFormData.delivery_charge}
                  onChange={handleDeliveryChargesOnDistanceChange}
                  placeholder="Enter delivery_charge"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-purple-300 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-8 py-2 rounded-full hover:bg-gradient-to-l hover:from-red-500 hover:to-purple-600 transition duration-300"
                >
                  {Edit ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* isAddDeliveryOnValueModalOpen  Modal */}
      {isAddDeliveryOnValueModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative max-w-lg w-full bg-white shadow-xl rounded-xl p-8 animate-fade-in">
            <button
              onClick={closeAddDeliveryOnValueModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Price & Delivery Charges
            </h2>

            <form onSubmit={handleSubmitAddDeliveryChargesOnValueForm}>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="minPrice"
                >
                  Min. Order Limit
                </label>
                <input
                  type="text"
                  id="Min_order_price"
                  name="Min_order_price"
                  value={deliveryChargesOnValueFormData.Min_order_price}
                  onChange={handleDeliveryChargesOnValueChange}
                  placeholder="Enter minimum price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-pink-300 focus:border-pink-400 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="maxPrice"
                >
                  Max. order price
                </label>
                <input
                  type="text"
                  id="Max_order_price"
                  name="Max_order_price"
                  value={deliveryChargesOnValueFormData.Max_order_price}
                  onChange={handleDeliveryChargesOnValueChange}
                  placeholder="Enter maximum price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-purple-300 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="warehouse"
                >
                  Delivery Charges
                </label>
                <input
                  type="number"
                  id="delivery_charges"
                  name="delivery_charges"
                  value={deliveryChargesOnValueFormData.delivery_charges}
                  onChange={handleDeliveryChargesOnValueChange}
                  placeholder="Enter delivery_charges"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-purple-300 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-8 py-2 rounded-full hover:bg-gradient-to-l hover:from-red-500 hover:to-purple-600 transition duration-300"
                >
                  {Edit ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery_management;
