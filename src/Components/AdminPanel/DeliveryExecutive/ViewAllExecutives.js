import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAllCreatedDeliveryExecutive, GetAllCreatedItems } from "../../CrudOperations/GetOperation";
import { CreteDeliveryExecutive } from "../../CrudOperations/PostOperation";
import { ChangeDeliveryExecutiveStatus } from "../../CrudOperations/Update&Edit";
import { deleteStoredItem } from "../../CrudOperations/DeleteOperation";
import PaginationExample from "../../PaginationExample";

const ViewAllExecutives = () => {
  const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
  const itemsPerPage = 7; // Items per page

  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  //   const [category_id, setCategoryId] = useState("");
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
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  ) : (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg shadow-gray-500">


      {/* Product Table */}
      <div className="">
      <h1 className="text-lg font-inter font-bold mb-6 border-b-4 border-blue-500 pb-2 text-gray-700">Delivery Executives</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Id</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">Total Delivered</th>
              <th className="py-2 px-4 border">Wallet</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border text-center">{item.executive_unique_id}</td>
                <td className="py-2 px-4 border text-center">{item.name}</td>
                <td className="py-2 px-4 border text-center">{item.phone}</td>
                <td className="py-2 px-4 border text-center">{item.email}</td>
                <td className="py-2 px-4 border text-center">{item.address}</td>
                <td className="py-2 px-4 border text-center">
                  {item.totalDelivered_Order}
                </td>
                <td className="py-2 px-4 border text-center">{item.wallet}</td>
                <td className="py-2 px-4 border text-center">
                  <div className="mb-2">
                    {console.log(item.Status)}

                    <select
                      id="Status"
                      value={item.status}
                      onChange={(e) => handleStatus(item.id, e)}
                      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationExample
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ViewAllExecutives;
