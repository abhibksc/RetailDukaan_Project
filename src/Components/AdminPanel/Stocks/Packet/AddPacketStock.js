import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { storepacketStock } from "../../../CrudOperations/PostOperation";
import { UpdatePacketStockData } from "../../../CrudOperations/Update&Edit";
import {
  getAll__Unique_purchased_packet_item,
  getAllLooseStock,
  getAllPacketStock,
  getAllPurchase,
  getAllPurchaseItems,
  getAllStockItem,
  getAllUnit,
  GetwareHouses,
} from "../../../CrudOperations/GetOperation";
import { log } from "tone/build/esm/core/util/Debug";

const AddPacketStock = ({
  closeModal,
  onSubmit,
  LooseStockList,
  EditPacket_Stock,
  onUpdate,
}) => {
  EditPacket_Stock;

  const [mrp, setMrp] = useState("");
  const [skuId, setSkuId] = useState("");
  const [purchase_id, setPurchase_id] = useState("");
  const [purchase_item_id, setPurchase_item_id] = useState("");
  const [item_id, setItem_id] = useState("");
  const [quantity, setquantity] = useState("");
  const [unit, setunit] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [varientType, setVarientType] = useState("");
  const [varientId, setVarientId] = useState("");

  const [PurchasedList, setPurchasedList] = useState([]);
  const [PurchasedListInvoice, setPurchasedListInvoice] = useState([]);
  const [warehouselist, setWarehouselist] = useState([]);

  const [UnitList, setUnitList] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [AvailableQuantity, setAvailableQuantity] = useState("");
  const [AvailableQuantityInInteger, setAvailableQuantityInInteger] =
    useState("");
  const [FilterUnitList, setFilterUnitList] = useState([]);
  const [selectedVariantJson, setSelectedVariantJson] = useState("");

  const [AllStockList, setAllStockList] = useState([]);
  const [itemAleradyExists, setItemAleradyExists] = useState(false);

  const RunIt = async () => {
    try {
      const getAllPacketStockresponse =
        await getAll__Unique_purchased_packet_item();

      const allStocks = await getAllStockItem();
      const purchaseItemsResponse = await getAllPurchaseItems();
      const looseStocksResponse = await getAllLooseStock();
      const unitResponse = await getAllUnit();
      const warehouseResponse = await GetwareHouses();

      allStocks;

      if (EditPacket_Stock) {
        setPurchasedList(purchaseItemsResponse.data.data);
        const element = purchaseItemsResponse.data.data.find(
          (ele) => ele.id == purchase_id
        );
      } else {
        getAllPacketStockresponse;
        if (
          purchaseItemsResponse.data.message ===
          "All purchases Items retrieved successfully!"
        ) {
          allStocks;

          setPurchasedListInvoice(purchaseItemsResponse.data.data);
          setPurchasedList(purchaseItemsResponse.data.data);
        }

        if (allStocks.data.message == "Stock items retrieved successfully!") {
          allStocks;

          getAllPacketStockresponse;

          if (
            getAllPacketStockresponse.data.message ===
            "Unique packet variant purchase items with quantity"
          ) {
            const packetData = getAllPacketStockresponse.data.data;
            setAllStockList(packetData);
          } else if (
            getAllPacketStockresponse.data.message ===
            "No packet_stock records found"
          ) {
            setAllStockList(allStocks.data.data);
          }
        }

        if (warehouseResponse) {
          setWarehouselist(warehouseResponse.data);
        }
      }

      // setPurchasedList(purchaseResponse.data.data);

      if (unitResponse.data.message === "All unit retrieved successfully!") {
        setUnitList(unitResponse.data.data);
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getAllPacketStockresponse =
          await getAll__Unique_purchased_packet_item();

        const allStocks = await getAllStockItem();
        const purchaseItemsResponse = await getAllPurchaseItems();
        const looseStocksResponse = await getAllLooseStock();
        const unitResponse = await getAllUnit();
        const warehouseResponse = await GetwareHouses();

        if (
          purchaseItemsResponse.data.message ===
          "All purchases Items retrieved successfully!"
        ) {
          setPurchasedListInvoice(purchaseItemsResponse.data.data);
          setPurchasedList(purchaseItemsResponse.data.data);
        }

        if (allStocks.data.message == "Stock items retrieved successfully!") {
          if (
            getAllPacketStockresponse.data.message ===
            "Unique packet variant purchase items with quantity"
          ) {
            const packetData = getAllPacketStockresponse.data.data;
            setAllStockList(packetData);
          } else if (
            getAllPacketStockresponse.data.message ===
            "No packet_stock records found"
          ) {
            setAllStockList(allStocks.data.data);
          }
        }

        if (warehouseResponse) {
          setWarehouselist(warehouseResponse.data);
        }

        // setPurchasedList(purchaseResponse.data.data);

        if (unitResponse.data.message === "All unit retrieved successfully!") {
          setUnitList(unitResponse.data.data);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(varientId);
  }, [varientId]);

  useEffect(() => {
    if (EditPacket_Stock) {
      console.log(EditPacket_Stock);

      RunIt();

      const autoSelect = async () => {
        const item = AllStockList.find(
          (ele) => ele.packet_varient_id === EditPacket_Stock.packet_varient_id
        );
        console.log("Matched Edit Packet Variant:", item);
        if (item) {
          setItemThings(item.packet_varient_id);
        }

        setWarehouse(EditPacket_Stock.warehouse_id);
      };

      autoSelect();
    } else {
      setPurchase_id("");
      setquantity("");
      setunit("");
    }
  }, [EditPacket_Stock, AllStockList]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    item_id;

    const formData = {
      varientType,
      varientId,
      purchase_item_id,
      item_id,
      quantity,
      unit,
      warehouse,
      unit_value: FilterUnitList.find((ele) => ele.id == unit)?.value,
    };
    formData;

    let response;
    if (EditPacket_Stock) {
      formData;

      response = await UpdatePacketStockData({
        id: EditPacket_Stock.item.id,
        formData,
      });
      if (response.data.message === "packet_stock updated successfully") {
        onUpdate(formData);
        toast.success(response.data.message);
      }
    } else {
      response = await storepacketStock({ formData });
      console.log(response);

      if (
        response?.data?.message === "Packet stock updated successfully." ||
        response?.data?.message === "Packet stock inserted successfully." ||

                response?.data?.message === "Packet stock replaced and updated successfully."
      ) {
        console.log(response);
              toast.success(response?.data?.message);
        onSubmit(formData);
      } else {
        toast.error(response.data.message);
      }
    }
    closeModal();
  };

  const setItemThings = (data) => {
    const purchaseId = AllStockList.find(
      (ele) => ele.packet_varient_id == data
    );
    setSelectedItem(purchaseId);

    if (!purchaseId) {
      toast.error("error on selecting..");
      return;
    }
    setVarientId(data);
    setPurchase_item_id(purchaseId.example_purchase_item_id);

    setAvailableQuantityInInteger(purchaseId.available_quantity);
    setAvailableQuantity(
      purchaseId.available_quantity.toString() + " " + purchaseId.unit
    );

    if (purchaseId) {
      // setItem_id(purchaseId.item_id)

      if (purchaseId.varient_type == "packet") {
        setVarientType(purchaseId.varient_type);
        setVarientId(purchaseId.packet_varient_id);
      } else if (purchaseId.varient_type == "loose") {
        setVarientType(purchaseId.varient_type);
        setVarientId(purchaseId.loose_varient_id);
      }

      setFilterUnitList(
        UnitList.filter(
          (ele) =>
            ele.parent_id == purchaseId.unit_id || ele.id == purchaseId.unit_id
        )
      );
    }
  };

  const handleItemChange = (e) => {
    const value = e.target.value;
    setSelectedVariantJson(value); // this will reflect correctly in <select>

    const selected = JSON.parse(value);
    const { variantId, purchaseItemId } = selected;

    const selectedItem = AllStockList.find(
      (item) =>
        item.packet_varient_id == variantId &&
        item.example_purchase_item_id == purchaseItemId
    );

    console.log(selectedItem);

    if (!selectedItem) {
      toast.error("Item not found for selected variant and purchase ID");
      return;
    }

    setSelectedItem(selectedItem);
    setVarientId(variantId); // you can still store this if needed elsewhere
    setPurchase_item_id(purchaseItemId);
    setAvailableQuantityInInteger(selectedItem.available_quantity);
    setAvailableQuantity(
      selectedItem.available_quantity + " " + selectedItem.unit
    );

    setMrp(selectedItem.mrp);
    setSkuId(selectedItem.sku_id);

    // setSkuId

    setVarientType(selectedItem.varient_type);
    setFilterUnitList(
      UnitList.filter(
        (ele) =>
          ele.parent_id == selectedItem.unit_id ||
          ele.id == selectedItem.unit_id
      )
    );
  };

  const handlePurchase = (e) => {
    // Extract the selected item ID from the event
    const selectedItemId = e.target.value;

    selectedItemId;
    setPurchase_item_id(Number(selectedItemId));

    // // Find the invoice that contains the selected item ID
    const purchaseInvoice = PurchasedListInvoice.find((invoice) =>
      invoice.items.some((item) => item.id == selectedItemId)
    );
    purchaseInvoice;

    setPurchase_id(Number(purchaseInvoice.id));

    // // Log the found purchase invoice
    //  (purchaseInvoice);

    // // Update the state with the selected item ID
    // // setPurchase_item_id(selectedItemId);

    // // Update the state with the found purchase invoice
    // setPurchase_id(purchaseInvoice);
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    "Checkbox is " + (e.target.checked ? "checked" : "unchecked");

    if (!e.target.checked) {
      setunit("");
      setquantity("");
    }

    if (e.target.checked) {
      setquantity(AvailableQuantityInInteger);
      setunit(selectedItem.unit_id);
    }
  };

  const itemMap = useMemo(() => {
    const map = {};
    AllStockList.forEach((item) => {
      map[item.packet_varient_id] = item;
    });
    return map;
  }, [AllStockList]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 ${"block"}`}
    >
      <div className="bg-white rounded-lg p-4 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-3">
          {EditPacket_Stock ? "Edit Packet Stock" : "Add Packet Stock"}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700">Items</label>
            <select
              value={selectedVariantJson}
              onChange={handleItemChange}
              className="border border-black p-1 w-full rounded-md"
            >
              <option value="">Select Item</option>
              {AllStockList.map((option) => (
                <option
                  key={option.example_purchase_item_id}
                  value={JSON.stringify({
                    variantId: option.packet_varient_id,
                    purchaseItemId: option.example_purchase_item_id,
                  })}
                >
                  {option?.ItemName} ({option?.brand_name}) (
                  {option?.packetvariantName} {option?.sku_id}) (
                  {option?.available_quantity} {option?.unit} Avl.)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <div className="flex gap-2">
              <label className="block text-gray-700">SKU Id</label>
            </div>
            <input
              type="text"
              value={skuId}
              className="border border-gray-300 p-1 w-full rounded-md"
              disabled
            />
          </div>

          <div className="mb-2">
            <div className="flex gap-2">
              <label className="block text-gray-700">MRP</label>
            </div>
            <input
              type="text"
              value={mrp}
              className="border border-gray-300 p-1 w-full rounded-md"
              disabled
            />
          </div>

          <div className="mb-2">
            <div className="flex gap-2">
              <label className="block text-gray-700">Available</label>
            </div>
            <input
              type="text"
              value={AvailableQuantity}
              className="border border-gray-300 p-1 w-full rounded-md"
              disabled
            />
          </div>

          <div className="mb-2">
            <div className="flex gap-2">
              <label className="block text-gray-700">Quantity</label>
              <label className="flex gap-1 text-sm mt-1">
                <span>All</span>

                <span>
                  <input type="checkbox" onChange={handleCheckboxChange} />
                </span>
              </label>
            </div>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setquantity(Number(e.target.value))}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Unit</label>
            <select
              value={unit}
              onChange={(e) => setunit(Number(e.target.value))}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              <option value="">Select Unit</option>
              {FilterUnitList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Warehouse</label>
            <select
              disabled={EditPacket_Stock}
              value={warehouse}
              onChange={(e) => setWarehouse(Number(e.target.value))}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              <option value="">Select warehouse</option>
              {warehouselist.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.warehouse_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 px-3 py-1 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              {EditPacket_Stock ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPacketStock;
