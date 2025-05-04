import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { storepacketStock } from "../../../CrudOperations/PostOperation";
import { UpdatePacketStockData } from "../../../CrudOperations/Update&Edit";
import {
  getAllLooseStock,
  getAllPacketStock,
  getAllPurchase,
  getAllPurchaseItems,
  getAllStockItem,
  getAllUnit,
  GetwareHouses,
} from "../../../CrudOperations/GetOperation";
import { log } from "tone/build/esm/core/util/Debug";

const AddPacketStock = ({ closeModal, onSubmit,LooseStockList, Brand, onUpdate }) => {
  console.log(closeModal);
  console.log(onSubmit);
  console.log(Brand);

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
  const [AvailableQuantity, setAvailableQuantity] = useState("");
  const [AvailableQuantityInInteger, setAvailableQuantityInInteger] = useState("");
  const [FilterUnitList, setFilterUnitList] = useState([]);

  const [AllStockList, setAllStockList] = useState([]);
    const [itemAleradyExists, setItemAleradyExists] = useState(false);
  

  

  useEffect(() => {
    const fetchData = async () => {
      try {

          const getAllPacketStockresponse = await getAllPacketStock();
           

        const allStocks = await getAllStockItem();
        const purchaseItemsResponse = await getAllPurchaseItems();
        const looseStocksResponse = await getAllLooseStock();
        const unitResponse = await getAllUnit();
        const warehouseResponse = await GetwareHouses();

        console.log(allStocks);

        if (Brand) {





          setPurchasedList(purchaseItemsResponse.data.data);
          const element = purchaseItemsResponse.data.data.find(
            (ele) => ele.id == purchase_id
          );
        } else {

          console.log(allStocks);
          if (
            purchaseItemsResponse.data.message ===
            "All purchases Items retrieved successfully!"
          ) {

            console.log(allStocks);


            setPurchasedListInvoice(purchaseItemsResponse.data.data);
            setPurchasedList(purchaseItemsResponse.data.data);
          }

          if (allStocks.data.message == "Stock items retrieved successfully!") {
            console.log(allStocks);

            console.log(getAllPacketStockresponse);


            if (getAllPacketStockresponse.data.message === "All packet_stock retrieved successfully!") {
           const packetData = getAllPacketStockresponse.data.data;
           const AllStock = allStocks.data.data;

           console.log(allStocks);

           if (AllStock.length > 0 && AllStock.find(ele => ele.varient_type == "packet")) {

            console.log(allStocks);
            // Filter AllStock to include only items with no matching id in packetData
            const filteredStock = AllStock.filter(
              (stockItem) => !packetData.some((packet) => packet.purchase_item_id === stockItem.id) && stockItem.varient_type !== "loose"
            );

            console.log(filteredStock);
            

          
            // Set the filtered list to your state
            setAllStockList(filteredStock);


          }
           




            }
            else  if (getAllPacketStockresponse.data.message === "No packet_stock records found"){
              setAllStockList(allStocks.data.data);
            }




            
        
         
          }

          if(warehouseResponse){

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

    fetchData();
  }, []);

  // const [purchase_id , setPurchase_id ] = useState("");
  // const [quantity, setquantity] = useState("");
  // const [unit, setunit] = useState("");

  // Populate fields if a Brand is being edited
  useEffect(() => {
    if (Brand) {

      const fun = async () => {
        const purchaseResponse = await getAllStockItem();
        const unitResponse = await getAllUnit();


        setFilterUnitList(
          unitResponse.data.data.filter(
            (ele) => ele.parent_id == Brand.unit_id || ele.id == Brand.unit_id
          )
        );
        if (
          purchaseResponse.data.message === "Stockitems retrieved successfully!"
        ) {
          setPurchasedList(purchaseResponse.data.data);
          setunit(Brand.item.si_units_id);
        }
      };

      fun();

      setAvailableQuantity(Brand.available + " " + Brand.unit_name);
      setPurchase_id(Brand.item.purchase_id);
      setPurchase_item_id(Brand.item.purchase_item_id);
      setquantity(Number(Brand.item.quantity));
      setunit(Brand.si_units_id);

      // setUnit(Brand.price);

      // setUnit(Brand.rate_per_unit);
    } else {
      setPurchase_id("");
      setquantity("");
      setunit("");
    }
  }, [Brand]);

  const handleFormSubmit = async (e) => { 
    e.preventDefault();



    console.log(item_id);

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
    console.log(formData);



    let response;
    if (Brand) {

      console.log(formData);
      
      response = await UpdatePacketStockData({ id: Brand.item.id, formData });
      if (response.data.message === "packet_stock updated successfully") {
        onUpdate(formData);
        toast.success(response.data.message);

      }

    } else {
      response = await storepacketStock({ formData });
      console.log(response);
      
      if (response.data.message === "packet_stock saved successfully!") {
        onSubmit({ ...formData, id: response.data.data.id });
      }
      else{
        toast.error(response.data.message);
      }
    }
    closeModal();
  };

  const handleItemChange = (e) => {


    
    const data = e.target.value;





      
      // Check for duplicates
      const isDuplicate = LooseStockList.some((ele) => {
          return ele.purchase_item_id == data;
      });
      
      if (isDuplicate) {
        setItemAleradyExists(true);
          return toast.warn("Selected Varient Already Added");
      }

    





    setPurchase_item_id(data)





    const purchaseId = AllStockList.find((ele) =>
      ele.id == data
    );

   if(purchaseId){

    

    setItem_id(purchaseId.item_id)


    if(purchaseId.varient_type == "packet"){

      setVarientType(purchaseId.varient_type)
      setVarientId(purchaseId.packet_varient_id)

    }
    else if(purchaseId.varient_type == "loose"){

      setVarientType(purchaseId.varient_type)
      setVarientId(purchaseId.loose_varient_id)

    }



    

    const AvailableQuantityy = purchaseId.AvailableQuantity + " " + purchaseId.unit_name

    setAvailableQuantityInInteger(purchaseId.AvailableQuantity)
    setAvailableQuantity(AvailableQuantityy )



      setFilterUnitList(
            UnitList.filter(
              (ele) =>
                ele.parent_id == purchaseId.unit_Id ||
                ele.id == purchaseId.unit_Id
            )
          );




   }

  };

  const handlePurchase = (e) => {
    // Extract the selected item ID from the event
    const selectedItemId = e.target.value;

    console.log(selectedItemId);
     setPurchase_item_id(Number(selectedItemId));
    
  
    // // Find the invoice that contains the selected item ID
    const purchaseInvoice = PurchasedListInvoice.find(invoice =>
      invoice.items.some(item => item.id == selectedItemId)
    );
    console.log(purchaseInvoice);
    

    setPurchase_id(Number(purchaseInvoice.id));
  
    // // Log the found purchase invoice
    // console.log(purchaseInvoice);
  
    // // Update the state with the selected item ID
    // // setPurchase_item_id(selectedItemId);
  
    // // Update the state with the found purchase invoice
    // setPurchase_id(purchaseInvoice);
  };


  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    console.log("Checkbox is " + (e.target.checked ? "checked" : "unchecked"));

if(e.target.checked) setquantity(AvailableQuantityInInteger)
  if(!e.target.checked) setquantity("")


  };
  

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 ${"block"}`}
    >
      <div className="bg-white rounded-lg p-4 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-3">
          {Brand ? "Edit Packet Stock" : "Add Packet Stock"}
        </h2>
        <form onSubmit={handleFormSubmit}>
        <div className="mb-2">
            <label className="block text-gray-700">Items</label>
            <select
              disabled={Brand}
              value={purchase_item_id}
              onChange={handleItemChange}
              className="border border-black p-1 w-full rounded-md"
            >
              
              <option value="">Select Item</option>
              {AllStockList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.packetvariantName || option.loosevariantName}
                </option>
              ))}
            </select>
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

<span><input type="checkbox"      onChange={handleCheckboxChange}  /></span>
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
              disabled={Brand}
              value={warehouse}
              onChange={(e)=>setWarehouse(Number(e.target.value))}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              <option value="">Select warehouse</option>
              {console.log(PurchasedList)}
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
              {Brand ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPacketStock;
