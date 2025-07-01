import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  checkSkuExists,
  storePacket_Varient,
} from "../../../CrudOperations/PostOperation";
import {
  getAllBrand,
  GetAllCreatedItemsforCreatingpacketVarients,
  getAllPurchase,
} from "../../../CrudOperations/GetOperation";
import { useLocation, useNavigate } from "react-router-dom";
import PacketVarientImages from "./packetVarientImages";
import Packet_Specification from "./Packet_Specification";
import CreateBrandModal from "../../CreateBrandModal";
import VariantTable from "./VariantTable";
import LoadingModal from "../../../LoadingModal";
import { AddNewPacketVariantToDatabase, UpdatePacketVarientData } from "../../../CrudOperations/Update&Edit";
//

const AddPacketVarient = ({ onSubmit, EditPacketVarients, onUpdate }) => {
  const navigate = useNavigate();
  let updationData = useLocation();
  updationData = updationData.state;
  console.log(updationData);

    const [edit_Particular_variantMode, setEdit_particular_variantMode] = useState(false);
    const [isClickedAdd_NewVariant, setIsClickedAdd_NewVariant] = useState(false);

    // 
  

  const [item_id, setItem_id] = useState("");

  const [variantName, setVarientName] = useState("");
  const [Status, setStatus] = useState("");

  const [PacketVarients, setPacketVarient] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");

  const [openImageModal, setOpenImageModal] = useState(false);
  const [openSpecificationModal, setOpenSpecificationModal] = useState(false);

  const [isOpenBrandModal, setIsOpenBrandModal] = useState(false);

  const [ImageBucket, setImageBucket] = useState([]);
  const [SpecificationBucket, setSpecificationBucket] = useState([]);

  // openSpecificationModal

  //

  const [sku_id, setSku_id] = useState("");
  const [brand_id, setBrandId] = useState("");

  const [limit_per_order, setLimit_per_order] = useState("");

  // quantity_unit

  const [verifyskuId, setVarifySku] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state to track verification status

  const [BrandList, setBrandList] = useState([]);
  const [ItemList, setItemList] = useState([]);
    const [purchaseList, setPurchasedList ] = useState([]);

  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          itemResponse,
          purchaseResponse,
                    brandResponse,
        ] = await Promise.all([
          GetAllCreatedItemsforCreatingpacketVarients(),
          getAllPurchase(),
          getAllBrand(),
        ]);

        if (
          purchaseResponse.data.message ===
          "All purchases retrieved successfully!"
        ) {
          setPurchasedList(purchaseResponse.data.data);
        }


              if (
              brandResponse.data &&
              brandResponse.data.message == "All brands retrieved successfully!"
            ) {
              setBrandList(brandResponse.data.data);
            }



        if (itemResponse.data.message === "All Items retrieved successfully!") {
          console.log(itemResponse);
          
          setItemList(itemResponse.data.data);
        }

      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fun = () => {
      if (updationData) {
        const data = updationData;
        if (data.Variants) {
          setPacketVarient(data.Variants);
          setItem_id(data.id);
        }

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

    console.log(updationData);
    

    if (updationData) {
    console.log(updationData);

      // const response = await getAllPacketVarient();

      // if (response.data.message === "All variants retrieved successfully!") {
      //   const newData = formData.PacketVarients.filter((ele) => !ele.id);

      //   formData = {
      //     item_id,
      //     PacketVarients: newData,
      //   };

      //   if (formData.PacketVarients.length > 0) {
      //     const response = await storePacket_Varient({ formData });
      //     if (response.data.message == "Packet variant saved successfully!") {
      //       const Merchanttoken = localStorage.getItem("Merchanttoken");
      //       navigate(`/admin/${Merchanttoken}/packetVarient`);
      //       toast.success("1 Item Added!!");
      //     }
      //   } else {
      //     toast.warn("No any Data updated!!!");
      //   }
      // }
    } else {
      
      try{

        const response = await storePacket_Varient({ formData });
      if (
        response &&
        response?.data?.message == "Packet variant saved successfully!"
      ) {
        const Merchanttoken = localStorage.getItem("Merchanttoken");

        navigate(`/admin/${Merchanttoken}/packetVarient`);

        toast.success(response.data.message);
      } else  {
        toast.error(response?.data?.message || "error!!" );
      }

      }
      catch(err){
        console.log(err?.response?.data?.message || err?.response?.data?.error);
        

      }
    }

    setLoading(false);
  };





const handleUpdateParticular_variant = async (e) => {
  e.preventDefault();
        setLoading(true)

  if (
    !item_id || !brand_id || !sku_id || !variantName || !Status ||
    !limit_per_order || ImageBucket.length === 0 || SpecificationBucket.length === 0
  ) {
    toast.error("Please fill in all required fields.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("item_id", item_id);
    formData.append("brand_id", brand_id);
    formData.append("sku_id", sku_id);
    formData.append("variantName", variantName);
    formData.append("Status", Status);
    formData.append("limit_per_order", limit_per_order);

    // Append specifications
    SpecificationBucket.forEach((spec, index) => {
      formData.append(`SpecificationBucket[${index}][key]`, spec.key);
      formData.append(`SpecificationBucket[${index}][value]`, spec.value);
    });

    // Append images
    // ImageBucket.forEach((file, index) => {
    //   formData.append(`image_path[${index}]`, file);
    // });

    const response = await UpdatePacketVarientData({
      id: selectedVariant.id,
      formData,
    });

    if (response?.status === 200 || response?.status === 201) {
      toast.success("Variant updated successfully!");
              const Merchanttoken = localStorage.getItem("Merchanttoken");

        navigate(`/admin/${Merchanttoken}/packetVarient`);
    } else {
      toast.error("Failed to update variant.");
    }

  } catch (error) {
    toast.error("Something went wrong while updating the variant.");
    console.error("Error:", error);
  }
  finally{
      setLoading(false)
  }
};






  // handleVarientSubmit

const handleVarientSubmit = (e) => {
  e.preventDefault();

  // Validate required fields
  if (
    !item_id ||
    !brand_id ||
    !sku_id ||
    !variantName ||
    !Status ||
    !limit_per_order ||
    ImageBucket.length === 0 ||
    SpecificationBucket.length === 0
  ) {
    toast.error("Please fill in all required fields.");
    return;
  }

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

// handleNewVariant___Submit

const handleNewVariant___Submit_to_database = async (e) => {
  e.preventDefault();

  setLoading(true)

  if (
    !item_id || !brand_id || !sku_id || !variantName || !Status ||
    !limit_per_order || ImageBucket.length === 0 || SpecificationBucket.length === 0
  ) {
    toast.error("Please fill in all required fields.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("brand_id", brand_id);
    formData.append("sku_id", sku_id);
    formData.append("variantName", variantName);
    formData.append("Status", Status);
    formData.append("limit_per_order", limit_per_order);

    SpecificationBucket.forEach((spec, index) => {
      formData.append(`SpecificationBucket[${index}][key]`, spec.key);
      formData.append(`SpecificationBucket[${index}][value]`, spec.value);
    });

ImageBucket.forEach((file, index) => {
  if (file?.file instanceof File) {
    formData.append(`image_path[${index}]`, file.file);
  } else {
    console.warn(`Skipped invalid file at index ${index}`, file);
  }
});


    const response = await AddNewPacketVariantToDatabase({
      id: updationData.id,
      formData,
    });

    if (response?.status === 200 || response?.status === 201) {
      toast.success("Variant added successfully!");
      const Merchanttoken = localStorage.getItem("Merchanttoken");
      navigate(`/admin/${Merchanttoken}/packetVarient`);
    } else {
      toast.error("Failed to add variant.");
    }

  } catch (error) {
    toast.error("Something went wrong.");
    console.error("Error:", error);
  }
  finally{
      setLoading(false)
  }
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
      console.log("Error verifying SKU:", error);
      toast.error("Error verifying SKU. Please try again.");
    } finally {
      setIsVerifying(false); // Reset verifying state
    }
  };

  // editVarient

  const editVarient = (type, id) => {

    const variantToEdit = PacketVarients[id];
    console.log(variantToEdit);
    console.log(PacketVarients);
    

    if (type === "withDB_id") {
      setSelectedVariant(variantToEdit)
      setPacketVarient((prev) => prev.filter((_, i) => i !== id));
 setEdit_particular_variantMode(true)

      const PacketImagess = variantToEdit?.PacketImages?.map((element) => {
        return { url: element?.url, name: element?.url ,db_id: element?.id };
      })  ||  variantToEdit?.ImageBucket || [];


      // Populate the state with the selected variant's data
      setItem_id(variantToEdit?.item_id || "");
      setBrandId(variantToEdit?.brand_id || "")
      setSku_id(variantToEdit?.sku_id || "");
      setVarientName(variantToEdit?.variantName || "");
      setStatus(variantToEdit?.Status || "");
      setLimit_per_order(variantToEdit?.limit_per_order || "");
      setImageBucket(PacketImagess || []);
      setSpecificationBucket(variantToEdit?.PacketSpecification || variantToEdit?.SpecificationBucket || []);
    } else {
      setPacketVarient((prev) => prev.filter((_, i) => i !== id));

      // Populate the state with the selected variant's data
      setItem_id(variantToEdit?.item_id || "");
      setSku_id(variantToEdit?.sku_id || "");
      setVarientName(variantToEdit?.variantName || "");
      setStatus(variantToEdit?.Status || "");
      setLimit_per_order(variantToEdit?.limit_per_order || "");
      setImageBucket(variantToEdit?.ImageBucket || []);
      setSpecificationBucket(variantToEdit?.SpecificationBucket || []);
    }

    toast.info("Variant data loaded for editing.");
  };

  // onDeleteVariant


    const onDeleteVariant = (id) => {

       setPacketVarient((prev) => prev.filter((_, i) => i !== id));

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


  const handleSpecificationSubmission = (data) => {
    setSpecificationBucket(data);
    setOpenSpecificationModal(false);
  };

  if (loading) return <LoadingModal />;

  return (
    <div className="p-6 bg-white rounded shadow-md">
  <div className="flex justify-between">
        <h2 className="text-lg font-bold mb-3 ">
        {updationData ? "Edit Packet Varient" : "Add Packet Varient"}
      </h2>

            { updationData &&   <button
            onClick={()=>setIsClickedAdd_NewVariant(true)}
            className="shadow-md text-[13px] bg-blue-500 hover:bg-black  text-white mt-4 mb-5 font-bold py-2 px-4 rounded"
          >
            {"Add More Variants"}
          </button>}
  </div>


      {/* Add Brand Modal */}
      {openImageModal && (
        <PacketVarientImages
          existingData={ImageBucket}
          onclose={closeImageModal}
          submission={handleImageSubmission}
          Database_vaiantID={selectedVariant}
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
         {(updationData && edit_Particular_variantMode) ?
         
         <button
            onClick={(e)=>handleUpdateParticular_variant(e)}
            type="submit"
            className="shadow-md text-[13px] hover:bg-green-600 hover:text-white text-green-500 mt-4 mb-5 font-bold py-2 px-4 rounded"
          >
            Update Now
          </button>

          :

          (isClickedAdd_NewVariant && updationData) ?

             <button
            onClick={handleNewVariant___Submit_to_database}
            type="submit"
            className="shadow-md text-[13px] hover:bg-green-600 hover:text-white text-green-500 mt-4 mb-5 font-bold py-2 px-4 rounded"
          >
            {"Add Varient to the Item"}
          </button>

          :

          !updationData &&





                 <button
            onClick={handleVarientSubmit}
            type="submit"
            className="shadow-md text-[13px] hover:bg-green-600 hover:text-white text-green-500 mt-4 mb-5 font-bold py-2 px-4 rounded"
          >
            {"Add Varient"}
          </button>



          
        
        }
        </div>

        <VariantTable
          Variants={PacketVarients}
          updationData={updationData}
          BrandList={BrandList}
          onUpdate={editVarient}
          onDelete = {onDeleteVariant}
        />
{!updationData &&
        <button
          onClick={handleFormSubmit}
          className="bg-blue-500 mt-10 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          {updationData ? "Update" : "Submit"}
        </button>}
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
              setBrandList(brandResponse.data.data);
              setIsOpenBrandModal(false);
              setBrandId(id);
            }
          }}
        />
      )}
    </div>
  );
};

export default AddPacketVarient;
