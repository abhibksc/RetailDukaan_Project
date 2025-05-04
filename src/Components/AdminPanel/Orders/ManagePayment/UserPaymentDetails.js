import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GetPaymentDetailResponse } from "../../../CrudOperations/GetOperation";

const UserPaymentDetails = () => {
  const merchant = {
    name: "Nitish Gupta",
    email: "ntishishgupta@example.com",
    contact: "+91 8378298818",
    businessName: "Retail Dukaan",
    address: "Guruduwara Rd, Chas, Bokaro",
    services: ["Wholesale Supply", "Retail Management", "Customer Support"],
  };



  const param = useParams();

  useEffect(() => {


    if(param.orderId){

    console.log(param.orderId);


 const fun = async()=>{

    const paymentDetailsRespones = await GetPaymentDetailResponse(param.orderId);
    console.log(paymentDetailsRespones);
    

 }
 fun();


    }

    
    

  }, [param]);

  return (
    <div className="md:w-full lg:w-full xl:max-w-5xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg relative">
      {/* Edit Button */}
      <button
        className="absolute top-4 right-4 px-8 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
        onClick={() => alert("Edit functionality coming soon!")}
      >
        Edit
      </button>

      {/* Merchant Details */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{merchant.name}</h1>
        <p className="text-gray-600 text-lg">{merchant.businessName}</p>
        <p className="text-gray-500 mt-2">{merchant.address}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Contact Details */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Contact Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium text-gray-600">Email: </span>
              <span className="text-gray-800">{merchant.email}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Phone: </span>
              <span className="text-gray-800">{merchant.contact}</span>
            </p>
          </div>
        </section>

        {/* Profile Summary */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Profile Summary
          </h2>
          <p className="text-gray-700">No summary provided yet.</p>
        </section>
      </div>
    </div>
  );
};

export default UserPaymentDetails;
