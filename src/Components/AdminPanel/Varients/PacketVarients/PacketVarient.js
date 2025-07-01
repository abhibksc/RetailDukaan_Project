import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllPacketVarient } from "../../../CrudOperations/GetOperation";
import { DeletePacketVarientwholeItem } from "../../../CrudOperations/DeleteOperation";

const PacketVarient = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLooseVarientList, setFilteredLooseVarientList] = useState([]);
  const [LooseVarientList, setLooseVarientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchPacketVariants = async () => {
      const response = await getAllPacketVarient();
      console.log(response);
      

      if (response?.data?.message === "All variants retrieved successfully!") {
        setLooseVarientList(response?.data?.data);
        setFilteredLooseVarientList(response?.data?.data);
      }

      setLoading(false);
    };
    fetchPacketVariants();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search

    const filteredList = LooseVarientList.filter((p) =>
      p.Item_ItemName.toLowerCase().includes(query)
    );
    setFilteredLooseVarientList(filteredList);
  };

  const handleDeleteallVarients = async (id) => {
    const previousLooseVarientList = [...LooseVarientList];
    const updatedList = LooseVarientList.filter((p) => p.id !== id);
    setLooseVarientList(updatedList);
    setFilteredLooseVarientList(updatedList);

    try {
      const response = await DeletePacketVarientwholeItem(id);

      if (response.data.message === "packet_variant deleted successfully") {
        toast.success("packet_variant deleted successfully");
      } else {
        setLooseVarientList(previousLooseVarientList);
        setFilteredLooseVarientList(previousLooseVarientList);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLooseVarientList(previousLooseVarientList);
      setFilteredLooseVarientList(previousLooseVarientList);
      toast.error("Error deleting PacketVariant.");
    }
  };

  const handleUpdatepacketVarient = (p) => {
    const Merchanttoken = localStorage.getItem("Merchanttoken");
    navigate(`/admin/${Merchanttoken}/addpacketVarient`, { state: p });
  };

  const handleAddPacketVariantformClick = () => {
    const Merchanttoken = localStorage.getItem("Merchanttoken");
    navigate(`/admin/${Merchanttoken}/addpacketVarient`);
  };

  const handleView = (varients) => {
    const Merchanttoken = localStorage.getItem("Merchanttoken");
    navigate(`/admin/${Merchanttoken}/viewPacketVarients`, { state: varients });
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLooseVarientList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLooseVarientList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Packet Varients</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-full sm:w-1/2 border p-3 rounded-md"
        />
        <button
          onClick={handleAddPacketVariantformClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4 sm:mt-0"
        >
          <FontAwesomeIcon icon={faPlus} /> Add Varient
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">SubCategory</th>
              <th className="px-4 py-2">Sub SubCategory</th>
              <th className="px-4 py-2">Varients</th>
              <th className="px-4 py-2">Edit</th>
              <th className="px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {console.log(currentItems)
            }
            {currentItems.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.Item_ItemName}</td>
                <td className="border px-4 py-2">{item.category_name}</td>
                <td className="border px-4 py-2">{item.subcategory_name}</td>
                <td className="border px-4 py-2">{item.sub_subcategory_name}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleView(item)}
                    className="text-blue-600 underline"
                  >
                    View
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleUpdatepacketVarient(item)}>
                    <FontAwesomeIcon icon={faPen} className="text-yellow-600" />
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleDeleteallVarients(item.id)}>
                    <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No packet variants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-4 py-2 rounded ${
              currentPage === num
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      
    </div>
  );
};

export default PacketVarient;
