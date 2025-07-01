import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  GetAllCreatedItems,
  getAllLooseVarient,
  getAllLooseVarientForCreatingOFFER,
  GetAllOffers,
  getAllPacketStock,
  getAllPacketVarientForCreatingOFFER,
  Show_Users_Groups_for_Creating_Offer,
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../CrudOperations/GetOperation";
import { CreateOffer } from "../../CrudOperations/PostOperation";
import * as Tone from "tone";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import baseurl from "../../CrudOperations/customURl";

const AddOffers = () => {
  const [item_id, setItem_Id] = useState("");
  const [looseVariantId, setLooseVariantId] = useState("");
  const [PacketVariantId, setPacketVariantId] = useState("");

  const user_AllGroup = useSelector(
    (state) => state.GroupCategorySlice_reducer.user_AllGroup
  );
  const user_AllCategory = useSelector(
    (state) => state.GroupCategorySlice_reducer.user_AllCategory
  );
  const user_AllSubCategory = useSelector(
    (state) => state.GroupCategorySlice_reducer.user_AllSubCategory
  );
  const user_AllSubSubCategory = useSelector(
    (state) => state.GroupCategorySlice_reducer.user_AllSubSubCategory
  );
  const user_AllItems = useSelector(
    (state) => state.GroupCategorySlice_reducer.user_AllItems
  );
  const user_AllLooseVariant = useSelector(
    (state) => state.GroupCategorySlice_reducer.user_AllLooseVariant
  );
  const user_AllPacketVariant = useSelector(
    (state) => state.GroupCategorySlice_reducer.user_AllPacketVariant
  );

  console.log(user_AllGroup);
  console.log(user_AllCategory);
  console.log(user_AllSubCategory);
  console.log(user_AllSubSubCategory);
  console.log(user_AllItems);
  console.log(user_AllLooseVariant);
  console.log(user_AllPacketVariant);


  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [unit_value, setUnitValue] = useState("");
  const [purchase_item_id, setPurchase_item_id] = useState("");
  const [category_id, setCategoryId] = useState("");

  const [group_id, setGroupId] = useState("");

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
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allOffer] = await Promise.all([GetAllOffers()]);
        console.log(allOffer);
        

        if (allOffer.data.message === "All Offer retrieved successfully!") {
          // setOfferList(items.data.data);
        }
      } catch (error) {
        console.log("Error fetching data: ", error);
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
      category_id,
      subCategory_id,
      sub_subCategory_id,
      item_id,
      startDate,
      endDate,
      Status,
      looseVariantId,
      PacketVariantId,
      group_id,
    };
    console.log(formDataa);
    const response = await CreateOffer({ formDataa });
    console.log(response);
    if (response && response.data.message === "Offer saved successfully!") {
      const Merchanttoken = localStorage.getItem("Merchanttoken");

      // Navigate(`/admin/${Merchanttoken}/ManageOffer`);

      setCategoryId(""),
        setSubCategoryId(""),
        setSub_SubCategoryId(""),
        setItem_Id(""),
        setLooseVariantId("");
      setPacketVariantId("");

      toast.success(response.data.message);
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

  const options = groupList.map((option) => ({
    value: option.GroupId,
    label: (
      <div className="flex items-center gap-2">
        <img
          src={option.GroupImage}
          alt={option.GroupName}
          className="h-5 w-5 rounded-full"
        />
        <span>{option.GroupName}</span>
      </div>
    ),
  }));

  const handleChange = (selectedOption) => {
    setGroupId(selectedOption?.value);
  };

  const toSelectOptions = (list, labelKey, valueKey, imageKey) => {
    return list.map((item) => ({
      value: item[valueKey],
      label: (
        <div className="flex items-center gap-2">
          {imageKey && item[imageKey] && (
            <img
              src={item[imageKey]}
              alt={item[labelKey]}
              className="h-5 w-5 rounded-full"
            />
          )}
          <span>{item[labelKey]}</span>
        </div>
      ),
    }));
  };


  

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
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          <label className="block font-medium">Offer Value %</label>
          <input
            type="number"
            name="OfferPercentValue"
            value={OfferPercentValue}
            onChange={(e) => setOfferPercentValue(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Group Dropdown */}
        <Select
          options={toSelectOptions(
            user_AllGroup,
            "name",
            "id",
    "images"
          )}
          onChange={(selected) => setGroupId(selected?.value)}
          className="w-full"
          placeholder="Select Group"
        />

        {/* Category Dropdown */}
        <Select
          options={toSelectOptions(user_AllCategory, "name", "id", "image_url")}
          onChange={(selected) => setCategoryId(selected?.value)}
          className="w-full"
          placeholder="Select Category"
        />

        {/* SubCategory Dropdown */}
        <Select
          options={toSelectOptions(
            user_AllSubCategory,
            "name",
            "id",
            "image_url"
          )}
          onChange={(selected) => setSubCategoryId(selected?.value)}
          className="w-full"
          placeholder="Select SubCategory"
        />

        {/* Sub-SubCategory Dropdown */}
        <Select
          options={toSelectOptions(
            user_AllSubSubCategory,
            "name",
            "id",
            "image_url"
          )}
          onChange={(selected) => setSub_SubCategoryId(selected?.value)}
          className="w-full"
          placeholder="Select Sub SubCategory"
        />

        {/* ItemList Dropdown */}
        <Select
          options={toSelectOptions(
            user_AllItems,
            "ItemName",
            "id",
            "image_url"
          )}
          onChange={(selected) => setItem_Id(selected?.value)}
          className="w-full"
          placeholder="Select Item"
        />

        {/* LooseVariant Dropdown */}
        <Select
          options={toSelectOptions(
            user_AllLooseVariant,
            "variantName",
            "id",
            "image_url"
          )}
          onChange={(selected) => setLooseVariantId(selected?.value)}
          className="w-full"
          placeholder="Select Loose Variant"
        />

        {/* PacketVariant Dropdown */}
        <Select
          options={toSelectOptions(
            user_AllPacketVariant,
            "variantName",
            "id",
            "image_url"
          )}
          onChange={(selected) => setPacketVariantId(selected?.value)}
          className="w-full"
          placeholder="Select Packet Variant"
        />

        {/* Start date Input */}
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
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
