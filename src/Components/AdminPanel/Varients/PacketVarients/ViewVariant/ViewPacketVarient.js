import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { BiAlignRight, BiFilter } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePacketVarientStatus } from "../../../../CrudOperations/Update&Edit";
import { DeletePacketVarient } from "../../../../CrudOperations/DeleteOperation";
import ViewImages from "./ViewImages";
import ViewSpecification from "./ViewSpecification";


const ViewPacketVarient = () => {
  const locationData = useLocation();
  console.log(locationData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Status, setStatus] = useState("");

  const [item_id, setItem_id] = useState("");
  const [viewSpecificationModal, setviewSpecificationModal] = useState(false);
  const [viewImageModal, setViewImageModal] = useState(false);

  const [Packet_Specification_View, setPacket_Specification_View] = useState(
    []
  );

  const [ImageView, setImageView] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLooseVarientList, setFilteredLooseVarientList] = useState([]);
  const [LooseVarientList, setLooseVarientList] = useState([]);
  const [isWarehouseModalOpen, setisWarehouseModalOpen] = useState(false);
  const [warehouse, setWareHouse] = useState("");

  const navigate = useNavigate();

  const [isCategoryModalOpen, setisCategoryModalOpen] = useState(false);
  const [Category, setCategory] = useState({
    category_name: "",
    subcategory_name: "",
    sub_subcategory_name: "",
  });

  const [edit, setEdit] = useState(null);

  useEffect(() => {
    if (locationData) {
      console.log(locationData);

      setItem_id(locationData.state.id);

      setLooseVarientList(locationData.state.Variants);
      setFilteredLooseVarientList(locationData.state.Variants);
    }
  }, [location, location.state]);

  const handleSearchInput = (e) => {
    console.log(LooseVarientList);
    
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = LooseVarientList.filter(
      (p) => p.variantName.toLowerCase().includes(query) || p.sku_id.toLowerCase().includes(query)
    );
    console.log(filteredList);
    setFilteredLooseVarientList(filteredList);
  };


  const handleDeletevarient = async (id) => {
    const previousLooseVarientList = [...LooseVarientList];
    const updatedList = LooseVarientList.filter((p) => p.id !== id);
    setLooseVarientList(updatedList);
    setFilteredLooseVarientList(updatedList);

    try {
      const response = await DeletePacketVarient(id);
      if (response.data.message === "packet_variant deleted successfully") {
        const Merchanttoken = localStorage.getItem("Merchanttoken");

        navigate(`/admin/${Merchanttoken}/packetVarient`);

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



  const closeModal = () => {
    setIsModalOpen(false);
  };



  const handlestatus = async (p, e) => {
    console.log(p);

    console.log(e.target.value);

    const response = await updatePacketVarientStatus({
      id: p,
      Status: e.target.value,
    });

    if (response.data.message === "packet_variantStatus updated successfully!") {
      console.log(response);

    

      const Merchanttoken = localStorage.getItem("Merchanttoken");

      navigate(`/admin/${Merchanttoken}/packetVarient`);

      toast.success(`Status: ${response.data.data}`);
    }
  };

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
                "Images",
                "Specification",
                "Order Limit",
                "Status",
                "Delete",
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-center font-semibold"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLooseVarientList.length > 0 ? (
              filteredLooseVarientList.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{p.variantName}</td>
                  <td className="py-3 px-4 text-center">{p.brand_name}</td>


                  <td className="py-3 px-4 text-center">{p.sku_id}</td>

                  <td className="py-3 px-6 text-center   cursor-pointer">
                    <BiAlignRight
                    className="mx-auto"
                      onClick={() => {
                        setImageView(p.PacketImages);
                        setViewImageModal(true);
                      }}
                    />
                  </td>

                  <td className="py-3 px-4 text-center cursor-pointer">
                    <BiAlignRight
                             className="mx-auto"
                      onClick={() => {
                        setPacket_Specification_View(p.PacketSpecification);
                        setviewSpecificationModal(true);
                      }}
                    />
                  </td>

                  <td className="py-3 px-4 text-center">{p.limit_per_order}</td>

                  <td className="py-3 px-4 text-center">
                    <div className="mb-2">
                      <select
                        id="Status"
                        value={p.Status}
                        onChange={(e) => handlestatus(p.id, e)}
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
                <td colSpan="7" className="py-3 text-center">
                  No Brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

   

      {viewImageModal && (
         <ViewImages   onclose={() => {setViewImageModal(!viewImageModal)}}  ImageView = {ImageView}  /> 
      )}

      {viewSpecificationModal && (
        <ViewSpecification   onclose={() => {setviewSpecificationModal(!viewSpecificationModal)}}  Specifications = {Packet_Specification_View}  /> 
      )}
    </div>
  );
};

export default ViewPacketVarient;
