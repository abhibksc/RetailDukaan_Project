import React, { useEffect, useState } from "react";
import PaginationExample from "./PaginationExample";
import { getAllPurchase } from "../../../CrudOperations/GetOperation";
import ViewDetails from "./ViewDetails";
import { useNavigate } from 'react-router-dom';

const PurchaseList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [modalData, setModalData] = useState(null); // State to store data for the modal
  const navigate = useNavigate();


  const itemsPerPage = 10; // Number of items per page
  const [purchaseList, setPurchaseList] = useState([]); // State to store purchase data
  const [currentPage, setCurrentPage] = useState(0); // State to track the current page

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await getAllPurchase();
        if (response.data.message === "All purchases retrieved successfully!") {
          setPurchaseList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      }
    };

    fetchPurchases();
  }, []);

  // Calculate the total number of pages
  const pageCount = Math.ceil(purchaseList.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // Get items for the current page
  const currentItems = purchaseList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleView = (item) => {

    const Merchanttoken = localStorage.getItem('Merchanttoken');

    navigate(`/admin/${Merchanttoken}/purchaseDetails`, { state: item });
  };

  // handleEdit

  const handleEdit = (item) => {

    const Merchanttoken = localStorage.getItem('Merchanttoken');

    navigate(`/admin/${Merchanttoken}/managePurchase`, { state: item });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setModalData(null); // Clear the modal data
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-2xl font-bold  mb-4">Purchase List</h1>
      <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              S.No
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Invoice No.
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Date
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Supplier
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              GST No.
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Taxable Amount
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Edit
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              View
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={item.id}
              className="border-b transition-colors duration-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-center">
                {currentPage * itemsPerPage + index + 1}
              </td>
              <td className="py-3 px-4 text-center">
                {item.invoiceNo}
              </td>
              <td className="py-3 px-4 text-center">
                {item.date}
              </td>
              <td className="py-3 px-4 text-center">
                {item.Supplier_Name}
              </td>
              <td className="py-3 px-4 text-center">{item.Supplier_Gstin}</td>
              <td className="py-3 px-4 text-center">
                {item.totalTaxableAmount}
              </td>
              <td className="py-3 px-4 text-center">
                <button className="text-blue-500 hover:underline" onClick={() => handleEdit(item)}>Edit</button>
              </td>
              <td className="py-3 px-4 text-center">
                <button className="text-red-500 hover:underline" onClick={() => handleView(item)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationExample
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />

{/* <ViewDetails isOpen={isModalOpen} onClose={handleCloseModal} item={modalData} >
      </ViewDetails> */}


    </div>
  );
};

export default PurchaseList;
