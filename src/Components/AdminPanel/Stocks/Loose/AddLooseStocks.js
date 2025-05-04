import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { storeloose_stock } from "../../../CrudOperations/PostOperation";
import { UpdateLooseStockData } from "../../../CrudOperations/Update&Edit";
import {
  getAllLooseStock,
  getAllLooseVariantsRegarding,
  getAllPurchase,
  getAllPurchaseItems,
  getAllStockItem,
  getAllUnit,
  GetwareHouses,
} from "../../../CrudOperations/GetOperation";

const AddLooseStocks = ({ closeModal, onSubmit, Brand, onUpdate }) => {
  const [purchase_id, setPurchaseId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paketings, setPacketing] = useState("");
  const [unit, setUnit] = useState("");
  const [unit_value, setUnitValue] = useState("");
  const [item_id, setitem_id] = useState("");
  const [purchase_item_id, setPurchase_item_id] = useState("");
  const [varientType, setVarientType] = useState("");
  const [varientId, setVarientId] = useState("");


  const [loosevarientId, setLooseVarientId] = useState("");
  const [parentloosevarientId, setParentLooseVarientId] = useState("");


  // setVarientId

  const [warehouse, setWarehouse] = useState("");

  // setVarientType



  const [AllStockList, setAllStockList] = useState([]);
  const [AllVariants, setAllVariants] = useState([]);

  const [PurchasedList, setPurchasedList] = useState([]);
  const [UnitList, setUnitList] = useState([]);
  const [warehouselist, setWarehouselist] = useState([]);
  const [FilterUnitList, setFilterUnitList] = useState([]);
  const [AvailableQuantity, setAvailableQuantity] = useState("");
  const [PurchasedListInvoice, setPurchasedListInvoice] = useState([]);

  useEffect(()=>{console.log(AvailableQuantity);
  },[AvailableQuantity])

  useEffect(() => {
    const fetchData = async () => {
      try {

        const allStocks = await getAllStockItem();
        const purchaseItemsResponse = await getAllPurchaseItems();
        const looseStocksResponse = await getAllLooseStock();
        const unitResponse = await getAllUnit();
        const warehouseResponse = await GetwareHouses();
        console.log(purchaseItemsResponse);
        console.log(looseStocksResponse);
        console.log(warehouseResponse);
        console.log(allStocks);


        
        

        if (Brand) {
          console.log(Brand);
          console.log(purchaseItemsResponse.data.data);
          // setPurchase_id(Brand.purchase_id);
          // setquantity(Brand.quantity);
          // setunit(Brand.si_units_id);
          // setPurchase_item_id(Brand.purchase_item_id);
          setPurchasedList(purchaseItemsResponse.data.data);
          console.log(purchase_id);
          const element = purchaseItemsResponse.data.data.find(
            (ele) => ele.id == purchase_id
          );
          console.log(element);
        } else {
          if (
            purchaseItemsResponse.data.message ===
            "All purchases Items retrieved successfully!"
          ) {
            console.log(looseStocksResponse);

            // const allItemspurchase = purchaseResponse.data.data.flatMap(
            //   (obj) => obj.items
            // );

            // console.log(looseStocksResponse);
            // console.log(allItemspurchase);

            // console.log(allItemspurchase);

            // const looseStocks = looseStocksResponse.data.data || [];
            // const filteredPurchasedList = allItemspurchase.filter(
            //   (purchase) =>
            //     !looseStocks.some(
            //       (packetStock) => packetStock.purchase_item_id === purchase.id
            //     ) // Adjust the condition based on your object structure
            // );
            // console.log(filteredPurchasedList);

            // const looseStocks = looseStocksResponse.data.data || [];
            // const filteredPurchasedList = purchaseResponse.data.data.filter(
            //   (purchase) =>
            //     !looseStocks.some(
            //       (looseStock) => looseStock.purchase_id === purchase.id
            //     )
            // );
            // console.log(filteredPurchasedList);

            setPurchasedListInvoice(purchaseItemsResponse.data.data);
            setPurchasedList(purchaseItemsResponse.data.data);
          }

          console.log(allStocks);
          if (allStocks.data.message === "Stock items retrieved successfully!") {
            console.log(allStocks);

            setAllStockList(allStocks.data.data.filter((ele)=>ele.varient_type == "loose"));
            
        
         
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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (Brand) {
  //     console.log(Brand);

  //     const fun = async () => {
  //       const purchaseResponse = await getAllStockItem();
  //       const unitResponse = await getAllUnit();

  //       console.log(unitResponse.data.data);

  //       console.log(Brand.item.si_units_id);

  //       setFilterUnitList(
  //         unitResponse.data.data.filter(
  //           (ele) => ele.parent_id == Brand.unit_id || ele.id == Brand.unit_id
  //         )
  //       );
  //       if (
  //         purchaseResponse.data.message === "Stockitems retrieved successfully!"
  //       ) {
  //         setPurchasedList(purchaseResponse.data.data);
  //         setUnit(Brand.item.si_units_id);
  //       }
  //     };

  //     fun();

  //     setAvailableQuantity(Brand.available + " " + Brand.unit_name);
  //     setPurchaseId(Brand.item.purchase_id);
  //     setPurchase_item_id(Brand.item.purchase_item_id);
  //     setQuantity(Number(Brand.item.quantity));
  //     setUnit(Brand.si_units_id);

  //     // setUnit(Brand.price);

  //     // setUnit(Brand.rate_per_unit);
  //   } else {
  //     setPurchaseId("");
  //     setQuantity("");
  //     setUnit("");
  //   }
  // }, [Brand]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(loosevarientId);
    console.log(parentloosevarientId);

    

    const formData = {
      purchase_item_id,
      quantity,
      unit,
      paketings,
      parentloosevarientId,
      warehouse,
      varientType : "loose",
      varientId : loosevarientId,
      item_id,
      unit_value:
        unit_value || FilterUnitList.find((ele) => ele.id == unit)?.value,
    };

    // 

    console.log(formData);


    console.log(typeof formData.unit_value);

    let response;
    if (Brand) {

      console.log(formData);
      
      response = await UpdateLooseStockData({ id: Brand.item.id, formData });
      if (response.data.message === "loose_stock updated successfully") {
        onUpdate(formData);
        toast.success(response.data.message);
      }
    } else {
      response = await storeloose_stock({ formData });
      
      if (response.data.message === "loose_stock saved successfully!") {
        console.log(response);
        
        onSubmit({ ...formData, id: response.data.data.id });
      }
      else{
        toast.error(response.data.message);
      }
    }
    closeModal();
  };

  const handleItemChange = async(e) => {
    const data = e.target.value;
    console.log(data);

    setPurchase_item_id(data)


    const purchaseId = AllStockList.find((ele) =>
      ele.id == data
    );

    setParentLooseVarientId(purchaseId.loose_varient_id)

    console.log(purchaseId);

    setitem_id(purchaseId?.item_id)
    
    let variantId = null;



    if(purchaseId.varient_type == "packet"){

      setVarientType(purchaseId.varient_type)
      setVarientId(purchaseId.packet_varient_id)

    }
    else if(purchaseId.varient_type == "loose"){

      setVarientType(purchaseId.varient_type)
      setVarientId(purchaseId.loose_varient_id)

      variantId = purchaseId.loose_varient_id;

    }



    

    const AvailableQuantityy = purchaseId.AvailableQuantity + " " + purchaseId.unit_name


    setAvailableQuantity(AvailableQuantityy )



      setFilterUnitList(
            UnitList.filter(
              (ele) =>
                ele.parent_id == purchaseId.unit_Id ||
                ele.id == purchaseId.unit_Id
            )
          );


          const response = await getAllLooseVariantsRegarding(variantId);
          console.log(response);


          setAllVariants(response.data.data);
          




    
  };



  const handleLooseVarientChange = (e) => {
    const data = e.target.value;
    console.log(data);





    if(quantity && unit){


      const filterNewUnit = FilterUnitList.find((ele) => ele.id == unit);
      console.log(filterNewUnit);
  
        const looseVarient = AllVariants.find((ele) => ele.id == data);
  
      const LooseVariantUnit_id = UnitList.find( (ele) => ele.id == looseVarient.unit_id)
  
      const newQuantity_for_packeting = looseVarient?.quantity * filterNewUnit?.value / LooseVariantUnit_id?.value
  
  
  
  
        setPacketing(quantity/newQuantity_for_packeting)
        setLooseVarientId(data);
  
  
      }
      else{

        setLooseVarientId(data);

      }














  };


  const handleTransferQuantity = (e) => {
    const data = e.target.value;
    console.log(data);



     if(loosevarientId && unit){


      const filterNewUnit = FilterUnitList.find((ele) => ele.id == unit);
      console.log(filterNewUnit);
  
        const looseVarient = AllVariants.find((ele) => ele.id == loosevarientId);
  
      const LooseVariantUnit_id = UnitList.find( (ele) => ele.id == looseVarient.unit_id)
  
      const newQuantity_for_packeting = looseVarient?.quantity * filterNewUnit?.value / LooseVariantUnit_id?.value
  
  
  
  
        setPacketing(data/newQuantity_for_packeting)
        setQuantity(Number(data))
  
  
      }
      else{

        setQuantity(Number(data))

      }



  };



  const handleQuantityunit = (e) => {
    const data = e.target.value;
    console.log(data);




    if(quantity && loosevarientId){


    const filterNewUnit = FilterUnitList.find((ele) => ele.id == data);
    console.log(filterNewUnit);

      const looseVarient = AllVariants.find((ele) => ele.id == loosevarientId);

    const LooseVariantUnit_id = UnitList.find( (ele) => ele.id == looseVarient.unit_id)

    const newQuantity_for_packeting = looseVarient?.quantity * filterNewUnit?.value / LooseVariantUnit_id?.value




      setUnit(Number(data)) 
      setPacketing(quantity/newQuantity_for_packeting)


    }




  };

  // const handleRefresh = async () => {
  //   const purchaseResponse = await getAllPurchase();
  //   const unitResponse = await getAllUnit();

  //   const element = purchaseResponse.data.data.find(
  //     (ele) => ele.id == purchase_id
  //   );

  //   const filterunit = unitResponse.data.data.find(
  //     (unitItem) => unitItem.id === unit
  //   );

  //   console.log(filterunit);

  //   if (filterunit.parent_id) {
  //     console.log("chalalfd");

  //     const datafileter = unitResponse.data.data.filter(
  //       (unitItems) => unitItems.parent_id == filterunit.id
  //     );

  //     setFilterUnitList(datafileter);
  //   } else {

  //     const datafileter = unitResponse.data.data.filter(
  //       (unitItems) =>
  //         unitItems.parent_id == filterunit.id || unitItems.id == filterunit.id
  //     );

  //     setFilterUnitList(datafileter);
  //   }

  //   setAvailableQuantity(element.AvailableQuantity + " " + element.unit);
  // };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg p-4 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-3">
          {Brand ? "Edit Loose Stock" : "Add Loose Stock"}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700">Stock Items</label>
            <select
              disabled={Brand}
              value={purchase_item_id}
              onChange={handleItemChange}
              className="border border-black p-1 w-full rounded-md"
            >

              {console.log(AllStockList)
              }
              
              <option value="">Select Item</option>
              {AllStockList.map((option) => (
                <option key={option.id} value={option.id}>
                 
                  {option.packetvariantName || option.loosevariantName}
                </option>
              ))}
            </select>
          </div>


          <div className="mb-2">
              <label className="block text-gray-700">Available</label>
            <input
              type="text"
              value={AvailableQuantity}
              className="border border-gray-300 p-1 w-full rounded-md"
              disabled
            />
          </div>


          <div className="mb-2">
            <label className="block text-gray-700">Variant</label>
            <select
              disabled={Brand}
              value={loosevarientId}
              onChange={handleLooseVarientChange}
              className="border border-black p-1 w-full rounded-md"
            >
              
              <option value="">Select Variant</option>
              {AllVariants.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.variantName}
                </option>
              ))}
            </select>
          </div>



          <div className="mb-2">
            <label className="block text-gray-700">Transfer Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={handleTransferQuantity}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>




          <div className="mb-2">
            <label className="block text-gray-700">Unit</label>
            <select
              value={unit}
              onChange={ handleQuantityunit}
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
            <label className="block text-gray-700">Packet Created</label>
            <input
                        disabled
              type="number"
              value={paketings}
              onChange={(e) => setPacketing(Number(e.target.value))}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>


          <div className="mb-2">
            <label className="block text-gray-700">Warehouse</label>
            <select
              disabled={Brand}
              value={warehouse}
              onChange={(e)=>setWarehouse(e.target.value)}
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

export default AddLooseStocks;
