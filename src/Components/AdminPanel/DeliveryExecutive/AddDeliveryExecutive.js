import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  GetAllCreatedDeliveryExecutive,
  GetAllCreatedItems,
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../CrudOperations/GetOperation";
import {
  CreteDeliveryExecutive,
  CreteItems,
} from "../../CrudOperations/PostOperation";
import {
  ChangeDeliveryExecutiveStatus,
  ChangeItemStatus,
} from "../../CrudOperations/Update&Edit";
import { deleteStoredItem } from "../../CrudOperations/DeleteOperation";
import PaginationExample from "../Stocks/Purchase/PaginationExample";

const AddDeliveryExecutive = () => {
  const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
  const itemsPerPage = 9; // Items per page

  const [passwordd, setPasswordd] = useState("");
  const [errors, setErrors] = useState([]);

  const location = useLocation();
  const [filteredLooseVarientList, setFilteredLooseVarientList] = useState([]);

  const [category_id, setCategoryId] = useState("");

  const [Status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  //   const [category_id, setCategoryId] = useState("");
  const [subCategory_id, setSubCategoryId] = useState("");
  const [sub_subCategory_id, setSub_SubCategoryId] = useState("");
  const [CategoryList, setCategoryList] = useState([]);
  const [SubCategoryList, setSubCategoryList] = useState([]);
  const [Sub_SubCategoryList, setSub_SubCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ExecutiveList, setExecutiveList] = useState([]);

  const validatePassword = (password) => {
    const validationErrors = [];

    // Minimum length
    if (password.length < 8) {
      validationErrors.push("Password must be at least 8 characters long.");
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      validationErrors.push(
        "Password must contain at least one uppercase letter."
      );
    }

    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
      validationErrors.push(
        "Password must contain at least one lowercase letter."
      );
    }

    // At least one digit
    if (!/\d/.test(password)) {
      validationErrors.push("Password must contain at least one number.");
    }

    // At least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      validationErrors.push(
        "Password must contain at least one special character."
      );
    }

    return validationErrors;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Validate the password and set errors
    const validationErrors = validatePassword(value);
    setErrors(validationErrors);
  };

  // Fetch Categories, Subcategories, and Sub-Subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ExecutiveResponse] = await Promise.all([
          GetAllCreatedDeliveryExecutive(),
        ]);
        if (
          ExecutiveResponse.data.message ===
          "All executive retrieved successfully!"
        )
          setExecutiveList(ExecutiveResponse.data.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !password || !address) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const formDataa = {
        name,
        phone,
        email,
        password,
        address,
      };
      console.log(formDataa);
      const response = await CreteDeliveryExecutive({ formDataa });
      console.log(response);

      if (
        response.data.message ===
        "Created New delivery_executives successfully!"
      ) {
        const getItems = await GetAllCreatedDeliveryExecutive();
        if (getItems.data.message === "All executive retrieved successfully!") {
          console.log(getItems.data.data);
          setExecutiveList(getItems.data.data);
          toast.success("New Delivery Executive Created!");

          setName(""),
            setPhone(""),
            setEmail(""),
            setPassword(""),
            setAddress("");
        }
      } else if (response.data.message == "Email Already Exists") {
        toast.warn(response.data.message);
        setLoading(false);
      } else if (response.data.message == "Phone Number Already Exists") {
        toast.warn(response.data.message);
        setLoading(false);
      } else if (response.data.message) {
        console.log("Chalaaaaaaaaaa");
        toast.warn(response.data.message);
      }
    } catch (error) {
      // console.error("Error submitting data:", error);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  //   handleStatus

  const handleStatus = async (id, e) => {
    console.log(e.target.value);
    setLoading(true);
    const response = await ChangeDeliveryExecutiveStatus({
      id,
      Status: e.target.value,
    });
    console.log(response);

    if (
      response.data.message ===
      "Delivery Executive Status updated successfully!"
    ) {
      const getItems = await GetAllCreatedDeliveryExecutive();
      if (getItems.data.message === "All executive retrieved successfully!") {
        console.log(getItems.data.data);
        setExecutiveList(getItems.data.data);
        toast.success("Status Updated successfully!");
      }

      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    console.log(id);

    const response = await deleteStoredItem({ id });
    if (
      response.data.message ===
      "Stored Item and related entries deleted successfully!"
    ) {
      const getItems = await GetAllCreatedItems();
      if (getItems.data.message === "All Items retrieved successfully!") {
        console.log(getItems.data.data);
        setExecutiveList(getItems.data.data);
        toast.success("Item Deleted successfully!");
      }
    }
  };

  const filteredExecutiveList = ExecutiveList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the page count (total items divided by items per page)
  const pageCount = Math.ceil(filteredExecutiveList.length / itemsPerPage);

  // Slice the items array to only show items for the current page
  const currentItems = filteredExecutiveList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return loading ? (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  ) : (
    <div className=" mx-auto p-8 bg-gradient-to-br from-cyan-50 via-purple-50 to-indigo-50 rounded-lg shadow-2xl">
      <h1 className="text-4xl border-b-2 w-2/5 mx-auto font-extrabold text-center text-indigo-700 mb-8">
        Hire a Delivery Executive
      </h1>
      <form className="space-y-10">
        {/* Personal Information Section */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 border-b-2 border-indigo-300 pb-3 mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter full name"
                className="border border-indigo-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                placeholder="Enter phone number"
                className="border border-indigo-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter email address"
                className="border border-indigo-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                value={password}
                onChange={handlePasswordChange}
                type="password"
                placeholder="Enter a secure password"
                className={`border p-3 w-full rounded-lg ${
                  errors.length > 0
                    ? "border-red-500 focus:ring-red-500"
                    : "border-indigo-300 focus:ring-indigo-500"
                } focus:outline-none focus:ring-2`}
                required
              />
              <div
                className={`text-sm mt-1 ${
                  errors.length > 0 ? "text-red-500" : "text-transparent"
                }`}
              >
                {errors.length > 0 && <span>{errors[0]}</span>}
              </div>
            </div>
          </div>
        </div>
  
        {/* Address Section */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 border-b-2 border-indigo-300 pb-3 mb-6">
            Address Details
          </h2>
          <div>
            <label className="block text-gray-700 font-medium">Residential Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="Enter address"
              className="border border-indigo-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
  
        {/* Submit Section */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg transition-transform transform hover:scale-105"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
  
  
  




};

export default AddDeliveryExecutive;
