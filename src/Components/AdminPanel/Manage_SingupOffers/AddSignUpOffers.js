import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  GetAllCreatedItems,
  getAllLooseVarient,
  getAllLooseVarientForCreatingOFFER,
  GetAllOffers,
  getAllPacketStock,
  getAllpacketVariants_CreatingFor_SignupOffer,
  getAllPacketVarientForCreatingOFFER,
  LooseVariants_for_CreateSingupAllOffers,
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../CrudOperations/GetOperation";
import { CreateOffer, CreateSignUpOffer } from "../../CrudOperations/PostOperation";
import * as Tone from "tone";
import { useLocation, useNavigate } from "react-router-dom";

const AddSignUpOffers = () => {
  const location = useLocation();

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

  // Newssss
  const [offer_name, setoffer_name] = useState("");
  const [offer_mrp, setoffer_mrp] = useState("");
  const [offer_discount, setoffer_discount] = useState("");
  const [offer_cashback, setoffer_cashback] = useState("");
  const [offer_description, setoffer_description] = useState("");
  const [offer_status, setoffer_status] = useState(1);
  const [offer_image_path, setoffer_image_path] = useState("");
  const [offerImagePriview, setofferImagePriview] = useState("");
  const [offerItemBucket, setofferItemBucket] = useState("");


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
    console.log(location);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          allOffer,
          items,
          Category,
          Sub_Category,
          Sub_subCategory,
          looseVariant,
          packetVarient,
        ] = await Promise.all([
          GetAllOffers(),
          GetAllCreatedItems(),
          Show_Users_MainCategory(),
          Show_users_SubCategory(),
          Show_Users_Sub_SubCategory(),
          LooseVariants_for_CreateSingupAllOffers(),
          getAllpacketVariants_CreatingFor_SignupOffer(),
        ]);
        console.log(looseVariant);
        console.log(packetVarient);

        if (allOffer.data.message === "All Offer retrieved successfully!") {
          setOfferList(items.data.data);
        }
        if (items.data.message === "All Items retrieved successfully!") {
          setItemList(items.data.data);
        }

        if (
          looseVariant.data.message ===
          "All Stocked LooseVariant for Creating Signup Offer retrieved successfully!"
        ) {
          console.log(looseVariant);
          
          setLooseVarientList(looseVariant.data.data);
        }

        if (
          packetVarient.data.message ===
          "All Stocked packetVariants for Creating Signup Offer retrieved successfully!"
        ) {
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

    console.log(offerItemBucket);
    



    const response = await CreateSignUpOffer(

      offer_name,
      offer_mrp,
      offer_discount,
      offer_cashback,
      offer_description,
      offer_status,
      offer_image_path,
      offerItemBucket
    );
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

  const ItemSubmittion = (e) => {


    if (looseVariantId === "" && PacketVariantId === "") {
      toast.error("Please Select Item");
      return;
    }




    setofferItemBucket((prev) => [
      ...prev,
      {
        looseVariantId: looseVariantId || null,
        PacketVariantId: PacketVariantId || null,
      },
    ]);
    








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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;
      if (width === 600 && height === 400) {
        // Accept the image
        setofferImagePriview(img.src);
        setoffer_image_path(file);
      } else {
        alert("Image must be exactly 600x400 pixels.");
        e.target.value = null; // Reset the input
      }
    };
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 border-blue-400 border-b-2 py-2  ">
        Create Signup Offers
      </h1>

      {/* Add Item Form */}
      <div className="grid grid-cols-4 gap-5 border-b-2 p-2  pb-5">
        {/* date Input */}

        {/* offerName Input */}
        <div>
          <label className="block font-medium">Offer Name *</label>
          <input
            type="text"
            name="offer_name"
            value={offer_name}
            onChange={(e) => setoffer_name(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Value Input */}
        <div>
          <label className="block font-medium">Offer MRP *</label>
          <input
            type="number"
            name="offer_mrp"
            value={offer_mrp}
            onChange={(e) => setoffer_mrp(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Offer Discount (%) *</label>
          <input
            type="number"
            name="offer_discount"
            value={offer_discount}
            onChange={(e) => setoffer_discount(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">offer Cashback *</label>
          <input
            type="number"
            name="offer_cashback"
            value={offer_cashback}
            onChange={(e) => setoffer_cashback(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">offer Description</label>
          <input
            type="text"
            name="offer_description"
            value={offer_description}
            onChange={(e) => setoffer_description(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium">Offer Status</label>
          <select
            value={offer_status}
            onChange={(e) => setoffer_status(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md"
          >
            <option value="">Select Status</option>
            <option key={1} value={1}>
              Active
            </option>

            <option key={0} value={0}>
              Inactive
            </option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Offer Image *    <span className="text-sm">(600 x 400)</span></label>
          <input
            type="file"
            name="offer_image_path"
            onChange={(e) => handleImageChange(e)}
            accept="image/*"
            className="w-full p-1 border rounded"
          />

          {/* {offerImagePriview && (
        <div className="mt-4 ">
          <p className="text-sm font-medium">Image Preview:</p>
          <img
            src={offerImagePriview}
            alt="Preview"
            className="mt-2 w-64 h-auto rounded border"
          />
        </div>
      )} */}
        </div>
      </div>

      <div>

        
          <h1 className="text-xl mt-4 font-bold   ">
            Add Item to Offer
          </h1>

        <div className="mt-3 border-b-2 p-2  pb-5 flex gap-5 items-center">
          {/* LooseVariant Dropdown */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-medium">
              Loose Varient
            </label>
            <select
              value={looseVariantId}
              onChange={(e) => setLooseVariantId(e.target.value)}
              className="border border-gray-300 p-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
            <label className="block text-gray-700 text-sm font-medium">
              Packet Varient
            </label>
            <select
              value={PacketVariantId}
              onChange={(e) => setPacketVariantId(e.target.value)}
              className="border border-gray-300 p-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Select Item</option>
              {PacketVariantList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.variantName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => ItemSubmittion()}
            className=" bg-green-600 hover:bg-gray-900  text-white py-1 px-3 mt-2  rounded"
          >
            Add Item
          </button>


        </div>

        <div>

              {/* item List */}
      <div className="overflow-x-auto mt-5 text-left p-5">
        <h4 className="text-lg font-semibold mb-2">Item List</h4>
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                HSN
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Qty
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Cost Price
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Discount
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Taxable Amt.
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                GST Amount
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Total
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>



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

export default AddSignUpOffers;
