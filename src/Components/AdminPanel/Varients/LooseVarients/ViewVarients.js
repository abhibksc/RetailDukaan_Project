import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getAllLooseVarient } from "../../../CrudOperations/GetOperation";
import { DeleteLooseVarient } from "../../../CrudOperations/DeleteOperation";
import AddLooseVarient from "./AddLooseVarient";
import { BiAlignRight, BiFilter } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { updateVarientStatus } from "../../../CrudOperations/Update&Edit";

const ViewVarients = () => {


    const locationData = useLocation();
    console.log(locationData);
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Status, setStatus] = useState("");

  const [Packet_Specification_View, setPacket_Specification_View] = useState(
    []
  );

  const [viewSpecificationModal, setviewSpecificationModal] = useState(false);




  const [item_id, setItem_id] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLooseVarientList, setFilteredLooseVarientList] = useState([]);
  const [LooseVarientList, setLooseVarientList] = useState([]);
  const [isWarehouseModalOpen, setisWarehouseModalOpen] = useState(false);
  const [warehouse, setWareHouse] = useState("");

  const navigate = useNavigate();


  const [isCategoryModalOpen, setisCategoryModalOpen] = useState(false);
  const [Category, setCategory] = useState({
    category_name : "",
    subcategory_name : "",
    sub_subcategory_name : ""


  });

  const [edit, setEdit] = useState(null);


  useEffect(()=>{


    if(locationData){

        console.log(locationData);

        setItem_id(locationData.state.id)


        setLooseVarientList(locationData.state.Variants);
        setFilteredLooseVarientList(locationData.state.Variants);


    }
    
  },[location, location.state])


  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = LooseVarientList.filter(
      (p) =>
        p.variantName.toLowerCase().includes(query) ||
        p.sku_id.toLowerCase().includes(query)
    );
    setFilteredLooseVarientList(filteredList);
  };

  const handleCategoryModal = ( {category_name , subcategory_name ,sub_subcategory_name })=>{

    setCategory({

      category_name : category_name,
      subcategory_name : subcategory_name,
      sub_subcategory_name : sub_subcategory_name

    })

    setisCategoryModalOpen(true);



  }

  const handleDeletevarient = async (id) => {
    const previousLooseVarientList = [...LooseVarientList];
    const updatedList = LooseVarientList.filter((p) => p.id !== id);
    setLooseVarientList(updatedList);
    setFilteredLooseVarientList(updatedList);

    try {
      const response = await DeleteLooseVarient(id);
      if (response.data.message === "loose_variant deleted successfully") {
      
        const Merchanttoken = localStorage.getItem('Merchanttoken');
  
        navigate(`/admin/${Merchanttoken}/looseVarient`);
  
  
        toast.success(`Status: ${response.data.message}`);
      } else {
        setLooseVarientList(previousLooseVarientList);
        setFilteredLooseVarientList(previousLooseVarientList);
        toast.error("Failed to delete loose_variant. Please try again.");
      }
    } catch (error) {
      setLooseVarientList(previousLooseVarientList);
      setFilteredLooseVarientList(previousLooseVarientList);
      toast.error("Error deleting Brand.");
    }
  };

  const handleUpdateBrand = async (id) => {
    const Item = LooseVarientList.find((p) => p.id === id);
    setEdit(Item);
    setIsModalOpen(true);
  };

  const handleAddBrandformClick = () => {

    const Merchanttoken = localStorage.getItem("Merchanttoken");

    navigate(`/admin/${Merchanttoken}/addlooseVarient`);


    // setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleWarehouseClick = (warehouse) => {
    setWareHouse(warehouse); // Set the warehouse
    setisWarehouseModalOpen(true); // Open the modal
  };

  const handleSubmit = async(newBrand) => {
    console.log(newBrand);

    if(newBrand){

      const response = await getAllLooseVarient();
      console.log(response);
      
      if (
        response.data.message === "All loose_variant retrieved successfully!"
      ) {
        setLooseVarientList(response.data.data);
        setFilteredLooseVarientList(response.data.data);
      }

      closeModal(); // Close the modal after updating

      
    toast.success("loose_Varient added successfully!");
    }
  };

  const handleUpdate = async() => {
    const response = await getAllLooseVarient();
    console.log(response);
    
    if (
      response.data.message === "All loose_variant retrieved successfully!"
    ) {
      setLooseVarientList(response.data.data);
      setFilteredLooseVarientList(response.data.data);
    }
    
    setEdit(null);
    closeModal(); // Close the modal after updating

    
  toast.success("loose_Varient updated successfully!");
  };

  const handlestatus = async(p,e)=>{

    console.log(p);
    

    console.log(e.target.value);
    

    const response = await updateVarientStatus({id : p , Status:e.target.value});
 
    if(response.data.message === "loose_variantStatus updated successfully!"){

      console.log(response);
      

      // const response = await getAllLooseVarient();
      // console.log(response);
      
      // if (
      //   response.data.message === "All loose_variant retrieved successfully!"
      // ) {

      //   const filter = response.data.data.find((ele)=>ele.id === item_id);
      //   setLooseVarientList(filter.Variants);
      //   setFilteredLooseVarientList(filter.Variants);

      // }


    
      const Merchanttoken = localStorage.getItem('Merchanttoken');
  
      navigate(`/admin/${Merchanttoken}/looseVarient`);


      toast.success(`Status: ${response.data.data}`);
    }
    

  }


  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">View Varients</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search Sku id..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-full sm:w-1/2 border p-3 rounded-md"
        />
      
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                 "Varient",
                 "Brand",

                 "SKU ID",
                "Image",
                "Specification",
                "For Purchase",
                "Order Limit",
                "Status",
                "Delete",
              ].map((heading) => (
                <th key={heading} className="py-3 px-4 text-center">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          {console.log(filteredLooseVarientList)
          }
          <tbody>
            {filteredLooseVarientList.length > 0 ? (
              filteredLooseVarientList.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                       <td className="py-3 px-4 text-center">{p.variantName}</td>
                       <td className="py-3 px-4 text-center">{p.brand_name}</td>
                  
                  <td className="py-3 px-4 text-center">{p.sku_id}</td>
            <td className="py-3 px-4 text-center">

                  {p.image_url ?   <img     className="w-10 h-10 rounded" src={p.image_url} alt="img" />: "null"}
                  </td> 

                 { console.log(p)}
                  

                  <td className="py-3 px-4 text-center cursor-pointer">
                    <BiAlignRight
                             className="mx-auto"
                      onClick={() => {
                        setPacket_Specification_View(p.SpecificationBucket);
                        setviewSpecificationModal(true);
                      }}
                    />
                  </td>

                  <td className="py-3 px-4 text-center">

{p.OnlyForPurchase}
</td> 



                  <td className="py-3 px-4 text-center">{p.limit_per_order}</td>

                  <td className="py-3 px-4 text-center">


                  <div className="mb-2">
          <select
            id="Status"
            value={p.Status}
            onChange={(e)=>handlestatus(p.id, e)}
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>




                  </td>



                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeletevarient(p.id)}
                      className="text-red-500"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-3 text-center">
                  No Brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewSpecificationModal && (
        <div className="mb-2">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setviewSpecificationModal(false)} // Close modal on clicking outside
          >
            <div
              className="bg-white rounded-lg w-2/6 max-h-screen overflow-y-auto shadow-lg relative"
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
              {/* Close Button */}
              <button
                onClick={() => setviewSpecificationModal(false)} // Close modal on clicking the button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                ✖
              </button>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  Specifications
                </h2>
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-3 text-left font-medium text-gray-600">
                        Key
                      </th>
                      <th className="p-3 text-left font-medium text-gray-600">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    {console.log(Packet_Specification_View)}
                    
                    {Packet_Specification_View && Packet_Specification_View.length > 0 && Packet_Specification_View.map((variant, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="p-3 text-gray-700">{variant.key}</td>
                        <td className="p-3 text-gray-700">{variant.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    


    </div>
  );
};

export default ViewVarients;
