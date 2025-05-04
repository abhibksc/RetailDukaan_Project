import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GetAllOffers } from "../../CrudOperations/GetOperation";
import { DeleteCreatedOffer } from "../../CrudOperations/DeleteOperation";
import { ChangeOfferStatus } from "../../CrudOperations/Update&Edit";


const Manage_Offers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOfferList, setFilteredOfferList] = useState([]);
  const [OfferList, setOfferList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");

  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await GetAllOffers();
      console.log(response);
      
      if (response.data.message == "All Offer retrieved successfully!") {
        setOfferList(response.data.data);
        setFilteredOfferList(response.data.data);
      }
    };
    fetchBrands();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = OfferList.filter(
      (p) =>
  
        p.offerName.toLowerCase().includes(query)
    );
    setFilteredOfferList(filteredList);
  };


  const handleDeleteOffer = async (id) => {
    const previousOfferList = [...OfferList];
    const previousFilteredOfferList = [...filteredOfferList];

    const updatedList = OfferList.filter((p) => p.id !== id);
    setOfferList(updatedList);
    setFilteredOfferList(updatedList);

    try {
      const response = await DeleteCreatedOffer(id);
      if (response.data.message == "Offer deleted successfully!") {
        toast.success("Offer deleted successfully!");
      } else {
        setOfferList(previousOfferList);
        setFilteredOfferList(previousFilteredOfferList);
        toast.error("Failed to delete loose_stock. Please try again.");
      }
    } catch (error) {
      setOfferList(previousOfferList);
      setFilteredOfferList(previousFilteredOfferList);
      toast.error("Error deleting Brand.");
    }
  };

  // handleUpdateBrand

  const handleUpdateBrand = async (p) => {


    // const Item = OfferList.find((p) => p.id === id);

    const purchaseStock = await getAllStockItem();
    console.log(purchaseStock);
    console.log(p);


    if(purchaseStock.data.message == "Stockitems retrieved successfully!"){

      const data = purchaseStock.data.data.find((ele) => ele.id == p.purchase_item_id);
      console.log(data);

      const form = {
        item : p,
        available : data.AvailableQuantity,
        unit_name :  data.unit_name,
        unit_id :  data.unit_id
      }

      console.log(form);

      
    setEdit(form);

    setIsModalOpen(true);
      
      



    }
    

    
  };




  const confirmChangeStatus = async () => {
    if (currentBrandId !== null) {
      // Update status in OfferList
      setOfferList((prevList) =>
        prevList.map((item) =>
          item.id === currentBrandId ? { ...item, Status: newStatus } : item
        )
      );

      // Update status in filteredOfferList
      setFilteredOfferList((prevList) =>
        prevList.map((item) =>
          item.id === currentBrandId ? { ...item, Status: newStatus } : item
        )
      );

      try {
        const response = await UpdateBrandStatus({
          id: currentBrandId,
          Status: newStatus,
        });
        if (response.data.message === "Brand updated successfully!") {
          toast.success(`Status updated to ${newStatus} successfully!`);
        } else {
          toast.error("Error updating status.");
        }
      } catch (error) {
        toast.error("Error updating status.");
      } finally {
        setIsConfirmModalOpen(false); // Close the confirmation modal
        setCurrentBrandId(null); // Reset the ID
      }
    }
  };

  const handleAddOfferformClick = () => {

  const Merchanttoken = localStorage.getItem("Merchanttoken");




    Navigate(`/admin/${Merchanttoken}/addOffer`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async(newBrand) => {
    console.log(newBrand);

    if(newBrand){

      const response = await getAllLooseStock();
      if (response.data.message === "All loose_stock retrieved successfully!") {
        setOfferList(response.data.data);
        setFilteredOfferList(response.data.data);
      }

      
    setBrand("");
    toast.success("loose_stock added successfully!");
    }
  };

  const handleUpdate = async(newBrand) => {
    console.log("Updated Brand:", newBrand);
    console.log("Editing Brand ID:", edit.id);
    console.log("Brand List:", OfferList);

   
    const response = await getAllLooseStock();
    if (response.data.message === "All loose_stock retrieved successfully!") {
      setOfferList(response.data.data);
      setFilteredOfferList(response.data.data);
    }

    
  setBrand("");
  toast.success("loose_stock updated successfully!");

    setEdit(null);
    closeModal(); // Close the modal after updating
  };

  useEffect(() => {
    console.log(OfferList);
  }, [OfferList]);

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredOfferList(OfferList);
      return;
    }

    const filteredList = OfferList.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredOfferList(filteredList);
  };


  const handleStatus = async (id, e) => {
    console.log(e.target.value);
    setLoading(true);
    const response = await ChangeOfferStatus({ id, Status: e.target.value });
    if (response.data.message === "offerStatus updated successfully!") {
      const getItems = await GetAllOffers();
      if (getItems.data.message === "All Offer retrieved successfully!") {
        console.log(getItems.data.data);
        setOfferList(getItems.data.data);
        setFilteredOfferList(getItems.data.data);
        toast.success("Status Updated successfully!");
      }
      setLoading(false);
    }
    setLoading(false);

  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">


{loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}


      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
      Manage Offer
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="border border-gray-300 p-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleAddOfferformClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-500 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add
          </button>
        </div>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Offer Id",
                "Posted Date",
                "Offer Name",
                "Offer %",
                "Category",
                "Sub Cat.",
                "Sub SubCat.",
                "Item",
                "Loose Item",
                "Pkt Item",
                "Start Date",
                "End Date",
                "Status",
                "Delete",
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-center font-semibold text-gray-700"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOfferList.length > 0 ? (
              filteredOfferList.map((p,index) => (
                <tr
                  key={p.id}
                  className="border-b transition-colors duration-200 hover:bg-gray-50"
                >
                         <td className="py-3 px-4 text-center">{p.uniqueOfferId}</td>
                  <td className="py-3 px-4 text-center">{p.PostedDate}</td>
                  <td className="py-3 px-4 text-center">{p.offerName}</td>
                  <td className="py-3 px-4 text-center">{p.OfferPercentValue}%</td>
                  <td className="py-3 px-4 text-center">{p.Category_name ? p.Category_name : "null"}</td>
                  <td className="py-3 px-4 text-center">{p.SubCategory_name ? p.SubCategory_name : "null" }</td>
                  <td className="py-3 px-4 text-center">{p.Sub_SubCategory_name ? p.Sub_SubCategory_name : "null"}</td>
                  <td className="py-3 px-4 text-center">{p.ItemName ? p.ItemName : "null"}</td>

                  <td className="py-3 px-4 text-center">{p.looseVariantName ? p.looseVariantName : "null"}</td>
                  <td className="py-3 px-4 text-center">{p.packetVariantName ? p.packetVariantName : "null"}</td>

                  <td className="py-3 px-4 text-center">{p.startDate}</td>
                  <td className="py-3 px-4 text-center">{p.endDate}</td>
                  <td className="py-3 px-4 text-center">

                  <div className="mb-2">
                    <select
                      id="Status"
                      value={p.Status}
                      onChange={(e) => handleStatus(p.id, e)}
                      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>


                  </td>



                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteOffer(p.id)}
                      className="text-red-500 transition-colors duration-200 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-3 text-center text-gray-600">
                  No Brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Brand Modal */}
      {isModalOpen && (
        <AddLooseStocks
          closeModal={closeModal}
          onSubmit={handleSubmit}
          Brand={edit}
          onUpdate={handleUpdate}
        />
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Change Status</h2>
            <p>
              Are you sure you want to change the status to{" "}
              {newStatus === "Not Available" ? "Not Accessible" : "Accessible"}?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmChangeStatus}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage_Offers;
