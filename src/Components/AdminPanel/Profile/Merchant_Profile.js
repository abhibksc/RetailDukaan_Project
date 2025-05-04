import React, { useEffect, useState } from "react";
import axios from "axios";
import { UpdateMerchantProfile } from "../../CrudOperations/Update&Edit";
import { GetMerchantDetails } from "../../CrudOperations/GetOperation";

const MerchantProfile = () => {
  const [merchant, setMerchant] = useState({
    name: "",
    email: "",
    contact: "",
    storeName: "",
    address: "", // Ensure this is initialized with an empty string
    gstin: "",
    role: "",
    pan: "",
    services: "",
  });

  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const fetchMerchantData = async () => { 

      const response = await GetMerchantDetails(); // Assuming this function fetches the merchant data

        console.log(response);

        if(response && response.Status === "Success") {
          setMerchant({
            name: response.data.name || "", // Ensure this is initialized with an empty string
            email: response.data.email || "",
            contact: response.data.phone  || "",
            storeName: response.data.store_name || "",
            address: response.data.address || "", // Ensure this is initialized with an empty string
            gstin: response.data.gstin || "",
            role: response.data.role || "",
            pan: response.data.pan || "",
            services: response.data.services || "",
          });
        }
      // setMerchant(response.data); // Assuming the response contains the merchant data





    }
    fetchMerchantData();
  }, []);

  const handleChange = (e) => {
    setMerchant({ ...merchant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await UpdateMerchantProfile(merchant);
    console.log(response);

    if(response?.data?.message === "Merchant profile updated successfully"){

      alert("Merchant profile updated successfully");



      const GetMerchantDetailsResponse = await GetMerchantDetails(); // Assuming this function fetches the merchant data

      console.log(GetMerchantDetailsResponse);

      if(GetMerchantDetailsResponse && GetMerchantDetailsResponse.Status === "Success") {
        setMerchant({
          name: GetMerchantDetailsResponse.data.name || "", // Ensure this is initialized with an empty string
          email: GetMerchantDetailsResponse.data.email || "",
          contact: GetMerchantDetailsResponse.data.phone || "",
          storeName: GetMerchantDetailsResponse.data.store_name   || "",
          address: GetMerchantDetailsResponse.data.address || "", // Ensure this is initialized with an empty string
          role: GetMerchantDetailsResponse.data.role || "",
          gstin: GetMerchantDetailsResponse.data.gstin || "",
          pan: GetMerchantDetailsResponse.data.pan || "",
          services: GetMerchantDetailsResponse.data.services || "",
        });
      }


      setIsEditing(false);





    }
    else {
      alert(response);
    }



  
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg relative">
      {!isEditing ? (
        <>
          <button
            className="absolute top-4 right-4 px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{merchant.name}</h1>
            <p className="text-gray-600 text-lg">{merchant.storeName}</p>
            <p className="text-gray-500 mt-2">{merchant.address}</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Contact Information</h2>
            <p><strong>Role:</strong> {merchant.role}</p>
            <p><strong>Email:</strong> {merchant.email}</p>
            <p><strong>Phone:</strong> {merchant.contact}</p>


            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-6 mb-4">Business Details</h2>
            <p><strong>GSTIN:</strong> {merchant.gstin}</p>
            <p><strong>PAN:</strong> {merchant.pan}</p>
            <p><strong>Services:</strong> {merchant.services}</p>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-50 rounded-lg overflow-auto max-h-[70vh]">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Merchant Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name*", name: "name", type: "text" },
              { label: "Email*", name: "email", type: "email" },
              { label: "Contact*", name: "contact", type: "text" },
              { label: "Store Name*", name: "storeName", type: "text" },
              { label: "Address*", name: "address", type: "text" },
              { label: "GSTIN*", name: "gstin", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={merchant[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-1">PAN</label>
            <textarea
              name="pan"
              value={merchant.pan}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-1">Services</label>
            <textarea
              name="services"
              value={merchant.services}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MerchantProfile;
