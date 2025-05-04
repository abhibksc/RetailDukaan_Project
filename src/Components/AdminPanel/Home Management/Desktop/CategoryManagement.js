import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Tone from 'tone';
import { useNavigate } from "react-router-dom";
import { GetAllCreatedItems, GetallHomeManagmentCategorys, getDesktopHomeManagementCategory, Show_Users_MainCategory, Show_Users_Sub_SubCategory, Show_users_SubCategory } from "../../../CrudOperations/GetOperation";
import { CreateHomeManagementCategory, CreateOffer } from "../../../CrudOperations/PostOperation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import LoadingModal from "../../../LoadingModal";
import { DeleteCreatedOffer, destroyDesktopHomeManagementCategory } from "../../../CrudOperations/DeleteOperation";
import { changeHomeManagementCategoryStatus, ChangeOfferStatus } from "../../../CrudOperations/Update&Edit";





const CategoryManagement = () => {
  const [item_id, setItem_Id] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [unit_value, setUnitValue] = useState("");
  const [purchase_item_id, setPurchase_item_id] = useState("");
  const [category_id, setCategoryId] = useState("");

  const [PostedDate, setPostedDate] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const [CategoryTitle, setCategoryTitle] = useState("");
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

  const [HomeManagementList, setHomeManagementList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allHomeManagmentCategory,items, Category, Sub_Category, Sub_subCategory] =
          await Promise.all([
            getDesktopHomeManagementCategory(),
            GetAllCreatedItems(),
            Show_Users_MainCategory(),
            Show_users_SubCategory(),
            Show_Users_Sub_SubCategory(),
          ]);
        console.log(items);

        if (allHomeManagmentCategory.data.message === "HomeManagementCategoryData retrieved successfully."){
          console.log(allHomeManagmentCategory);
          
            setHomeManagementList(allHomeManagmentCategory.data.HomeManagementCategoryData);
        }
        if (items.data.message === "All Items retrieved successfully!"){
            setItemList(items.data.data);
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
    setLoading(true);
    // const filterUnit = FilterUnitList.find((ele)=>ele.id === )
    const formDataa = {
      device : "Desktop",
        PostedDate,
        CategoryTitle,
        category_id ,
        subCategory_id ,
        sub_subCategory_id ,
        Status,
    };
    console.log(formDataa);
     const response = await CreateHomeManagementCategory({ formDataa });
     console.log(response);
      if (response && response.data.message === "Home Management Category saved successfully!") {


const getlistresponse = await getDesktopHomeManagementCategory();



if (getlistresponse.data.message === "HomeManagementCategoryData retrieved successfully."){
  console.log(getlistresponse);
  
    setHomeManagementList(getlistresponse.data.HomeManagementCategoryData);
    setPostedDate(""),
    setCategoryTitle(""),
    setCategoryId("") ,
    setSubCategoryId("") ,
    setSub_SubCategoryId("") ,
    setStatus(""),

    toast.success(response.data.message)
    const synth = new Tone.Synth().toDestination();
    await Tone.start(); // Required to unlock audio context in modern browsers
    synth.triggerAttackRelease("C4", "8n"); // Plays a "C4" note for a short duration

    setLoading(false);
}











       
      }
      else{
        toast.error(response.data.message)
        setLoading(false);
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


    const handleStatus = async (id, e) => {
      console.log(e.target.value);
      setLoading(true);
      const response = await changeHomeManagementCategoryStatus({ id, Status: e.target.value });
      if (response.data.message === "Home Management Category Status updated successfully!") {


        const getlistresponse = await getDesktopHomeManagementCategory();



        if (getlistresponse.data.message === "HomeManagementCategoryData retrieved successfully."){
          console.log(getlistresponse);
          
            setHomeManagementList(getlistresponse.data.HomeManagementCategoryData);
        
        
        
            const synth = new Tone.Synth().toDestination();
            await Tone.start(); // Required to unlock audio context in modern browsers
            synth.triggerAttackRelease("C4", "8n"); // Plays a "C4" note for a short duration
            toast.success("deleted successfully!");
            setLoading(false);
        }
        else{
          toast.error(response.data.message);
        }



      }
      else{
        toast.error(response.data.message);
      }
      setLoading(false);
  
    };


      const handleDeleteHomeManagementCategory = async (id) => {
        setLoading(true);
        try {
          const response = await destroyDesktopHomeManagementCategory(id);
          if (response.data.message == "HomeManagementCategory deleted successfully") {



            const getlistresponse = await getDesktopHomeManagementCategory();



if (getlistresponse.data.message === "HomeManagementCategoryData retrieved successfully."){
  console.log(getlistresponse);
  
    setHomeManagementList(getlistresponse.data.HomeManagementCategoryData);



    const synth = new Tone.Synth().toDestination();
    await Tone.start(); // Required to unlock audio context in modern browsers
    synth.triggerAttackRelease("C4", "8n"); // Plays a "C4" note for a short duration
    toast.success("deleted successfully!");
    setLoading(false);
}









          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("Error deleting HomeManagementCategory.");
        }
      };

      if (loading) return <div> <LoadingModal/>  </div>;


  return (
    <div className="p-6 bg-white rounded shadow-md">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <h1 className="text-xl font-bold mb-2 ">Create Home Management Category</h1>

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

        {/* CategoryTitle Input */}
        <div>
          <label className="block font-medium">Category Title</label>
          <input
            type="text"
            name="CategoryTitle"
            value={CategoryTitle}
            onChange={(e) => setCategoryTitle(e.target.value)}
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

        {/* Sub-SubCategory Dropdown */}
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


<div>
                {/* Submit Button */}
                <button
        onClick={handleFormSubmit}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
</div>


      </div>









        {/* Responsive table wrapper */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Category Title",
                      "Posted Date",
                      "Category Type",
                      "Device",
                      "Status",
                      "Delete",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="py-3 px-4 text-center font-semibold text-gray-700"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HomeManagementList.length > 0 ? (
                    HomeManagementList.map((p) => (
                      <tr
                        key={`${p.id}-${p.Category_title}`}
                        className="border-b transition-colors duration-200 hover:bg-gray-50"
                      >
                               <td className="py-3 px-4 text-center">{p.Category_title}</td>
                               <td className="py-3 px-4 text-center">{p.PostedDate}</td>
                        <td className="py-3 px-4 text-center">{p.Category_type}</td>
                        <td className="py-3 px-4 text-center">{p.device}</td>
                        <td className="py-3 px-4 text-center">
      
                        <div className="mb-2">
                          <select
                            id="Status"
                            value={p.status}
                            onChange={(e) => handleStatus(p.HomeManagement_id, e)}
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
      
      
                        </td>
      
      
      
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteHomeManagementCategory(p.HomeManagement_id)}
                            className="text-red-500 transition-colors duration-200 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-3 text-center text-gray-600">
                        No Category found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
      
    </div>
  );
};

export default CategoryManagement;
