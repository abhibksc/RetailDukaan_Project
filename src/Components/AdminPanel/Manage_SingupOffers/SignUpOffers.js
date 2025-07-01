import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AddSignUpOffers from "./AddSignUpOffers";
import { useNavigate } from "react-router-dom";
import { getSingupAllOffers } from "../../CrudOperations/GetOperation";
import { Delete_particular_OfferItem, handleDeleteParticular_SignUp_offer_FromDataBase } from "../../CrudOperations/DeleteOperation";

const SignUpOffers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSingupAllOffers, setFilteredSingupAllOffers] = useState([]);
  const [SingupAllOffers, setSingupAllOffers] = useState([]);
  const [itemModal, setItemModal] = useState("");

  const [edit, setEdit] = useState("");

  const [viewImageModalOpen, setViewImageModalOpen] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();


  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // Or any number per page



const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredSingupAllOffers.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(filteredSingupAllOffers.length / itemsPerPage);

useEffect(() => {
  const fetchStaffs = async () => {
    const response = await getSingupAllOffers();

    if (response?.message === "All SignUp Offers retrieved successfully!") {
      // Sort by ID descending (assuming higher ID = newer offer)
      const sortedData = response.data.sort((a, b) => b.id - a.id);

      setSingupAllOffers(sortedData);
      setFilteredSingupAllOffers(sortedData);
    }
  };
  fetchStaffs();
}, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = SingupAllOffers.filter(
      (p) =>
        p.title.toLowerCase().includes(query)
    );
    setFilteredSingupAllOffers(filteredList);
  };


  const handleAddStaffformClick = () => {
    // setIsModalOpen(true);

    navigate(
      `/admin/${localStorage.getItem("Merchanttoken")}/Add-singupOffers`,
      { state: edit }
    );
  };

  const closeModal = () => {
    setEdit("");
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const response = await getDuttyAllotement();
    if (response.data.Message === "Success") {
      setSingupAllOffers(response.data.AllottedDeputies);
      setFilteredSingupAllOffers(response.data.AllottedDeputies);

      setEdit("");

      setIsModalOpen(false); // Close the modal after adding
      toast.success("Staff added or Update successfully!");
    }
  };

  const handleUpdate = (newStaff) => {

    setSingupAllOffers((prev) =>
      prev.map((prevStaff) =>
        prevStaff.id === edit.id
          ? {
              ...prevStaff, // Keep existing properties
              ...newStaff, // Merge properties from newStaff
            }
          : prevStaff
      )
    );

    setFilteredSingupAllOffers((prev) =>
      prev.map((prevStaff) =>
        prevStaff.id === edit.id
          ? {
              ...prevStaff,
              ...newStaff,
            }
          : prevStaff
      )
    );

    setEdit(null);
    closeModal(); // Close the modal after updating
  };


  const handleItemClick = (items)=>{
    setItemModal(items)
  }

  const handleItemDelete = async(id)=>{

    const response = await Delete_particular_OfferItem({id});
    console.log(response);



    if(response?.data?.message == "signUp_offer_items deleted successfully!"){



   const responsegetSingupAllOffers = await getSingupAllOffers();

    if (responsegetSingupAllOffers?.message === "All SignUp Offers retrieved successfully!") {
      // Sort by ID descending (assuming higher ID = newer offer)
      const sortedData = responsegetSingupAllOffers.data.sort((a, b) => b.id - a.id);

      setSingupAllOffers(sortedData);
      setFilteredSingupAllOffers(sortedData);
setItemModal("")

    }

toast.success("Deleted Successfully!!")












    }
    else{
      toast.error(response?.data?.message)
    }
    
  }

  const handleDeleteParticular_SignUp_offer = async(id)=>{


    const response = await handleDeleteParticular_SignUp_offer_FromDataBase({id});


    
    if(response?.data?.message == "signUp_Offer deleted successfully!"){



   const responsegetSingupAllOffers = await getSingupAllOffers();

    if (responsegetSingupAllOffers?.message === "All SignUp Offers retrieved successfully!") {
      // Sort by ID descending (assuming higher ID = newer offer)
      const sortedData = responsegetSingupAllOffers.data.sort((a, b) => b.id - a.id);

      setSingupAllOffers(sortedData);
      setFilteredSingupAllOffers(sortedData);
setItemModal("")


    }

toast.success("Deleted Successfully!!")


    }
    else{
      toast.error(response?.data?.message)
    }



    
  }


  const handle_Edit__Particular_SignUp_offer = (id)=>{

    navigate(`/admin/${localStorage.getItem('Merchanttoken')}/Add-singupOffers` , {

      state : {
     Edit_id : id
      }
    })



  }

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
        Manage SignUp Offers
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-1/2 border border-gray-300 p-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleAddStaffformClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-500 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Offer
          </button>
        </div>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "S.No",
                "Image",
                "Title",
                "Mrp",
                "Discount",
                                "Items",
                "Description",
                "Cashback",
                           "warehouse",
                "Status",
                        "Action",
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
        {currentItems.length > 0 ? (
  currentItems.map((p, index) => (
    <tr key={p.id} className="border-b transition-colors duration-200 hover:bg-gray-50">
      <td className="py-3 px-4 text-center">{indexOfFirstItem + index + 1}</td>
     <td className="py-3 px-4 text-center">
  <img
    className="h-20 w-20 cursor-pointer hover:scale-105 transition-transform duration-200 rounded"
    src={p.offer_image_path}
    alt={p.title}
    onClick={() => {
      setSelectedImage(p.offer_image_path);
      setViewImageModalOpen(true);
    }}
  />
</td>

      <td className="py-3 px-4 text-center">{p.title}</td>
      <td className="py-3 px-4 text-center">{p.offer_mrp}</td>
      <td className="py-3 px-4 text-center">{p.offer_discount}</td>
      <td className="py-3 px-4 text-center cursor-pointer text-blue-500" onClick={()=>handleItemClick(p.items)}>Click</td>
      <td className="py-3 px-4 text-center">{p.offer_description}</td>
      <td className="py-3 px-4 text-center">{p.offer_cashback}</td>

        <td className="py-3 px-4 text-center">{p.warehouse_name}</td>


      <td className="py-3 px-4 text-center">{p.offer_status === "1" ? "Active" : "InActive"}</td>
          <td className="py-3 px-4 text-center">
  <div className="flex justify-center items-center gap-2">
    <button
      className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition"
      onClick={() => handle_Edit__Particular_SignUp_offer(p.id)}
    >
      ✏️ Edit
    </button>

    <button
      className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
      onClick={() => handleDeleteParticular_SignUp_offer(p.id)}
    >
      🗑️ Delete
    </button>
  </div>
</td>

    </tr>
  ))
) : (
  <tr>
    <td colSpan="9" className="py-3 text-center text-gray-600">
      No Staffs found.
    </td>
  </tr>
)}

          </tbody>
        </table>


        <div className="flex justify-center mt-6 space-x-2">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
  >
    Prev
  </button>
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-4 py-2 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
    >
      {page}
    </button>
  ))}
  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
  >
    Next
  </button>
