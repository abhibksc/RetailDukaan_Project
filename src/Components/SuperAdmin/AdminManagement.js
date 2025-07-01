import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAllCreatedDeliveryExecutive, GetAllCreatedItems, GetAllroles, showroles } from '../CrudOperations/GetOperation';
import { CreteDeliveryExecutive, CreteRoles } from "../CrudOperations/PostOperation";
import { ChangeDeliveryExecutiveStatus, ChangeRoleStatus } from "../CrudOperations/Update&Edit";
import { deleteStoredItem } from "../CrudOperations/DeleteOperation";
import PaginationExample from "../PaginationExample";





const AdminManagement = () => {
  const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
  const itemsPerPage = 9; // Items per page

  const [errors, setErrors] = useState([]);


  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");

  //   const [category_id, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [RolesList, setRolesList] = useState([]);

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
        const [rolesResponse] = await Promise.all([
          GetAllroles(),
        ]);
        
        if (
          rolesResponse.data.message ===
          "All roles retrieved successfully!"
        )
          setRolesList(rolesResponse.data.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {

    console.log("Cahallaaaa");
    
    e.preventDefault();
    if (!name || !phone || !email || !password || !address || !role) {
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
        role,
      };
      console.log(formDataa);

      
      const response = await CreteRoles({ formDataa });
      console.log(response);

      if (
        response.data.message == "Role added successfully"
      ) {
        const getItems = await GetAllroles();
        console.log(getItems);
        
        if (
          getItems.data.message ===
          "All roles retrieved successfully!"
        ) {
          console.log(getItems.data.data);
          setRolesList(getItems.data.data);
          toast.success("New roles Created!");

          setName(""),
            setPhone(""),
            setEmail(""),
            setPassword(""),
            setAddress("");

            setRole("");
        }
      } 
      
      else if (response.data.message == "Email Already Exists") {
        toast.warn(response.data.message);
        setLoading(false);
      } else if (response.data.message == "Phone Number Already Exists") {
        toast.warn(response.data.message);
        setLoading(false);
      } else if (response.data.message) {
        console.log("Chalaaaaaaaaaa");
        toast.warn(response.data.message);
      }
      else{
        console.log("Chala");
        
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
    const response = await ChangeRoleStatus({
      id,
      Status: e.target.value,
    });
    console.log(response);

    if (
      response.data.message === "Role status updated successfully"
    ) {

      console.log("fsdfsdfdsf");
      
      const getItems = await GetAllroles();
        console.log(getItems);
        
        if (
          getItems.data.message ===
          "All roles retrieved successfully!"
        ) {
          console.log(getItems.data.data);
          setRolesList(getItems.data.data);
          toast.success("New roles Created!");
            setName(""),
            setPhone(""),
            setEmail(""),
            setPassword(""),
            setAddress("");
            setRole("");
            setLoading(false);
        }
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
        setRolesList(getItems.data.data);
        toast.success("Item Deleted successfully!");
      }
    }
  };

  const filteredRolesList = RolesList.filter(
    (item) => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  // Calculate the page count (total items divided by items per page)
  const pageCount = Math.ceil(filteredRolesList.length / itemsPerPage);

  // Slice the items array to only show items for the current page
  const currentItems = filteredRolesList.slice(
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
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-2 ">Add Role</h1>

      {/* Add Item Form */}
      <div className="grid grid-cols-4 gap-5 border-b-2 p-2  pb-5">
        <div className="mb-2">
          <label className="block text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter item name"
            className="border border-gray-300 p-1 w-full rounded-md"
            required
          />
        </div>

        {/* Number Dropdown */}

        <div className="mb-2">
          <label className="block text-gray-700">Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="number"
            placeholder="Enter Number"
            className="border border-gray-300 p-1 w-full rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <label className="block text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
            className="border border-gray-300 p-1 w-full rounded-md"
            required
          />
        </div>

        {/* password */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            value={password}
            onChange={handlePasswordChange}
            type="text"
            placeholder="Enter Password"
            className={`border p-1 w-full rounded-md ${
              errors.length > 0 ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {/* Add a fixed-height container for error messages */}
          <div
            className={`text-sm mt-1 ${
              errors.length > 0 ? "text-red-500" : "text-transparent"
            }`}
            style={{ minHeight: "1.25rem" }} // Ensures consistent height
          >
            {errors.length > 0 && (
              <>
                {/* {errors.map((error, index) => (
          // <p key={index}>{error}</p>
          toast.warn(error)
        ))} */}
              </>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mb-2">
          <label className="block text-gray-700">Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="Enter Address"
            className="border border-gray-300 p-1 w-full rounded-md"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            type="text"
            placeholder="Enter role"
            className="border border-gray-300 p-1 w-full rounded-md"
            required
          />
        </div>



        <div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className=" bg-blue-600 text-white py-2 px-4 mt-6 rounded"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between mt-5 items-center">
        <input
          type="text"
          placeholder="Search Items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 border p-3 rounded-md"
        />
      </div>


      {/* Product Table */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Delivery Executives</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">S.no</th>
              <th className="py-2 px-4 border">role</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border text-center">{index + 1}</td>
                <td className="py-2 px-4 border text-center">{item.role}</td>
                <td className="py-2 px-4 border text-center">{item.name}</td>
                <td className="py-2 px-4 border text-center">{item.phone}</td>
                <td className="py-2 px-4 border text-center">{item.email}</td>
                <td className="py-2 px-4 border text-center">{item.address}</td>
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

export default AdminManagement;
