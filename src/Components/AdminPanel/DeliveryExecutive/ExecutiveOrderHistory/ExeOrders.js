import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetAllCreatedDeliveryExecutive, GetAllCreatedItems, GetExecutivesOrderHistory } from "../../../CrudOperations/GetOperation";
import { CreteDeliveryExecutive } from "../../../CrudOperations/PostOperation";
import { ChangeDeliveryExecutiveStatus } from "../../../CrudOperations/Update&Edit";
import { deleteStoredItem } from "../../../CrudOperations/DeleteOperation";
import PaginationExample from "../../Stocks/Purchase/PaginationExample";
import ExecutiveSearchBar from "../ExecutiveSearchBar";
import { FaListAlt } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const ExeOrders = ({ordersdata , onclose}) => {
    const {
        
        executive_unique_id,
     name,
        orders
        
    
    
    } = ordersdata || null;
  const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
  const itemsPerPage = 7; // Items per page

  const [searchQuery, setSearchQuery] = useState("");

  const [phone, setPhone] = useState("");
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


  const filteredExecutiveList = orders.filter((item) =>
    item.orderId.toLowerCase().includes(searchQuery.toLowerCase())
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
 <div className="flex justify-between">
 <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b-4 border-blue-500 pb-2">
        Executive : {executive_unique_id}
      </h1>

      <div className={`${onclose ? "block" : "hidden"}`} onClick={onclose}>
  <button className="collapse-icon">
    {/* Replace this with an actual icon */}
    <MdExpandMore className="w-7 h-7" />
  </button>
</div>
 </div>


  
  
  
      {/* Product Table */}
      <div className="overflow-x-auto">

      <div className="mb-6">
  <ExecutiveSearchBar onSearch={(query) => setSearchQuery(query)} />
</div>
       {currentItems.length > 0 ?  <table className="w-full bg-white border-collapse border border-gray-200">
            
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm leading-normal">


              <th className="py-3 px-6 border border-gray-300 text-center">S.no</th>
              <th className="py-3 px-6 border border-gray-300 text-center">Order ID</th>
              <th className="py-3 px-6 border border-gray-300 text-center">Assigned On</th>
              <th className="py-3 px-6 border border-gray-300 text-center">Expected Delivery Date</th>

              <th className="py-3 px-6 border border-gray-300 text-center">Delivered Date</th>

              <th className="py-3 px-6 border border-gray-300 text-center">Order Status</th>

              <th className="py-3 px-6 border border-gray-300 text-center">Total Amount</th>



            </tr>
          </thead>
          <tbody>

            {console.log(ExecutiveList)}
            

            {   currentItems.map((item, index) => (
              <tr
                key={item.executive_unique_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-6 border border-gray-300 text-center">{index + 1}</td>
                <td className="py-3 px-6 border border-gray-300 text-center">{item.order_UniqueId}</td>
                <td className="py-3 px-6 border border-gray-300 text-center">{item.exe_assigned_date}</td>
                <td className="py-3 px-6 border border-gray-300 text-center">

              {item.expected_delivery_date}

                </td>
                <td className="py-3 px-6 border border-gray-300 text-center">{item.delivered_date ? item.delivered_date  : "OnDelivery" }</td>
                <td className="py-3 px-6 border border-gray-300 text-center">{item.order_Status}</td>
                <td className="py-3 px-6 border border-gray-300 text-center">{item.total_amount_paid}</td>
              </tr>
            )) 
            }
          </tbody>
        </table> :

<div className="text-center font-semibold text-black">
Opps! No Order Assigned Yet!!
</div>
        
        
        }
      </div>
  
      {/* Pagination */}
      <div className="mt-6">
        <PaginationExample pageCount={pageCount} onPageChange={handlePageChange} />
      </div>
    </div>
  );
  
};

export default ExeOrders;