</div>

      </div>


      {viewImageModalOpen && selectedImage && (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
    <div className=" rounded-lg p-4 shadow-lg relative max-w-3xl w-full">
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-4xl"
        onClick={() => {
          setSelectedImage(null);
          setViewImageModalOpen(false);
        }}
      >
        &times;
      </button>
      <img
        src={selectedImage}
        alt="View Offer"
        className="w-full h-auto object-contain rounded-md"
      />
    </div>
  </div>
)}



{/* //itemModal */}


{itemModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
    <div className="bg-white rounded-lg p-6 shadow-lg relative max-w-3xl w-full">
      <button
        className="absolute top-2 right-4 text-red-500 hover:text-red-700 text-4xl"
        onClick={() => {
          // Add logic to close the modal
          setItemModal("");
        }}
      >
        &times;
      </button>



      <h2 className="text-xl font-semibold mb-4">Item Details</h2>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Variant Name</th>
            <th className="border px-4 py-2">Action</th>

          </tr>
        </thead>
        <tbody>
          {itemModal.map((item , index) => (
            <tr key={item.id} className="overflow-scroll">
              <td className="border px-4 py-2 text-center">{index+1}</td>
              <td className="border px-4 py-2 flex justify-center">
                <img src={item.image} alt={item.variant_name} className="h-16 w-16 object-cover rounded" />
              </td>
              <td className="border px-4 py-2 text-center">{item.itemName} {item.variant_name} ({item.skuId})</td>
              <td className="border px-4 py-2 text-center text-red-500 cursor-pointer" onClick={()=>handleItemDelete(item.id)}>{"Delete"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}




















      {/* Add Staff Modal */}
      {isModalOpen && (
        <AddSignUpOffers
          closeModal={closeModal}
          onSubmit={handleSubmit}
          alloteDuty={edit}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default SignUpOffers;
