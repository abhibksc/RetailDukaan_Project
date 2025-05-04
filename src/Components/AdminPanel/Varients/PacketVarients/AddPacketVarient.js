import { useState, useEffect } from "react";
import { BiAlignRight, BiExpandAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import {
  checkSkuExists,
  storeloose_Varient,
  storePacket_Varient,
} from "../../../CrudOperations/PostOperation";
import { UpdatePacketVarientData } from "../../../CrudOperations/Update&Edit";
import {
  getAllBrand,
  GetAllCreatedItems,
  GetAllCreatedItemsforCreatingpacketVarients,
  getAllLooseStock,
  getAllPacketStock,
  getAllPacketVarient,
  getAllPurchase,
  getAllUnit,
  GetwareHouses,
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../../CrudOperations/GetOperation";
import { useLocation, useNavigate } from "react-router-dom";
import PacketVarientImages from "./packetVarientImages";
import Packet_Specification from "./Packet_Specification";
import { DeletePacketVarient } from "../../../CrudOperations/DeleteOperation";
import CreateBrandModal from "../../CreateBrandModal";
import ViewImages from "./ViewVariant/ViewImages";
import ViewSpecification from "./ViewVariant/ViewSpecification";
import VariantTable from "./VariantTable";
import LoadingModal from "../../../LoadingModal";
//

const AddPacketVarient = ({ onSubmit, EditPacketVarients, onUpdate }) => {
  const navigate = useNavigate();
  let updationData = useLocation();
  updationData = updationData.state;

  const [item_id, setItem_id] = useState("");

  const [variantName, setVarientName] = useState("");
  const [Status, setStatus] = useState("");

  const [PacketVarients, setPacketVarient] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openSpecificationModal, setOpenSpecificationModal] = useState(false);

  const [isOpenBrandModal, setIsOpenBrandModal] = useState(false);

  const [ImageBucket, setImageBucket] = useState([]);
  const [SpecificationBucket, setSpecificationBucket] = useState([]);

  // openSpecificationModal

  //

  const [sku_id, setSku_id] = useState("");
  const [brand_id, setBrandId] = useState("");

  const [quantity_per_packet, setQuantity_per_packet] = useState("");
  const [quantity_unit, setQuantity_unit] = useState("");
  const [quantity_unit_value, setQuantity_unit_value] = useState("");
  const [quantity_unit_Name, setQuantity_unit_name] = useState("");
  const [price, setPrice] = useState("");
  const [discount_percentage, setDiscount_percentage] = useState("");
  const [discount_price, setDiscount_price] = useState("");
  const [selling_price, setSelling_price] = useState("");
  const [Available_in_packet, setAvailable_in_packet] = useState("");
  const [limit_per_order, setLimit_per_order] = useState("");
  const [AvailableInStock, setAvailableInStock] = useState("");
  const [AvailableInStock_withUnit, setAvailableInStock_WithUnit] =
    useState("");

  // quantity_unit

  const [verifyskuId, setVarifySku] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state to track verification status

  const [ItemList, setItemList] = useState([]);
  const [PurchasedList, setPurchasedList] = useState([]);
  const [UnitList, setUnitList] = useState([]);
  const [loose_stockList, setLoose_stockList] = useState([]);
  const [warehouseList, setWareHouseList] = useState([]);
  const [BrandList, setBrandList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [CategoryList, setCategoryList] = useState([]);
  const [SubCategoryList, setSubCategoryList] = useState([]);
  const [Sub_SubCategoryList, setSub_SubCategoryList] = useState([]);

  const [AvailableQuantity, setAvailableQuantity] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          itemResponse,
          purchaseResponse,
          unitResponse,
          looseStockResponse,
          warehouseResponse,
          Category,
          Sub_Category,
          Sub_subCategory,
          brandResponse,
        ] = await Promise.all([
          GetAllCreatedItemsforCreatingpacketVarients(),
          getAllPurchase(),
          getAllUnit(),
          getAllLooseStock(),
          GetwareHouses(),
          Show_Users_MainCategory(),
          Show_users_SubCategory(),
          Show_Users_Sub_SubCategory(),
          getAllBrand(),
        ]);

        if (
          purchaseResponse.data.message ===
          "All purchases retrieved successfully!"
        ) {
          setPurchasedList(purchaseResponse.data.data);
        }
        if (unitResponse.data.message === "All unit retrieved successfully!") {
          setUnitList(unitResponse.data.data);
        }
        if (
          looseStockResponse.data.message ===
          "All loose_stock retrieved successfully!"
        ) {
          setLoose_stockList(looseStockResponse.data.data);
        }

        if (
          brandResponse.data &&
          brandResponse.data.message == "All brands retrieved successfully!"
        ) {
          setBrandList(brandResponse.data.data);
        }

        if (Category.data) {
          setCategoryList(Category.data);
        }

        if (itemResponse.data.message === "All Items retrieved successfully!") {
          setItemList(itemResponse.data.data);
        }
        if (Sub_Category.data) {
          setSubCategoryList(Sub_Category.data);
        }
        if (Sub_subCategory.data) {
          setSub_SubCategoryList(Sub_subCategory.data);
        }

        if (warehouseResponse) {
          setWareHouseList(warehouseResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fun = () => {
      if (updationData) {
        console.log(updationData);

        const data = updationData;
        if (data.Variants) {
          setPacketVarient(data.Variants);

          setItem_id(data.id);

          // const getResponses = await GetAllCreatedItemsforCreatingpacketVarients()

          // setItemList(getResponses.data.data);
        }

        // console.log(data.Variants);

        // const varData = data.Variants.map((ele) => ({
        //   ...ele,
        //   Available_in_packet: Number(ele.Available_in_packet),
        //   discount_price: Number(ele.discount_price),
        //   price: Number(ele.price),
        //   quantity_per_packet: Number(ele.quantity_per_packet),
        //   selling_price: Number(ele.selling_price),
        // }));

        // console.log(varData);
      } else {
      }
    };

    fun();
  }, [updationData]);

  const handleFormSubmit = async () => {
    // e.preventDefault();

    setLoading(true);

    let formData = {
      item_id,
      PacketVarients,
    };

    if (updationData) {
      const response = await getAllPacketVarient();

      if (response.data.message === "All variants retrieved successfully!") {
        const newData = formData.PacketVarients.filter((ele) => !ele.id);

        formData = {
          item_id,
          PacketVarients: newData,
        };

        if (formData.PacketVarients.length > 0) {
          const response = await storePacket_Varient({ formData });
          if (response.data.message == "Packet variant saved successfully!") {
            const Merchanttoken = localStorage.getItem("Merchanttoken");
            navigate(`/admin/${Merchanttoken}/packetVarient`);
            toast.success("1 Item Added!!");
          }
        } else {
          toast.warn("No any Data updated!!!");
        }
      }
    } else {
      const response = await storePacket_Varient({ formData });
      if (response && response.data.message == "Packet variant saved successfully!") {
        const Merchanttoken = localStorage.getItem("Merchanttoken");

        navigate(`/admin/${Merchanttoken}/packetVarient`);

        toast.success(response.data.message);
      } else if(response && response.data.message) {
        toast.error(response.data.message);
      }
      else{
        toast.error("error!!")
      }
    }

    setLoading(false);
  };

  // handleVarientSubmit

  const handleVarientSubmit = (e) => {
    e.preventDefault();

    // Create a new object with the current input values
    const newVariant = {
      item_id,
      brand_id,
      sku_id,
      variantName,
      Status,
      limit_per_order,
      ImageBucket,
      SpecificationBucket,
    };

    // // Check if all required fields are filled
    // const areFieldsValid = Object.entries(newVariant).every(([key, value]) => {

    //   return value !== "" ;
    // });

   
      setPacketVarient((prevVariants) => [...prevVariants, newVariant]);

      // Clear the form fields after adding a new variant
      setVarifySku(false);
      setSku_id("");
      setVarientName("");
      setLimit_per_order("");
      setStatus("");
      setImageBucket([]);
      setSpecificationBucket([]);

      toast.success("1 Item Added!!");

      console.log("Variant added successfully:", newVariant);
  
  };

  const handleVerifySku = async () => {
    setIsVerifying(true); // Set verifying state to true
    try {
      const response = await checkSkuExists(sku_id);
      if (response && response.data.message === "SKU ID does not exist") {
        setVarifySku(true);
        toast.success("SKU ID is available.");
      } else {
        setVarifySku(false);
        toast.error("SKU ID already exists.");
      }
    } catch (error) {
      console.error("Error verifying SKU:", error);
      toast.error("Error verifying SKU. Please try again.");
    } finally {
      setIsVerifying(false); // Reset verifying state
    }
  };

  // editVarient

  const editVarient = (index) => {
    // Fetch the specific variant to edit
    const variantToEdit = PacketVarients[index];

    setPacketVarient((prev) => prev.filter((_, i) => i !== index));

    // Populate the state with the selected variant's data
    setItem_id(variantToEdit.item_id || "");
    setSku_id(variantToEdit.sku_id || "");
    setVarientName(variantToEdit.variantName || "");
    setStatus(variantToEdit.Status || "");
    setLimit_per_order(variantToEdit.limit_per_order || "");
    setImageBucket(variantToEdit.ImageBucket || []);
    setSpecificationBucket(variantToEdit.SpecificationBucket || []);
    setPrice(variantToEdit.price || "");
    setDiscount_percentage(variantToEdit.discount_percentage || "");
    setSelling_price(variantToEdit.selling_price || "");
    setAvailableInStock(variantToEdit.AvailableInStock || "");
    setQuantity_per_packet(variantToEdit.quantity_per_packet || "");
    setQuantity_unit(variantToEdit.quantity_unit || "");

    // Optional: Notify the user that the variant is ready to edit
    toast.info("Variant data loaded for editing.");
  };

  const closeImageModal = () => {
    setOpenImageModal(false);
  };

  const closeSpecificationModal = () => {
    setOpenSpecificationModal(false);
  };

  const handleImageSubmission = (data) => {
    setImageBucket(data);

    setOpenImageModal(false);
  };

  // handleSpecificationSubmission

  const handleSpecificationSubmission = (data) => {
    setSpecificationBucket(data);

    setOpenSpecificationModal(false);
  };

  if (loading) <LoadingModal />;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-3 ">
        {updationData ? "Edit Packet Varient" : "Add Packet Varient"}
      </h2>

      {/* Add Brand Modal */}
      {openImageModal && (
        <PacketVarientImages
          existingData={ImageBucket}
          onclose={closeImageModal}
          submission={handleImageSubmission}
        />
      )}

      {openSpecificationModal && (
        <Packet_Specification
          existingData={SpecificationBucket}
          onclose={closeSpecificationModal}
          submission={handleSpecificationSubmission}
        />
      )}

      <div className="">
        <div className="grid grid-cols-4 gap-5 border-b-2 p-2 mb-7">
          {!updationData ? (
            <div className="mb-2">
              <label className="block text-gray-700">Select Item *</label>
              <select
                value={item_id}
                onChange={(e) => setItem_id(e.target.value)}
                disabled={updationData}
                className="border border-gray-300  p-1 w-full rounded-md"
              >
                <option value="">Select Item</option>
                {ItemList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.ItemName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-2">
              {/*   {updationData.Item_ItemName} */}
              <label className="block text-gray-700">Select Item *</label>
              <select
                value={item_id}
                onChange={(e) => setItem_id(e.target.value)}
                disabled={updationData}
                className="border border-gray-300  p-1 w-full rounded-md"
              >
                <option value="">{updationData.Item_ItemName}</option>
              </select>
            </div>
          )}

          <div className="mb-4 flex w-full items-center space-x-4">
            {/* Brand Selection */}
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                <div className="flex items-center justify-between">
                  <span>Select Brand *</span>
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsOpenBrandModal(true)}
                  >
                    Create
                  </span>
                </div>
              </label>
              {/* Log updationData value */}
              <select
                name="brand_id"
                value={brand_id}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">--Select Brand--</option>
                {BrandList.map((brand, index) => (
                  <option key={index} value={brand.id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Varient Name *</label>
            <input
              value={variantName}
              onChange={(e) => setVarientName(e.target.value)}
              type="text"
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">SKU *</label>
            <div className="relative">
              <input
                disabled={verifyskuId}
                type="text"
                value={sku_id}
                onChange={(e) => setSku_id(e.target.value)}
                className="border border-gray-300 p-1 w-full rounded-md pl-10"
                required
              />
              {!verifyskuId && (
                <span
                  onClick={handleVerifySku}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-5 h-5 text-gray-500 ${
                      isVerifying ? "animate-spin" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1112 4.5a7.5 7.5 0 014.65 12.15z"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="status" className="block text-gray-700">
              Status *
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

          <div className="mb-2">
            <label className="block text-gray-700">Limit per Order</label>
            <input
              type="number"
              value={limit_per_order}
              onChange={(e) => setLimit_per_order(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="flex gap-3">
            <div className="mb-2 relative">
              {/* Corner Cart */}
              <div className="absolute top-3 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {ImageBucket.length}{" "}
                {/* Replace with the actual length of images */}
              </div>
              {/* Button */}
              <button
                className="border border-gray-300 p-1 mt-6 px-3 rounded-md"
                onClick={() => setOpenImageModal(true)}
              >
                Images *
              </button>
            </div>

            <div className="mb-2 relative">
              {/* Corner Cart */}
              <div className="absolute top-3 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {SpecificationBucket.length}{" "}
                {/* Replace with the actual length of specifications */}
              </div>
              {/* Button */}
              <button
                className="border border-gray-300 p-1 mt-6 px-3 rounded-md"
                onClick={() => setOpenSpecificationModal(true)}
              >
                Specification *
              </button>
            </div>
          </div>
        </div>

        <div className="mb-2 col-span-2">
          <button
            onClick={handleVarientSubmit}
            type="submit"
            className="shadow-md text-[13px] hover:bg-green-600 hover:text-white text-green-500 mt-4 mb-5 font-bold py-2 px-4 rounded"
          >
            {EditPacketVarients ? "Update" : "Add Varient"}
          </button>
        </div>

        <VariantTable
          Variants={PacketVarients}
          updationData={updationData}
          BrandList={BrandList}
          onDelete={editVarient}
        />

        <button
          onClick={handleFormSubmit}
          className="bg-blue-500 mt-10 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          {updationData ? "Update" : "Submit"}
        </button>
      </div>

      {CreateBrandModal && (
        <CreateBrandModal
          isOpen={isOpenBrandModal}
          onClose={() => {
            setIsOpenBrandModal(false);
          }}
          onSubmit={async (id) => {
            console.log(id);
            
            const brandResponse = await getAllBrand();

            if (
              brandResponse.data &&
              brandResponse.data.message == "All brands retrieved successfully!"
            ) {
              console.log(brandResponse);
              setBrandList(brandResponse.data.data);
         
              setIsOpenBrandModal(false);
              setBrandId(id)
            }
          }}
        />
      )}
    </div>
  );
};

export default AddPacketVarient;
