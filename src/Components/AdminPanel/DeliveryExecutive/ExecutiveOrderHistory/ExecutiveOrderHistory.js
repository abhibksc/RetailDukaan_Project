import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAllCreatedDeliveryExecutive, GetAllCreatedItems, GetExecutivesOrderHistory } from "../../../CrudOperations/GetOperation";
import PaginationExample from "../../../PaginationExample";
import ExecutiveSearchBar from "../ExecutiveSearchBar";
import { FaListAlt } from "react-icons/fa";
import ExeOrders from "./ExeOrders";

const ExecutiveOrderHistory = () => {
  const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
  const itemsPerPage = 7; // Items per page

  const [searchQuery, setSearchQuery] = useState("");

  const [orderModal, setOrderModal] = useState(false);
  const [orders, setOrders] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  //   const [category_id, setCategoryId] = useState("");
  const [subCategory_id, setSubCategoryId] = useState("");
  const [sub_subCategory_id, setSub_SubCategoryId] = useState("");
  const [CategoryList, setCategoryList] = useState([]);
  const [SubCategoryList, setSubCategoryList] = useState([]);
  const [Sub_SubCategoryList, setSub_SubCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ExecutiveList, setExecutiveList] = useState([]);


  // Fetch Categories, Subcategories, and Sub-Subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ExecutiveHistoryResponse] = await Promise.all([
          GetExecutivesOrderHistory(),
        ]);

        console.log(ExecutiveHistoryResponse);
        
        if (
          ExecutiveHistoryResponse.data.message === "All executive order history retrieved successfully!")

          console.log(ExecutiveHistoryResponse);
          
          setExecutiveList(ExecutiveHistoryResponse.data.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filteredExecutiveList = ExecutiveList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.executive_unique_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the page count (total items divided by items per page)
  const pageCount = Math.ceil(filteredExecutiveList.length / itemsPerPage);

  // Slice the items array to only show items for the current page
  const currentItems = filteredExecutiveList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return loading ? (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  ) : (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Search Bar */}
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b-4 border-blue-500 pb-2">
        Delivery Executive: Order History
      </h1>


  
  
  
      {/* Product Table */}
      <div className="overflow-x-auto">

      <div className="mb-6">
  <ExecutiveSearchBar onSearch={(query) => setSearchQuery(query)} />
</div>
        <table className="w-full bg-white border-collapse border border-gray-200">
            
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm leading-normal">
              <th className="py-3 px-6 border border-gray-300 text-center">S.no</th>
              <th className="py-3 px-6 border border-gray-300 text-center">Executive ID</th>
              <th className="py-3 px-6 border border-gray-300 text-center">Name</th>
              <th className="py-3 px-6 border border-gray-300 text-center">Orders</th>
            </tr>
          </thead>
          <tbody>

            {console.log(ExecutiveList)}
            

            {currentItems.map((item, index) => (
              <tr
                key={item.executive_unique_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-6 border border-gray-300 text-center">{index + 1}</td>
                <td className="py-3 px-6 border border-gray-300 text-center">{item.executive_unique_id                }</td>
                <td className="py-3 px-6 border border-gray-300 text-center">{item.name}</td>
                <td className="py-3 px-6 border border-gray-300 text-center">

                  <button
                                              className="text-blue-500 hover:text-blue-700"
                                              onClick={() => {setOrderModal(true) 
                                                 setOrders(item)}}
                                            >
                                              <FaListAlt size={20} />
                                            </button>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Pagination */}
      <div className="mt-6">
        <PaginationExample pageCount={pageCount} onPageChange={handlePageChange}  />
      </div>


    {orderModal &&  <ExeOrders ordersdata={orders} onclose={()=>setOrderModal(false)}/>}
    </div>
  );
  
};

export default ExecutiveOrderHistory;
