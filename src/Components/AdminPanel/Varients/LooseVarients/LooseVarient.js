import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getAllLooseVarient } from "../../../CrudOperations/GetOperation";
import { DeleteLooseVarient, DeleteLooseVarientwholeItem } from "../../../CrudOperations/DeleteOperation";
import AddLooseVarient from "./AddLooseVarient";
import { BiFilter } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const LooseVarient = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getAllLooseVarient();
      console.log(response);
      
      if (
        response &&    response.data.message === "All loose_variant retrieved successfully!"
      ) {
        setLooseVarientList(response.data.data);
        setFilteredLooseVarientList(response.data.data);
      }
    };
    fetchBrands();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = LooseVarientList.filter(
      (p) =>
        p.item_description.toLowerCase().includes(query) ||
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

  const handleDeleteallVarients = async (id) => {
    const previousLooseVarientList = [...LooseVarientList];
    const updatedList = LooseVarientList.filter((p) => p.id !== id);
    setLooseVarientList(updatedList);
    setFilteredLooseVarientList(updatedList);

    try {
      const response = await DeleteLooseVarientwholeItem(id);
      console.log(response);
      
      if (response.data.message === "loose_variant deleted successfully") {
        toast.success("loose_variants deleted successfully");
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

  const handleUpdateLooseVarient = async (p) => {
    // const Item = LooseVarientList.find((p) => p.id === id);
    // setEdit(Item);
    // setIsModalOpen(true);

    const Merchanttoken = localStorage.getItem("Merchanttoken");

    navigate(`/admin/${Merchanttoken}/addlooseVarient` ,    {state : p});



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

  const handleView = (varients)=>{

    console.log(varients.Variants);
    
    const Merchanttoken = localStorage.getItem('Merchanttoken');

    navigate(`/admin/${Merchanttoken}/viewLooseVarients`, { state: varients });
  }

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Loose Varients</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-full sm:w-1/2 border p-3 rounded-md"
        />
        <button
          onClick={handleAddBrandformClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          <FontAwesomeIcon icon={faPlus} /> Add Varient
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Item",
                "Category",
                "SubCategory",
                "Sub SubCategory",
                "varients",
                "Edit",
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
                  
                  <td className="py-3 px-4 text-center">{p.Item_ItemName}</td>
                  <td className="py-3 px-4 text-center">{p.category_name}</td>
                  <td className="py-3 px-4 text-center">{p.subcategory_name}</td>
                  <td className="py-3 px-4 text-center">{p.sub_subcategory_name}</td>
                  

                  <td className="py-3 px-4 text-center cursor-pointer">
                    <button
                      onClick={() => handleView(p)}
                      className="text-blue-500"
                    >
                      <BiFilter />
                    </button>
                  </td>


                        <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleUpdateLooseVarient(p)}
                      className="text-blue-500"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>

                
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteallVarients(p.id)}
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

 

      {/* Warehouse Modal */}
      {isWarehouseModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Warehouse</h2>
            <p className="text-lg font-inter mb-4">{warehouse}</p>
            <button
              onClick={() => setisWarehouseModalOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}


          {/* isCategoryModalOpen Modal */}
    {isCategoryModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white table-auto border rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {["Category", "SubCategory" ,"Sub_SubCategory"].map((heading) => (
                      <th key={heading} className="py-3 px-4 text-center">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                      <tr  className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-center">
                         {Category.category_name}
                        </td>

                        <td className="py-3 px-4 text-center">
                         {Category.subcategory_name}
                        </td>

                        <td className="py-3 px-4 text-center">
                         {Category.sub_subcategory_name}
                        </td>

                        
                      </tr>
                  ) }
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setisCategoryModalOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 mt-7 ml-24 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LooseVarient;
