import { useEffect, useState } from "react";
import {
  getAllGST,
  getAllUnit,
  GetAllVarients,
} from "../../../CrudOperations/GetOperation";
import ItemSearchBar from "./ItemSearchBar";

const PurchaseItemForm = ({ items, handleItemChange, addItems }) => {
  const [loading, setLoading] = useState(false);
  const [openItemSearchBar, setIsOpenItemSearchBar] = useState(false);

  const [ItemList, setItemList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [gstList, setGSTList] = useState([]);

  const [filterItems, setFilterItems] = useState([]);

  useEffect(() => {
    const fun = async () => {
      setLoading(true);
      const [itemResponse, unitResponse, gstResponse] = await Promise.all([
        GetAllVarients(),
        getAllUnit(),
        getAllGST(),
      ]);

      console.log(itemResponse);

      if (itemResponse.data.message === "All variants successfully retrieved") {
        setItemList(itemResponse.data.items);
        setFilterItems(itemResponse.data.items);
      }

      if (
        unitResponse.data &&
        unitResponse.data.message == "All unit retrieved successfully!"
      ) {
        console.log(unitResponse);
        setUnitList(unitResponse.data.data);
      }

      if (
        gstResponse.data &&
        gstResponse.data.message == "All gst retrieved successfully!"
      ) {
        console.log(gstResponse);
        setGSTList(gstResponse.data.data);
      }

      setLoading(false);
    };

    fun();
  }, []);

  // const handleSearchItem = ()=>{

  //   IsOpenItemSearchBar(true);

  // }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="border-b p-5">
      {/* Purchase Medicine Form */}
      <h3 className="text-lg font-semibold mb-2 ">Purchase Item</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="mb-2">
          <div className="flex justify-between">
            <label className="block text-gray-700">Select Variant *</label>

            <div
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={() => setIsOpenItemSearchBar(true)}
            >
              find items
            </div>
          </div>

          <div className="relative">
            <select
              required
              name="selectedItem"
              value={items.item_id}
              onChange={handleItemChange}
              className="border border-gray-300 p-2 w-full rounded-md overflow-y-auto max-h-48"
            >
              <option value="">
                {/* {items.ItemName || items.variantName || "Select Variant"} */}
                {items?.sku_id && items?.ItemName && items?.variantName
                  ? `(${items.sku_id}) ${items.ItemName} ${items.variantName}`
                  : "Select Variant"}
              </option>
              {filterItems.map((option) => (
                <option
                  key={option.variant_id}
                  value={JSON.stringify({
                    ItemName: option.ItemName,
                    sku_id: option.sku_id,
                    variantName: option.variantName,
                    variant_id: option.variant_id,
                    varient_type: option.varient_type,
                    item_id: option.item_id,
                  })}
                >
                  {option.sku_id} {option.ItemName} {option.brand_name}{" "}
                  {option.variantName} ({option.varient_type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>
          Batch No.
          <input
            type="text"
            placeholder="Batch No."
            name="batchNo"
            value={items.batchNo}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="relative w-full block">
          HSN *
          <input
            required
            type="text"
            // placeholder="HSN"
            name="HSN"
            value={items.HSN}
            onChange={handleItemChange}
            className={`w-full px-8 p-2 border rounded ${"bg-white"}`}
          />
        </label>

        <label>
          Manufacture Date *
          <input
            required
            type="date"
            placeholder="mfgDate"
            name="mfgDate"
            value={items.mfgDate}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label>
          Expiry Date *
          <input
            required
            type="date"
            placeholder="expiryDate"
            name="expiryDate"
            value={items.expiryDate}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label>
          Qty/Packet *
          <input
            type="text"
            placeholder="example :- 1kg, 1Liter etc."
            name="quantity_perPacket"
            value={items.quantity_perPacket}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label>
          Qty *
          <input
            type="number"
            placeholder="Qty"
            name="quantity"
            value={items.quantity}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label>
          Select Unit *
          <select
            name="unit_Id"
            value={items.unit_Id}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">--Select Unit--</option>
            {unitList.map((supplier, index) => (
              <option key={index} value={supplier.id}>
                {supplier.unit}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select GST *
          <select
            name="gstRate_Id"
            value={items.gstRate_Id}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">--Select GST--</option>
            {gstList.map((supplier, index) => (
              <option key={index} value={supplier.id}>
                {supplier.gst_title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cost Price per {items.unitName} *
          <input
            type="number"
            // placeholder="cost_per_unit"
            name="cost_per_unit"
            value={items.cost_per_unit}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label>
          MRP *
          <input
            required
            type="number"
            placeholder="MRP"
            name="mrp"
            value={items.mrp}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
          />
        </label>

        {/* <label>
Discount % in MRP
            <input
              type="number"
              name="sellingPrice"
              value={items.sellingPrice}
              onChange={handleItemChange}
              className="w-full p-2 border rounded"
              required
            />
          </label> */}

        <label>
          Selling Price per *
          <input
            type="number"
            name="sellingPrice"
            value={items.sellingPrice}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label>
          Total Cost *
          <input
            required
            type="number"
            placeholder="Cost Price"
            disabled
            name="totalCost"
            value={items.totalCost}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label>
          Discount %
          <input
            type="number"
            placeholder="Discount %"
            name="discountPercent"
            value={items.discountPercent}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label>
          Discount ₹
          <input
            type="number"
            name="discount"
            value={items.discount}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
            disabled
          />
        </label>

        <label>
          Line Total *
          <input
            required
            type="number"
            name="lineAmount"
            disabled
            value={items.lineAmount}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
          />
        </label>
      </div>

      <button
        onClick={addItems}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
      >
        Add Item
      </button>

      {
        openItemSearchBar && (
          <div>
            {console.log(openItemSearchBar)}
            <ItemSearchBar
              onclose={() => setIsOpenItemSearchBar(false)}
              onChange={handleItemChange}
            />
          </div>
        )

        // handleItemChange
      }
    </div>
  );
};

export default PurchaseItemForm;
