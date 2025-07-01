import { useEffect, useState } from "react";
import { GetAllVarients } from "../../../CrudOperations/GetOperation";

const ItemSearchBar = ({ onclose, onChange }) => {
  const [itemList, setItemList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const [itemResponse] = await Promise.all([GetAllVarients()]);

      if (itemResponse.data.message === "All variants successfully retrieved") {
        setItemList(itemResponse.data.items);
        setFilteredItems(itemResponse.data.items); // Set default view
      }
    };

    fetchItems();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = itemList.filter((item) =>
      item?.ItemName
        ? item.ItemName?.toLowerCase().includes(query.toLowerCase())
        : item?.variantName &&
          item.variantName?.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handleSelect = (item) => {
    const valuew = JSON.stringify({
  ItemName: item.ItemName,
                    sku_id: item.sku_id,
                    variantName: item.variantName,
                    variant_id: item.variant_id,
                    varient_type: item.varient_type,
                    item_id: item.item_id,
    });

    let e = {
      target: {
        name: "selectedItem",
        value: valuew,
      },
    };
    onChange(e);

    let { name, value } = e.target;
    console.log(name);
    console.log(value);

    onclose(); // Optional: close modal after select
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative">
        <button
          onClick={onclose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          ✖
        </button>
        <h3 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Search Item
        </h3>

        <input
          type="text"
          placeholder="Search by item name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                name="selectedItem"
                key={item.variant_id + index}
                value={item.item_id}
                className="border p-4 rounded-lg hover:bg-green-100 cursor-pointer transition"
                onClick={() => handleSelect(item)}
              >
                <h4 className="text-md font-medium text-gray-800">
                  {item?.ItemName || item?.variantName || "N/A"}
                </h4>
                <p className="text-sm text-gray-600">
                  {item?.brand_name || "No brand_name"}
                </p>
                <p className="text-sm text-gray-700">
                  {item?.sku_id || "No sku_id"}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No items found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemSearchBar;
