import React, { useEffect, useState } from "react";
import {
  getAllLooseStock,
  getAllPacketStock,
  getAllStockItem,
  GetAllVarients,
} from "../../CrudOperations/GetOperation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import PaginationExample from "./Purchase/PaginationExample";

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemList, setItemList] = useState([]);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [utilize, setUtilize] = useState({ Loose: "", Packet: "" });
  const [openUtilizeModal, setOpenUtilizeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 5; // Number of items per page
  const pageCount = Math.ceil(filteredItemList.length / itemsPerPage);

  // Get items for the current page
  const currentItems = filteredItemList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };



  const sortByPurchaseDate = (data, order = "desc") => {
    return data.sort((a, b) => {
      const dateA = new Date(a.purchaseDate);
      const dateB = new Date(b.purchaseDate);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllStockItem();
        console.log(response);
  
        if (response.data.message === "Stock items retrieved successfully!") {
          console.log(response);
  
          // Sort items in descending order (latest date first)
          const sortedItems = sortByPurchaseDate(response.data.data, "desc");
  
          setItemList(sortedItems);
          setFilteredItemList(sortedItems);
        }
      } catch (error) {
        console.error("Error fetching stock items:", error);
      }
    };
  
    fetchItems();
  }, []);
  
  

  // Handle search input
  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    console.log(itemList);

  
    const filteredList = itemList.filter((p) => {


      
  
      return (
        p.loosevariantName &&  p.loosevariantName.toLowerCase().includes(query) ||
        p.packetvariantName &&  p.packetvariantName.toLowerCase().includes(query) ||
        p.sku_id && p.sku_id.toLowerCase().includes(query) ||
        (p.HSN?.toLowerCase().includes(query))
      );
    });

    console.log(filteredList);
    





  
    setFilteredItemList(filteredList);
    setCurrentPage(0); 



    
  };

  // Handle utilize button click
  const handleUtilize = async (item) => {

    console.log(item);
    
    try {
      const [allVarientsResposnse] = await Promise.all([
        // getAllLooseStock(),
        // getAllPacketStock(),
        GetAllVarients(),
      ]);

      let looseItemObject = "";
      let packetItemObject = "";

      console.log(allVarientsResposnse);
      

      // if (looseResponse.data.message === "All loose_stock retrieved successfully!") {

      //   console.log(looseResponse.data.data);
        
      //   looseItemObject = looseResponse.data.data.find(
      //     (ele) => ele.purchase_item_id === item.id
      //   );
      // }

      // if (packetResponse.data.message === "All packet_stock retrieved successfully!") {

      //   console.log(packetResponse.data.data);

      //   packetItemObject = packetResponse.data.data.find(
      //     (ele) => ele.purchase_item_id === item.id
      //   );
      // }

      // console.log(looseItemObject);
      // console.log(packetItemObject);

      

      // setUtilize({
      //   Loose: looseItemObject || { quantity: "N/A" },
      //   Packet: packetItemObject || { quantity: "N/A" },
      // });

      // setOpenUtilizeModal(true);


      
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // "02/02/2025"
};

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
        Stock
      </h1>

      <div className="mb-6 w-72 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-full border border-gray-300 py-1 px-2 rounded-md transition duration-200 shadow-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Item Name",
                "Date",
                "Type",
                "SKU ID",
                "Batch No.",
                "Brand",
                "HSN",
                "quantity",
                "Avl.quantity",
                "mrp",
                "Mfg Date",
                "Expiry Date",
                "Status"
              ].map((heading) => (
                <th key={heading} className="py-3 px-4 text-center font-semibold text-[14px] text-gray-700">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {console.log(currentItems)
            }
  {currentItems.length > 0 ? (
    currentItems.map((p) => {
      // const hasItemDetails = p.itemDetails.length > 0;
      // const firstDetail = hasItemDetails ? p.itemDetails[0] : null;

      return  (
        <tr
          key={p.id}
          className="border-b transition-colors duration-200 hover:bg-gray-50"
        >
          <td className="py-3 px-4 text-center text-[13px] ">{p.loosevariantName || p.packetvariantName }</td>
          <td className="py-3 px-4 text-center text-[13px] ">{ formatDate(p.purchaseDate) }</td>

          <td className="py-3 px-4 text-center text-[13px] ">{p.varient_type ? p.varient_type  : "loose"}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.packet_variant_sku || p.loose_variant_sku}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.batchNo ? p.batchNo : 'N/A'}</td>

          <td className="py-3 px-4 text-center text-[13px]">{p.packetVarientBrand_name || p.looseVarientBrand_name}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.HSN || "null"}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.quantity} {p.unit_name}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.AvailableQuantity == 0 ?   Math.round(p.AvailableQuantity) : (p.AvailableQuantity)} {p.unit_name}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.mrp || "null"}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.mfgDate || 0}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.expiryDate || "null"}</td>
          <td className="py-3 px-4 text-center text-[13px]">{p.packetVarientStatus || p.looseVarientStatus }</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="14" className="py-3 text-center text-gray-600">
        No items found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {openUtilizeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setOpenUtilizeModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div>
              Loose: {utilize.Loose.quantity} {utilize.Loose.unit}
            </div>
            <div>
              Packet: {utilize.Packet.quantity} {utilize.Packet.unit}
            </div>
          </div>
        </div>
      )}

    <div className="text-[13px">
    <PaginationExample pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
    </div>
  );
};

export default Stocks;
