import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetAllCreatedItems, GetAllOffers, Show_Users_MainCategory, Show_Users_Sub_SubCategory, Show_users_SubCategory } from "../../../CrudOperations/GetOperation";
import { CreteItems, CreteOfferZone } from "../../../CrudOperations/PostOperation";
import { ChangeItemStatus } from "../../../CrudOperations/Update&Edit";
import { deleteStoredItem } from "../../../CrudOperations/DeleteOperation";
import PaginationExample from "../../Stocks/Purchase/PaginationExample";






const FeaturedBannerZone = () => {


    const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
    const itemsPerPage = 9; // Items per page






  const location = useLocation();
  const [filteredLooseVarientList, setFilteredLooseVarientList] = useState([]);

  const [offerIds, setofferIds] = useState([]);
    const [selectedOfferIds, setSelectedOfferIds] = useState([]);
  

  const [Status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //   const [offerIds, setCategoryId] = useState("");
  const [zoneName, setzoneName] = useState("");
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  // Fetching offers and banners data
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const offersResponse = await GetAllOffers();
        if (offersResponse?.data?.message === "All Offer retrieved successfully!") {
          setofferIds(offersResponse.data.data);
        } else {
          toast.error("Failed to retrieve offers.");
        }
        setLoading(false);
        

      } catch (error) {
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);




  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !zoneName ||
      selectedOfferIds.length < 0 ||
      !Status
    ) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const formDataa = {
        zoneName,
        selectedOfferIds,
        Status
      };
      console.log(formDataa);
      const response = await CreteOfferZone({ formDataa });

      console.log(response);

      if (response.data.message === "zone saved successfully!") {
        console.log(response);
        

      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  //   handleStatus

  const handleStatus = async (id, e) => {
    console.log(e.target.value);
    setLoading(true);
    const response = await ChangeItemStatus({ id, Status: e.target.value });
    if (response.data.message === "ItemStatus updated successfully!") {
      const getItems = await GetAllCreatedItems();
      if (getItems.data.message === "All Items retrieved successfully!") {
        console.log(getItems.data.data);
        setProductList(getItems.data.data);
        toast.success("Status Updated successfully!");
      }
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    console.log(id);

    const response = await deleteStoredItem({ id });
    if (
      response.data.message ===
      "Stored Item and related entries deleted successfully!"
    ) {
      const getItems = await GetAllCreatedItems();
      if (getItems.data.message === "All Items retrieved successfully!") {
        console.log(getItems.data.data);
        setProductList(getItems.data.data);
        toast.success("Item Deleted successfully!");
      }
    }
  };

  const filteredProductList = productList.filter((item) =>
    item.zoneName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  
        // Calculate the page count (total items divided by items per page)
        const pageCount = Math.ceil(filteredProductList.length / itemsPerPage);

        // Slice the items array to only show items for the current page
        const currentItems = filteredProductList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    
        // Handle page change
        const handlePageChange = (selectedPage) => {
            setCurrentPage(selectedPage.selected);
        };


  return (
    <div className="p-6 bg-white rounded shadow-md">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2 ">Create Offer Zone</h1>

      {/* Add Item Form */}
      <div className="grid grid-cols-4 gap-5 border-b-2 p-2  pb-5">
        <div className="mb-2">
          <label className="block text-gray-700">Zone Name</label>
          <input
            value={zoneName}
            onChange={(e) => setzoneName(e.target.value)}
            type="text"
            placeholder="Enter zone name"
            className="border border-gray-300 p-1 w-full rounded-md"
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-2">
        <label className="block text-gray-700 font-medium mb-2">Select Offers</label>
            <select
              multiple
              value={selectedOfferIds}
              onChange={(e) =>
                setSelectedOfferIds(Array.from(e.target.selectedOptions, (option) => option.value))
              }
              className="w-full p-3 border rounded bg-gray-50 text-gray-800"
            >
              {/* <option value="" disabled>Select Offers</option> */}
              {offerIds.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.offerName}
                </option>
              ))}
            </select>
        </div>

  
        <div className="mb-2">
          <label htmlFor="status" className="block text-gray-700">
            Status
          </label>
          <select
            id="Status"
            value={Status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className=" bg-blue-600 text-white py-2 px-4 mt-6 rounded"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between mt-5 items-center">
        <input
          type="text"
          placeholder="Search Items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 border p-3 rounded-md"
        />
      </div>

      {/* Product Table */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Offer Zone</h2>
        {/* <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">S.no</th>
              <th className="py-2 px-4 border">Item Name</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Sub Category</th>
              <th className="py-2 px-4 border">Sub SubCategory</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border text-center">{index + 1}</td>
                <td className="py-2 px-4 border text-center">
                  {item.zoneName}
                </td>
                <td className="py-2 px-4 border text-center">
                  {item.Category_name}
                </td>
                <td className="py-2 px-4 border text-center">
                  {item.subcategories_name}
                </td>
                <td className="py-2 px-4 border text-center">
                  {item.sub_subcategories_name}
                </td>
                <td className="py-2 px-4 border text-center">
                  <div className="mb-2">
                    {console.log(item.Status)}

                    <select
                      id="Status"
                      value={item.Status}
                      onChange={(e) => handleStatus(item.id, e)}
                      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table> */}
      </div>

      <PaginationExample pageCount={pageCount} onPageChange={handlePageChange} />


      
    </div>
  );
};

export default FeaturedBannerZone;
