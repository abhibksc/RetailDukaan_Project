import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import {
  checkSkuExists,
  storeloose_Varient,
  storePacket_Varient,
} from "../../../CrudOperations/PostOperation";
import { UpdateLooseVarientData, UpdatePacketVarientData } from "../../../CrudOperations/Update&Edit";
import {
  getAllBrand,
  getAllDiscounts,
  getAllLooseStock,
  getAllLooseVarient,
  getAllPacketStock,
  getAllPurchase,
  getAllUnit,
  GetwareHouses,
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../../CrudOperations/GetOperation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deltetePacketVarientImages } from "../../../CrudOperations/DeleteOperation";
// 

const AddPacketVarient = ({
  closeModal,
  onSubmit,
  EditPacketVarients,
  onUpdate,
}) => {
  const [purchases_id, setPurchases_id] = useState("");
  const [purchase_item_id, setPurchase_item_id] = useState("");
  const [packet_stock_id, setpacket_stock_id] = useState("");
  const [sku_id, setSku_id] = useState("");
  const [brand_id, setBrand_id] = useState("");
  const [quantity_unit, setQuantity_unit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [mrp, setMrp] = useState("");
  const [discount_id, setDiscount_id] = useState("");
  const [packet_size, setPacket_size] = useState("");
  const [selling_price_per_packet, setselling_price_per_packet] = useState("");
  const [limit_per_order, setlimit_per_order] = useState("");
  const [warehouse_id, setwarehouse_id] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [subCategory_id, setSubCategoryId] = useState("");
  const [sub_subCategory_id, setSub_SubCategoryId] = useState("");

  const [cartCount, setCartCount] = useState(0);
  const [isVibrating, setIsVibrating] = useState(false);

  const [verifyskuId, setVarifySku] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state to track verification status

  const [PurchasedList, setPurchasedList] = useState([]);
  const [UnitList, setUnitList] = useState([]);
  const [loose_stockList, setLoose_stockList] = useState([]);
  const [brandList, setbrandList] = useState([]);
  const [warehouseList, setWareHouseList] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);
  const [SubCategoryList, setSubCategoryList] = useState([]);
  const [Sub_SubCategoryList, setSub_SubCategoryList] = useState([]);

  const [images, setImages] = useState([]); // Array to hold uploaded images
  const [selectedFile, setSelectedFile] = useState(null); // Currently selected file
  const [isCartModalOpen, setiCartModalOpen] = useState(false);
  const [imageCartItem, setImageCartItem] = useState([]);

  console.log(EditPacketVarients);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all the data concurrently
        const [
          purchaseResponse,
          unitResponse,
          brandResponse,
      packetStockResponse,
          warehouseResponse,
          DiscountResponse,
          Category,
          Sub_Category,
          Sub_subCategory,
        ] = await Promise.all([
          getAllPurchase(),
          getAllUnit(),
          getAllBrand(),
          getAllPacketStock(),
          GetwareHouses(),
          getAllDiscounts(),

          Show_Users_MainCategory(),
          Show_users_SubCategory(),
          Show_Users_Sub_SubCategory(),
        ]);

        // Check and set purchased list
        if (
          purchaseResponse.data.message ===
          "All purchases retrieved successfully!"
        ) {
          console.log("Vhalapurchasebabu");
          console.log(purchaseResponse);
          
          
          setPurchasedList(purchaseResponse.data.data);
        }

        // Check and set unit list
        if (unitResponse.data.message === "All unit retrieved successfully!") {
          setUnitList(unitResponse.data.data);
        }

        console.log("ahbih");

        // Check and set loose stock list
        console.log(packetStockResponse);
        
        if (
          packetStockResponse.data.message ===
          "All packet_stock retrieved successfully!"
        ) {
          console.log("ahbih");

          setLoose_stockList(packetStockResponse.data.data);
        }

        // Check and set brand list
        if (
          brandResponse.data.message === "All brands retrieved successfully!"
        ) {
          setbrandList(brandResponse.data.data);
        }

        // Check and set discount list
        if (
          DiscountResponse.data.message ===
          "All discounts retrieved successfully!"
        ) {
          setDiscountList(DiscountResponse.data.data);
        }

        // Check and set warehouse list
        if (warehouseResponse) {
          console.log(warehouseResponse);

          setWareHouseList(warehouseResponse.data);
        }

        if (Category.data) {
          console.log("Category Cahal");

          setCategoryList(Category.data);
        }
        if (Sub_Category.data) {
          console.log("SubCategory Cahal");

          setSubCategoryList(Sub_Category.data);
        }
        if (Sub_subCategory.data) {
          console.log("SubSubCategory Cahal");

          setSub_SubCategoryList(Sub_subCategory.data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Populate fields if a Brand is being edited
  useEffect(() => {
    if (EditPacketVarients) {
      console.log(EditPacketVarients);

      setVarifySku(true);

      setPurchases_id(EditPacketVarients.purchases_id);
      setpacket_stock_id(EditPacketVarients.packet_stock_id);
      setSku_id(EditPacketVarients.sku_id);
      setBrand_id(EditPacketVarients.brand_id);
      setQuantity_unit(EditPacketVarients.quantity_unit);
      setQuantity(EditPacketVarients.quantity);
      setselling_price_per_packet(EditPacketVarients.selling_price_per_packet);
      setlimit_per_order(EditPacketVarients.limit_per_order);
      setwarehouse_id(EditPacketVarients.warehouse_id);

      setDiscount_id(EditPacketVarients.discount_percentage_id);
      setPacket_size(EditPacketVarients.warehouse_id);
      setMrp(EditPacketVarients.warehouse_id);

      setImages(EditPacketVarients.images);

      setCategoryId(EditPacketVarients.category_id);
      setSubCategoryId(EditPacketVarients.subCategory_id);
      setSub_SubCategoryId(EditPacketVarients.sub_subCategory_id);



      

      // setImages(EditPacketVarients.warehouse_id);
      // setImageCartItem(EditPacketVarients.warehouse_id);
    } else {
      setPurchases_id("");
      setpacket_stock_id("");
      setSku_id("");
      setBrand_id("");
      setQuantity_unit("");
      setQuantity("");
      setselling_price_per_packet("");
      setlimit_per_order("");
      setwarehouse_id("");
      setMrp("");
      setDiscount_id("");
      setPacket_size("");
      setImages("");
      setImageCartItem("");
    }
  }, [EditPacketVarients]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let formData = {
      purchases_id,
      purchase_item_id,
      packet_stock_id,
      sku_id,
      brand_id,
      quantity_unit,
      quantity,

      mrp,
      discount_id,
      packet_size,

      selling_price_per_packet,
      limit_per_order,
      warehouse_id,
      images,

      category_id,
      subCategory_id,
      sub_subCategory_id,
    };
    console.log(formData);


    

    try {
      let response;

      if (EditPacketVarients) {

        const i = images.filter((ele) => ele instanceof File);
        console.log(i);

        formData = {...formData,images : i };

        console.log(formData);
        


        console.log(EditPacketVarients);

        response = await UpdatePacketVarientData({
          id: EditPacketVarients.id,
          formData,
        });
        console.log(response);

        if (response.data.message === "packet_variant updated successfully") {
          onUpdate(); // Handle updated data
        }
      } else {
        // Add new Brand
        response = await storePacket_Varient({ formData });
        console.log(response);

        if (response.data.message === "Packet variant saved successfully!") {
          const newBrand = { ...formData, id: response.data.data.id };
          onSubmit(newBrand); // Handle new data
        }
      }
    } catch (error) {
      toast.error("Failed to save Brand. Please try again.");
    }
  };

  const handleItemId = (e) => {
    // Log the raw value from the select element
    console.log("Raw value:", e.target.value);

    // Check if a value was selected
    if (e.target.value) {
      try {
        const data = loose_stockList.find(
          (ele) => ele.id === Number(e.target.value)
        );

        setpacket_stock_id(e.target.value);
        setPurchases_id(data.purchase_id);
        setPurchase_item_id(data.purchase_item_id)
      } catch (error) {
        // Log an error if parsing fails
        console.error("Error parsing selected item:", error);
      }
    } else {
      // Handle the case when no item is selected (optional)
      setpacket_stock_id("");
      setPurchases_id("");
    }
  };

  useEffect(() => {
    console.log(purchases_id);
  }, [purchases_id]);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      setImages((prevImages) => [...prevImages, selectedFile]); // Add new image to the array
      setCartCount(images.length);
      setIsVibrating(true);
      setSelectedFile(null); // Clear the selected file
      toast.success("Image added: " + selectedFile.name);
    }

    // Stop vibrating after 1 second
    setTimeout(() => {
      setIsVibrating(false);
    }, 1000);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove image by index
  };

  const addToCart = () => {
    setCartCount(cartCount + 1);
    setIsVibrating(true);

    // Stop vibrating after 1 second
    setTimeout(() => {
      setIsVibrating(false);
    }, 1000);
  };

  // handleCartImageDelete

  const handleCartImageDelete = async (id) => {
    if (EditPacketVarients) {
      const response = await deltetePacketVarientImages(id);
      if (
        response.data.message === "packet_varient_image deleted successfully"
      ) {
        console.log("Chala");
        console.log(images);

        setImages((prevImages) => prevImages.filter((_, i) => i !== id));
        setImageCartItem((prevImages) => prevImages.filter((_, i) => i !== id));
      }
    } else {
      setImages((prevImages) => prevImages.filter((_, i) => i !== id));
      setImageCartItem((prevImages) => prevImages.filter((_, i) => i !== id));
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 ">
      <div className="bg-white rounded-lg p-4 w-1/3 shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold mb-3">
            {isVibrating
              ? "Item Added!"
              : EditPacketVarients
              ? "Edit Varient"
              : "Add Packet Varient"}
          </h2>

          {images.length > 0 && (
            <div className="relative">
              <button
                className="bg-blue-400 p-4 rounded-full flex items-center"
                onClick={() => {
                  setImageCartItem(images);
                  setiCartModalOpen(true);
                }}
              >
                <ShoppingCartIcon
                  className={`h-6 w-6 ${isVibrating ? "vibrate" : ""}`}
                />

                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs">
                  {images.length}
                </span>
              </button>
            </div>
          )}
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="mb-2">
            <label className="block text-gray-700">Item</label>
            <select
              value={packet_stock_id}
              onChange={handleItemId}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              {console.log(loose_stockList)
              }
              <option value="">Select Item</option>
              {loose_stockList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.ItemName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">SKU</label>
            <input
              disabled={verifyskuId}
              type="text"
              value={sku_id}
              onChange={(e) => setSku_id(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
            {!verifyskuId && (
              <button
                type="button"
                onClick={handleVerifySku}
                disabled={isVerifying}
                className={`mt-2 py-1 px-6 rounded-md ${
                  isVerifying ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {isVerifying
                  ? "Verifying..."
                  : verifyskuId
                  ? "Verified"
                  : "Check"}
              </button>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Brand</label>
            <select
              disabled={!verifyskuId}
              value={brand_id}
              onChange={(e) => setBrand_id(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              <option value="">Select Brand</option>
              {brandList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.brand_name}
                </option>
              ))}
            </select>
          </div>

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

          <div className="mb-2">
            <label className="block text-gray-700">Sub Category</label>
            <select
              value={subCategory_id}
              onChange={(e) => setSubCategoryId(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              disabled={!category_id}
            >
              <option value="">Select SubCategory</option>
              {filteredSubCategories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Sub SubCategory</label>
            <select
              value={sub_subCategory_id}
              onChange={(e) => setSub_SubCategoryId(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              disabled={!subCategory_id}
            >
              <option value="">Select Sub SubCategory</option>
              {filteredSubSubCategories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Quantity</label>
            <input
              disabled={!verifyskuId}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Unit</label>
            <select
              disabled={!verifyskuId}
              value={quantity_unit}
              onChange={(e) => setQuantity_unit(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              <option value="">Select Unit</option>
              {UnitList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">MRP</label>
            <input
              disabled={!verifyskuId}
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Discount</label>
            <select
              disabled={!verifyskuId}
              value={discount_id}
              onChange={(e) => setDiscount_id(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              {console.log(discountList)
              }
              <option value="">Select Discount</option>
              {discountList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.discount_percentage}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">
              Selling Price Per Packet
            </label>
            <input
              disabled={!verifyskuId}
              type="number"
              value={selling_price_per_packet}
              onChange={(e) => setselling_price_per_packet(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Packet Size</label>
            <input
              disabled={!verifyskuId}
              type="number"
              value={packet_size}
              onChange={(e) => setPacket_size(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Limit per Order</label>
            <input
              disabled={!verifyskuId}
              type="number"
              value={limit_per_order}
              onChange={(e) => setlimit_per_order(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Warehouse</label>
            <select
              disabled={!verifyskuId}
              value={warehouse_id}
              onChange={(e) => setwarehouse_id(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              <option value="">Select Warehouse</option>
              {warehouseList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.warehouse_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 col-span-2">
            <div className="relative w-10 h-10 border border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center rounded-md">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                aria-label="Upload image"
              />
              <span className="text-gray-600">+</span>
            </div>

            {selectedFile && (
              <div className="mt-2 text-sm text-gray-700">
                Selected File: <strong>{selectedFile.name}</strong>
              </div>
            )}

            <button
              onClick={handleUploadClick}
              className={`mt-2 py-1 px-3 rounded-md font-semibold text-white ${
                selectedFile
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!selectedFile}
            >
              {selectedFile ? "Add Image" : "No file selected"}
            </button>
          </div>


          <div className="mb-2 col-span-2 flex justify-end space-x-4">
    <button
      type="button"
      onClick={closeModal} // Define this function to handle the cancel action
      className="py-2 px-6 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="py-2 px-6 rounded-md bg-green-500 hover:bg-green-600 text-white"
    >
      Save
    </button>
  </div>

         
        </form>
      </div>

      {/* isCartModalOpen Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white table-auto border rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {["Images", "Delete"].map((heading) => (
                      <th key={heading} className="py-3 px-4 text-center">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {imageCartItem.length > 0 ? (
                    imageCartItem.map((p, index) => (
                      <tr key={index + 1} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-center">
                          <div className="mb-2">
                            <div className="flex items-center justify-center">
                              <label className="relative w-24 h-24 border border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center rounded-full">
                                <input
                                  type="file"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];

                                      setImages((prevCart) =>
                                        prevCart.map((item, i) =>
                                          i === index ? file : item
                                        )
                                      );

                                      setImageCartItem((prevCart) =>
                                        prevCart.map((item, i) =>
                                          i === index ? file : item
                                        )
                                      );
                                    }
                                  }}
                                />
                                {p ? (
                                  <img
                                    src={(() => {
                                      try {
                                        return p instanceof File
                                          ? URL.createObjectURL(p)
                                          : p.image_url;
                                      } catch (error) {
                                        console.error(
                                          "Error generating image URL:",
                                          error
                                        );
                                        return ""; // Fallback in case of error
                                      }
                                    })()}
                                    alt="Uploaded"
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <span className="text-gray-500">Upload</span>
                                )}
                              </label>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              EditPacketVarients
                                ? handleCartImageDelete(p.id)
                                : handleCartImageDelete(index)
                            }
                            title="Delete Image"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="py-3 text-center">
                        No Image found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setiCartModalOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 mt-7 ml-24 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPacketVarient;
