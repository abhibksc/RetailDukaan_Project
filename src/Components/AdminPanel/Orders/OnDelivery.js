import React, { useEffect, useState } from "react";
import {  getOnDeliveryExecutive } from "../../CrudOperations/GetOperation";

import { useNavigate } from "react-router-dom";
import { FaListAlt } from "react-icons/fa";
import PaginationExample from "../../PaginationExample";
import { DeliveryStatus } from "./OrderModals";
import { toast } from "react-toastify";

const OnDelivery = () => {
      const [searchQuery, setSearchQuery] = useState("");
        const [filter, setFilter] = useState("all"); // all, new, old
   const [currentPage, setCurrentPage] = useState(0);
   const itemsPerPage = 9; // Number of items per page
  const navigate = useNavigate();
  const [onOrderDetails, setOnOrderdetails] = useState([]);
  const [FilteronOrderDetails, setFilterOnOrderDetails] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]); // Track selected orders

  const [isModalOpen, setIsOpenModal] = useState(false); // Track selected orders

  const [DeliveryStatusModalData, setDeliveryStatusModalData] = useState(false); // Track selected orders
  const [DeliveryStatusModal, setisDeliveryStatusModal] = useState(false); // Track selected orders

  const [DateOfAssign, setDateOfAssign] = useState(""); // Track selected orders




  useEffect(() => {
    const fetchPincodes = async () => {
      const response = await getOnDeliveryExecutive();
      console.log(response);

      if (
        response.data.message === "All On-Delivery executives and their orders retrieved successfully!"
      ) {
        console.log(response.data.data);
        setOnOrderdetails(response.data.data);
        setFilterOnOrderDetails(response.data.data);
      }
      else{
        toast.error(   response.data.message)
      }
    };
    fetchPincodes();
  }, []);


  // Function to filter onOrderDetails based on a specific status
  function filterByStatus(onOrderDetails, statusFilter) {
    if (statusFilter === "all") return onOrderDetails;
  
    return onOrderDetails.filter((ele) => {
      // Check if the statusFilter exists in the status object and has any orders
      return ele.status[statusFilter] && ele.status[statusFilter].length > 0;
    });
  }
  


  // Filter and search logic
    const filteredExecutiveId =  filterByStatus(onOrderDetails, filter);
  
    // filteredExecutiveId = filteredExecutiveId.sort((a, b) => {
    //   // Sorting orders by date, most recent first
    //   const dateA = new Date(a.order_receive_date);
    //   const dateB = new Date(b.order_receive_date);
    //   return dateB - dateA; // Newest date at the top
    // });
   
  
   
  
    // useEffect(() => {
    //   console.log(filteredExecutiveId);
    // }, [filteredExecutiveId]);
  
    // // Calculate total pages
    const pageCount = Math.ceil(filteredExecutiveId.length / itemsPerPage) || 1;
  
    const validCurrentPage = Math.max(0, Math.min(currentPage, pageCount - 1));
  
    // Determine items for the current page
    const displayedOrders = filteredExecutiveId.slice(
      validCurrentPage * itemsPerPage,
      (validCurrentPage + 1) * itemsPerPage
    );

    const handlePageChange = ({ selected }) => {
        console.log(selected);
    
        setCurrentPage(selected);
      };
  




  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId) // Remove if already selected
        : [...prevSelected, orderId] // Add if not selected
    );
  };

  const handleAssignClick = () => {
    setIsOpenModal(!isModalOpen);
    console.log("Selected Order IDs:", selectedOrderIds);
  };

  // handleOnDelivery

  const handleOnDelivery = () => {
    navigate(`/admin/${localStorage.getItem("Merchanttoken")}/order/ondelivery`);
  };

  const handleOnAssigningTheExecutive = async()=>{



    const response = await getAllonOrderDetails();
    console.log(response);

    if (
      response.data.messsage === "All onOrderDetails Retrive Successfully!!"
    ) {
      console.log(response.data.data);
      setOnOrderdetails(response.data.data);
      setFilterOnOrderDetails(response.data.data);
    }





    setIsOpenModal(!isModalOpen);
    
    console.log("Assigning the executive");
  }

  const handleDeliveryStatusClick = (status,order_assingment_date)=>{
    console.log(status);

    

    setDeliveryStatusModalData(status)

    setDateOfAssign(order_assingment_date)

    setisDeliveryStatusModal(!DeliveryStatusModal);


  }

   const handleTrackClick = (lat,lng) => {
  
      
  
      if(lat && lng){
  
        const token = localStorage.getItem('Merchanttoken');  // Open a new page (tab) with the order ID or any other relevant data
        const url = `/admin/${token}/order/track/${lat}/${lng}`; // Example URL with dynamic order ID
        window.open(url, '_blank'); // Open the URL in a new tab
  
      }
      else{
  
        toast.error("Please assign the delivery executive Or the executive current location is not available")
  
  
      }
  
    };











  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <div className="flex flex-row justify-between w-full mb-7">

        <h1 className="text-lg font-bold border-b-2 text-gray-800">
        Executives On Delivery
        </h1>

            {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Order ID"
          className="border px-4 py-2 rounded-md w-full sm:w-1/2"
          // value={searchQuery}
          // onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter Dropdown */}
        <select
          className="border px-4 py-2 rounded-md w-full sm:w-1/4"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="picked up">Picked up</option>
        </select>
      </div>




      </div>

      <div className="">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                s.no
              </th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
               Executive Id
              </th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
            Executive Name
              </th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                Status
              </th>
            
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                Track
              </th>
             
            </tr>
          </thead>

          <tbody>
            
            {searchQuery ? displayedOrders.length > 0 ?   displayedOrders.filter(ele => 
                                 ele.executive.executive_unique_id.toLowerCase() === searchQuery.toLowerCase()
                 ) 
            
            
            .map((item ,index) => (
              <tr key={index} className="bg-blue-200">
                <td className="py-3 px-5 border-b border-gray-200">
                    {index +1 }
                  
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                {item.executive.executive_unique_id
              }
                </td>

                <td className="py-3 px-5 border-b border-gray-200">
                {item.executive.DeliveryExecutive_name}
                </td>


                <td className="py-3 px-5 border-b border-gray-200">
                  <button
                                         className="text-blue-500 hover:text-blue-700"
                                         onClick={() =>
                                          handleDeliveryStatusClick(
                                            item.status,
                                            item.executive.order_assingment_date
                                          )
                                         }
                                       >
                                         <FaListAlt size={20} />
                                       </button>
                </td>


               
                <td className="py-3 px-5 border-b border-gray-200">
                <button
                                         className="text-blue-500 hover:text-blue-700"
                                         onClick={() =>
                                           handleDeliveryStatusClick(
                                             item.status
                                           )
                                         }
                                       >
                                         <FaListAlt size={20} />
                                       </button>
                </td>
              </tr>
            )) : <div> NO any pending order exists</div> 
        
        
        :


        displayedOrders.length > 0 ?  displayedOrders.map((item ,index) => (
            <tr key={item.executive.DeliveryExecutive_Id            }>
              <td className="py-3 px-5 border-b border-gray-200">
                  {index +1 }
                
              </td>
              <td className="py-3 px-5 border-b border-gray-200">
              {item.executive.executive_unique_id
              }
              </td>

              <td className="py-3 px-5 border-b border-gray-200">
              {item.executive.DeliveryExecutive_name}
              </td>


              <td className="py-3 px-5 border-b border-gray-200">
                <button
                                       className="text-blue-500 hover:text-blue-700"
                                       onClick={() =>
                                        handleDeliveryStatusClick(
                                          item.status,
                                          item.executive.order_assingment_date
                                        )
                                      }
                                     >
                                       <FaListAlt size={20} />
                                     </button>
              </td>


             
              <td className="py-3 px-5 border-b border-gray-200">
              <button
                                       className="text-blue-500 hover:text-blue-700"
                                       onClick={() => handleTrackClick(item.executive.DeliveryExecutive_last_latitude , item.executive.DeliveryExecutive_last_longitude) }
                                     >
                                       <FaListAlt size={20} />
                                     </button>
              </td>
            </tr>
          )) : <div> NO any pending order exists</div> 

        
        
        }
          </tbody>


          
        </table>

        <PaginationExample
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
      </div>



        {DeliveryStatusModal && (
              <DeliveryStatus close={handleDeliveryStatusClick} status={DeliveryStatusModalData} DateOfAssign={DateOfAssign} />
            )}





    </div>
  );
};

export default OnDelivery;
