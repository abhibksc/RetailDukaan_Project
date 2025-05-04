import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  GetAllCreatedItems,
  getAllLooseVarient,
  getAllLooseVarientForCreatingOFFER,
  GetAllOffers,
  getAllPacketStock,
  getAllPacketVarientForCreatingOFFER,
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../CrudOperations/GetOperation";
import { CreateOffer } from "../../CrudOperations/PostOperation";
import * as Tone from 'tone';
import { useNavigate } from "react-router-dom";

const AddOffers = () => {
  const [item_id, setItem_Id] = useState("");
  const [looseVariantId, setLooseVariantId] = useState("");
  const [PacketVariantId, setPacketVariantId] = useState("");


  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [unit_value, setUnitValue] = useState("");
  const [purchase_item_id, setPurchase_item_id] = useState("");
  const [category_id, setCategoryId] = useState("");

  const [PostedDate, setPostedDate] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const [offerName, setOfferName] = useState("");
  const [OfferPercentValue, setOfferPercentValue] = useState("");

  //   const [PostedDate, setPostedDate] = useState("");
  //   const [PostedDate, setPostedDate] = useState("");

  //   PostedDate

  const [Status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const Navigate = useNavigate();


  //   const [category_id, setCategoryId] = useState("");
  const [subCategory_id, setSubCategoryId] = useState("");
  const [sub_subCategory_id, setSub_SubCategoryId] = useState("");

  const [PurchasedList, setPurchasedList] = useState([]);
  const [UnitList, setUnitList] = useState([]);
  const [FilterUnitList, setFilterUnitList] = useState([]);
  const [AvailableQuantity, setAvailableQuantity] = useState("");
  const [PurchasedListInvoice, setPurchasedListInvoice] = useState([]);

  const [CategoryList, setCategoryList] = useState([]);
  const [SubCategoryList, setSubCategoryList] = useState([]);
  const [Sub_SubCategoryList, setSub_SubCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ItemList, setItemList] = useState([]);

  const [LooseVariantList, setLooseVarientList] = useState([]);
  const [PacketVariantList, setPacketVarientList] = useState([]);


  const [OfferList, setOfferList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allOffer,items, Category, Sub_Category, Sub_subCategory , looseVariant, packetVarient] =
          await Promise.all([
            GetAllOffers(),
            GetAllCreatedItems(),
            Show_Users_MainCategory(),
            Show_users_SubCategory(),
            Show_Users_Sub_SubCategory(),
            getAllLooseVarientForCreatingOFFER(),
            getAllPacketVarientForCreatingOFFER()
          ]);
        console.log(looseVariant);
        console.log(packetVarient);




        if (allOffer.data.message === "All Offer retrieved successfully!"){
            setOfferList(items.data.data);
        }
        if (items.data.message === "All Items retrieved successfully!"){
            setItemList(items.data.data);
        }

        if(looseVariant.data.message === "LooseVarientForCreatingOFFER retrieved successfully!"){
          setLooseVarientList(looseVariant.data.data);


        }


        if(packetVarient.data.message === "PacketVarientForCreatingOFFER retrieved successfully!"){

          setPacketVarientList(packetVarient.data.data);



        }



        
        if (Category?.data) setCategoryList(Category.data);
        if (Sub_Category?.data) setSubCategoryList(Sub_Category.data);
        if (Sub_subCategory?.data) setSub_SubCategoryList(Sub_subCategory.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // const filterUnit = FilterUnitList.find((ele)=>ele.id === )
    const formDataa = {
        PostedDate,
        offerName,
        OfferPercentValue,
        category_id ,
        subCategory_id ,
        sub_subCategory_id ,
        item_id ,
        startDate,
        endDate,
        Status,
        looseVariantId,
        PacketVariantId
    };
    console.log(formDataa);
     const response = await CreateOffer({ formDataa });
     console.log(response);
      if (response && response.data.message === "Offer saved successfully!") {



        const Merchanttoken = localStorage.getItem("Merchanttoken");




        // Navigate(`/admin/${Merchanttoken}/ManageOffer`);















        setCategoryId("") ,
        setSubCategoryId("") ,
        setSub_SubCategoryId("") ,
        setItem_Id("") ,

        setLooseVariantId("")
        setPacketVariantId("")

        toast.success(response.data.message)
        const synth = new Tone.Synth().toDestination();
        await Tone.start(); // Required to unlock audio context in modern browsers
        synth.triggerAttackRelease("C4", "8n"); // Plays a "C4" note for a short duration
       
      }
    
    // closeModal();
  };

  const handleItemChange = (e) => {
    const data = e.target.value;

    console.log(data);

    setPurchase_item_id(data);

    console.log(PurchasedListInvoice);

    const purchaseId = PurchasedListInvoice.find((ele) =>
      ele.items.filter((ele) => ele.id == data)
    );

    console.log(purchaseId);

    setPurchaseId(Number(purchaseId.id));

    const selectedPurchase = PurchasedList.find(
      (item) => item.id == e.target.value
    );
    console.log(selectedPurchase);

    if (selectedPurchase) {
      const matchingUnit = UnitList.find(
        (ele) => ele.id == selectedPurchase.unit_Id
      );

      setAvailableQuantity(
        `${selectedPurchase.AvailableQuantity} ${matchingUnit.unit}`
      );

      setFilterUnitList(
        UnitList.filter(
          (ele) =>
            ele.parent_id == selectedPurchase.unit_Id ||
            ele.id == selectedPurchase.unit_Id
        )
      );
    }
  };

  // Filter Subcategories based on selected Category
  const filteredSubCategories = SubCategoryList.filter(
    (subCat) => subCat.category_id === Number(category_id)
  );

  // Filter Sub-Subcategories based on selected Subcategory
  const filteredSubSubCategories = Sub_SubCategoryList.filter(
    (subSubCat) => subSubCat.sub_category_id === Number(subCategory_id)
  );


  return (
    <div className="p-6 bg-white rounded shadow-md">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2 ">Create Offers</h1>

      {/* Add Item Form */}
      <div className="grid grid-cols-4 gap-5 border-b-2 p-2  pb-5">
        {/* date Input */}
        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="PostedDate"
            value={PostedDate}
            onChange={(e) => setPostedDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* offerName Input */}
        <div>
          <label className="block font-medium">Offer Name</label>
          <input
            type="text"
            name="offerName"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Value Input */}
        <div>
          <label className="block font-medium">Offer Value %</label>
          <input
            type="number"
            name="OfferPercentValue"
            value={OfferPercentValue}
            onChange={(e) => setOfferPercentValue(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-2">
          <label className="block text-gray-700">Category</label>
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border border-gray-300 p-1 w-full rounded-md"
          >
            <option value="">Select Category</option>
            {CategoryList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* SubCategory Dropdown */}
        <div className="mb-2">
          <label className="block text-gray-700">Sub Category</label>
          <select
            value={subCategory_id}
            onChange={(e) => setSubCategoryId(e.target.value)}
            className="border border-gray-300 p-1 w-full rounded-md"
            // disabled={!category_id}
          >
            <option value="">Select SubCategory</option>
            {SubCategoryList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-SubCategory Dropdown */}
        <div className="mb-2">
          <label className="block text-gray-700">Sub SubCategory</label>
          <select
            value={sub_subCategory_id}
            onChange={(e) => setSub_SubCategoryId(e.target.value)}
            className="border border-gray-300 p-1 w-full rounded-md"
          >
            <option value="">Select Sub SubCategory</option>
            {Sub_SubCategoryList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* ItemList Dropdown */}
        <div className="mb-2">
  <label className="block text-gray-700 text-sm font-medium">Item</label>
  <select
    value={item_id}
    onChange={(e) => setItem_Id(e.target.value)}
    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  >
    <option value="">Select Item</option>
    {ItemList.map((option) => (
      <option key={option.id} value={option.id}>
        {option.ItemName}
      </option>
    ))}
  </select>
</div>





        {/* LooseVariant Dropdown */}
        <div className="mb-2">
  <label className="block text-gray-700 text-sm font-medium">Loose Varient</label>
  <select
    value={looseVariantId}
    onChange={(e) => setLooseVariantId(e.target.value)}
    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  >
    <option value="">Select Item</option>
    {LooseVariantList.map((option) => (
      <option key={option.id} value={option.id}>
        {option.variantName}
      </option>
    ))}
  </select>
</div>


        {/* PacketVariant Dropdown */}
        <div className="mb-2">
  <label className="block text-gray-700 text-sm font-medium">Packet Varient</label>
  <select
    value={PacketVariantId}
    onChange={(e) => setPacketVariantId(e.target.value)}
    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  >
    <option value="">Select Item</option>
    {PacketVariantList.map((option) => (
      <option key={option.id} value={option.id}>
        {option.variantName}
      </option>
    ))}
  </select>
</div>















        {/* Start date Input */}
        <div>
          <label className="block font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* endDate Input */}
        <div>
          <label className="block font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Status */}
        <div className="mb-2">
          <label htmlFor="status" className="block text-gray-700">
            Status
          </label>
          <select
            id="Status"
            value={Status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleFormSubmit}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default AddOffers;
