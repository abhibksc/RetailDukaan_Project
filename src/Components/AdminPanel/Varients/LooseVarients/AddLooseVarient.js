import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  checkSkuExists,
  storeloose_Varient,
} from "../../../CrudOperations/PostOperation";
import { UpdateLooseVarientData } from "../../../CrudOperations/Update&Edit";
import {
  AllUseFullCategories,
  getAllBrand,
  GetAllCreatedItems,
  GetAllCreatedItemsForCreatingVarients,
  getAllLooseStock,
  getAllLooseVarient,
  getAllPurchase,
  getAllUnit,
  GetwareHouses,
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../../CrudOperations/GetOperation";
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteLooseVarient } from "../../../CrudOperations/DeleteOperation";
import Loose_Specification from "./Loose_Specification";
import CreateBrandModal from "../../CreateBrandModal";
//

const AddLooseVarient = ({ onSubmit, EditLooseVarients, onUpdate }) => {
  const navigate = useNavigate();
  let updationData = useLocation();
  updationData = updationData.state;
  const [purchases_id, setPurchases_id] = useState("");
  const [purchase_item_id, setPurchase_item_id] = useState("");
  const [loose_stock_id, setLoose_stock_id] = useState("");

  

  const [brand_id, setBrandId] = useState("");

  const [unit_id, setUnitId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [SpecificationBucket, setSpecificationBucket] = useState([]);

  const [item_id, setItem_id] = useState("");
  const [variantName, setVarientName] = useState("");
  // const [loose_stock_id, setLoose_stock_id] = useState("");

  const [category_id, setCategoryId] = useState("");
  const [subCategory_id, setSubCategoryId] = useState("");
  const [image_path, setImage_Path] = useState("");
  const [image_url, setimage_url] = useState("");

  const [LooseVarients, setLooseVarient] = useState([]);
  const [Status, setStatus] = useState("");
  const [forPurchase, setForPurchase] = useState(false);

  const [isOpenBrandModal, setIsOpenBrandModal] = useState(false);

  // forPurchase



  const [sku_id, setSku_id] = useState("");
  const [quantity_unit, setQuantity_unit] = useState("");
  const [quantity_unit_value, setQuantity_unit_value] = useState("");
  const [quantity_unit_Name, setQuantity_unit_name] = useState("");
  const [limit_per_order, setLimit_per_order] = useState("");
  const [AvailableInStock, setAvailableInStock] = useState("");
  const [AvailableInStock_withUnit, setAvailableInStock_WithUnit] = useState("");

  // quantity_unit

  const [verifyskuId, setVarifySku] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state to track verification status

  const [ItemList, setItemList] = useState([]);
  const [PurchasedList, setPurchasedList] = useState([]);
  const [UnitList, setUnitList] = useState([]);
  const [loose_stockList, setLoose_stockList] = useState([]);
  const [warehouseList, setWareHouseList] = useState([]);
  const [BrandList, setBrandList] = useState([]);

  const [openSpecificationModal, setOpenSpecificationModal] = useState(false);

  const [CategoryList, setCategoryList] = useState([]);
  const [SubCategoryList, setSubCategoryList] = useState([]);
  const [Sub_SubCategoryList, setSub_SubCategoryList] = useState([]);

  const [AvailableQuantity, setAvailableQuantity] = useState("");

  const closeSpecificationModal = () => {
    setOpenSpecificationModal(false);
  };

  const handleSpecificationSubmission = (data) => {
    setSpecificationBucket(data);

    setOpenSpecificationModal(false);
  };

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
          GetAllCreatedItemsForCreatingVarients(),
          getAllPurchase(),
          getAllUnit(),
          getAllLooseStock(),
          GetwareHouses(),
          AllUseFullCategories(),
          Show_users_SubCategory(),
          Show_Users_Sub_SubCategory(),
          getAllBrand(),
        ]);

          (Category, Sub_Category, Sub_subCategory);

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
            (brandResponse);
          setBrandList(brandResponse.data.data);
        }

        if (Category.data) {
            ("Category Cahal");

          setCategoryList(Category?.data?.data || []);
        }

        if (itemResponse.data.message === "All Items retrieved successfully!") {
          setItemList(itemResponse.data.data);
        }
        if (Sub_Category.data) {
            ("SubCategory Cahal");

          setSubCategoryList(Sub_Category.data);
        }
        if (Sub_subCategory.data) {
            ("SubSubCategory Cahal");

          setSub_SubCategoryList(Sub_subCategory.data);
        }

        if (warehouseResponse) {
          setWareHouseList(warehouseResponse.data);
        }
      } catch (error) {
          ("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
      (updationData);

    const fun = async () => {
      if (updationData) {
          (updationData);
        const data = updationData;
        setItem_id(data.id);
        setLooseVarient(data.Variants);
      } else {
      }
    };

    fun();
  }, [updationData]);

  const handleFormSubmit = async () => {
    // e.preventDefault();

    let formData = {
      item_id,
      LooseVarients,
    };

console.log(formData);


    if (updationData) {
        (formData);

      const response = await UpdateLooseVarientData({
        id: updationData.id,
        formData,
      });
      if (
        response &&
        response.data.message === "loose_variant updated successfully"
      ) {
        const Merchanttoken = localStorage.getItem("Merchanttoken");

        navigate(`/admin/${Merchanttoken}/looseVarient`);

        toast.success(response.data.message);
      }
    } else {
      if (formData.LooseVarients.length > 0) {
          (formData);

        const response = await storeloose_Varient({ formData });
        if (response.data.message === "Loose variants saved successfully!") {
          const Merchanttoken = localStorage.getItem("Merchanttoken");

          navigate(`/admin/${Merchanttoken}/looseVarient`);

          toast.success(response.data.message);
        }
      }
    }
  };

  // handleVarientSubmit

  const handleVarientSubmit = (e) => {
    e.preventDefault();

    // Create a new object with the current input values
    const newVariant = {
      item_id,
      brand_id,
      forPurchase,
      sku_id,
      variantName,
      SpecificationBucket,
      image_path,
      Status,
      limit_per_order,
      unit_id,
      quantity
    };

    




    // Check if all required fields are filled
    const areFieldsValid = Object.entries(newVariant).every(([key, value]) => {
      return value !== "";
    });

    if (areFieldsValid) {
      setLooseVarient((prevVariants) => [...prevVariants, newVariant]);

      // Clear the form fields after adding a new variant
      setVarifySku(false);
      setSku_id("");
      setQuantity("")
      setUnitId("")
      setForPurchase(false);
      setVarientName("");
      setImage_Path("");
      setimage_url("");
      setSpecificationBucket([]);
      setLimit_per_order("");

      toast.success("1 Item Added!!");

    } else {
      toast.warn('Please fill in all required fields.')
    }
  };


  const handleItemId = (e) => {
    if (e.target.value) {
      const data = loose_stockList.find(
        (ele) => ele.id === Number(e.target.value)
      );
        (data);

      setLoose_stock_id(Number(e.target.value));
      setPurchases_id(data.purchase_id);
      setPurchase_item_id(data.purchase_item_id);
      setAvailableInStock(data.Available);

      const available = data.Available + " " + data.unit;
      setAvailableQuantity(available);
      setAvailableInStock_WithUnit(data.unit);
    } else {
      setLoose_stock_id("");
      setPurchases_id("");
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
      console.error("Error verifying SKU:", error);
      toast.error("Error verifying SKU. Please try again.");
    } finally {
      setIsVerifying(false); // Reset verifying state
    }
  };

  // Filter subcategories based on selected category
  const filteredSubCategories = SubCategoryList.filter(
    (subCat) => subCat.category_id === Number(category_id)
  );

  // Filter sub-subcategories based on selected subcategory
  const filteredSubSubCategories = Sub_SubCategoryList.filter(
    (subSubCat) => subSubCat.sub_category_id === Number(subCategory_id)
  );

  const deleteVariant = async (index, id = null) => {
    setLooseVarient((prev) => prev.filter((_, i) => i !== index));

      (id);

    if (id) {
        (id);

      const response = await DeleteLooseVarient(id);
      if (response.data.message === "loose_variant deleted successfully") {
        const Merchanttoken = localStorage.getItem("Merchanttoken");

        navigate(`/admin/${Merchanttoken}/looseVarient`);
      }
    }
    toast.success("Variant deleted successfully");
  };

  const handleUnitChange = (e) => {
      (e.target.value);

    const unitdata = UnitList.find((ele) => ele.id == e.target.value);

      (unitdata);

    setQuantity_unit_value(unitdata.value);

    setQuantity_unit_name(unitdata.unit);

    setQuantity_unit(e.target.value);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-3 ">
        {updationData ? "Edit Loose Varient" : "Add Loose Varient"}
      </h2>

      {openSpecificationModal && (
        <Loose_Specification
          existingData={SpecificationBucket}
          onclose={closeSpecificationModal}
          submission={handleSpecificationSubmission}
        />
      )}

      <div className="">
        <div className="grid grid-cols-4 gap-5 border-b-2 p-2 mb-7">
          <div className="mb-2">
            <label className="block text-gray-700">Select Item *</label>
            <select
            required
              value={item_id}
              onChange={(e) => setItem_id(e.target.value)}
              disabled={updationData}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              <option value="">Select Item *</option>
              {ItemList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.ItemName}
                </option>
              ))}
            </select>
          </div>

        
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
            required

              value={variantName}
              onChange={(e) => setVarientName(e.target.value)}
              type="text"
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>


          <label>
            Qty *
            <input
              type="number"
              placeholder="Qty"
              name="quantity"
              value={quantity}
              onChange={(e)=>setQuantity(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </label>

          <label>
            Select Unit *
            <select
              name="unit_Id"
              value={unit_id}
              onChange={(e)=>setUnitId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">--Select Unit--</option>
              {UnitList.map((supplier, index) => (
                <option key={index} value={supplier.id}>
                  {supplier.unit}
                </option>
              ))}
            </select>
          </label>

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
            <label className="block text-gray-700">Limit per Order *</label>
            <input
            required

              disabled={!verifyskuId}
              type="number"
              value={limit_per_order}
              onChange={(e) => setLimit_per_order(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="status" className="block text-gray-700">
              Status *
            </label>
            <select
              id="Status"
              required

              value={Status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-7 mb-2 ">
            <div className="relative">
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
                Specification
              </button>
            </div>



            <div className="flex items-center space-x-2  px-3">
  <input 
    type="checkbox"
    id="forPurchase"
    name="forPurchase"
    onChange={()=>setForPurchase(!forPurchase)}
    checked = {forPurchase}
    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  />
  <label htmlFor="forPurchase" className=" flex flex-col text-sm w-32">
<span>
Only For PurchasedList
</span>
    {/* <span>(tik if not showing on customer ui)</span> */}
  </label>
</div>





            <div className="flex items-center justify-center">
              <label className="relative w-24 h-24 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center">
                <input

                required
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];


                      setImage_Path(file); // Set image URL from file

                      setimage_url(URL.createObjectURL(file)); // Set image URL from file
                    }
                  }}
                />
                {image_url ? (
                  <img
                    src={image_url}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm text-gray-500">Upload Image</span>
                )}
              </label>
            </div>
          </div>
          
        </div>

        <div className="mb-2 col-span-2">
          <button
            onClick={handleVarientSubmit}
            type="submit"
            className="shadow-md text-[13px] hover:bg-green-600 hover:text-white text-green-500 mt-4 mb-5 font-bold py-2 px-4 rounded"
          >
            {EditLooseVarients ? "Update" : "Add Varient"}
          </button>
        </div>

        <div>
          {/* Display Table */}
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-100 border-b">
                <th className="p-2 text-left">Varient</th>
                <th className="p-2 text-left">brand</th>

                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Limit/Order</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {LooseVarients.map((variant, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{variant.variantName}</td>
                  <td className="p-2">
                    {variant.brand_name
                      ? variant.brand_name
                      : BrandList.find((ele) => ele.id == variant.brand_id)
                          .brand_name}
                  </td>

                  <td className="p-2">
                    <img
                      src={
                        variant.image_url
                          ? variant.image_url
                          : URL.createObjectURL(variant.image_path)
                      }
                      alt="Uploaded"
                      className="w-16 h-full object-cover rounded-full"
                    />
                  </td>

                  <td className="p-2">{variant.limit_per_order}</td>
                  <td className="p-2">{variant.Status}</td>

                  <td className="p-2">
                    <button
                      onClick={() => deleteVariant(index, variant.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleFormSubmit}
            className="bg-blue-500 mt-10 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            {updationData ? "Update" : "Submit"}
          </button>
        </div>
      </div>


      {CreateBrandModal && (
        <CreateBrandModal
          isOpen={isOpenBrandModal}
          onClose={() => {
            setIsOpenBrandModal(false);
          }}
          onSubmit={async () => {
            const brandResponse = await getAllBrand();

            if (
              brandResponse.data &&
              brandResponse.data.message == "All brands retrieved successfully!"
            ) {
              setBrandList(brandResponse.data.data);
              setIsOpenBrandModal(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default AddLooseVarient;
