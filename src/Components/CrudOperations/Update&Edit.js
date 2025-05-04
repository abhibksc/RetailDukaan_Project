import axios from "axios";
import qs from "qs"; // Import the querystring module

import { parsePhoneNumberFromString } from "libphonenumber-js";



import axios from "axios";
import baseurl from "./customURl";
import { log } from "tone/build/esm/core/util/Debug";


// ******************************************superadmin ___ superadmintoken  ********************************************


// ChangeDeliveryExecutiveStatus

export const ChangeRoleStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status);

  // Retrieve token from localStorage
  const token = localStorage.getItem("superadmintoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/superadmin/ChangeRoleStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    console.log("Purchase stored successfully:", response.data.message);
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(
        "Error posting purchase:",
        error.response.data.message || "An error occurred."
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

// ******************************************superadmin ___ superadmintoken  ********************************************
export const UpdateName = async (payload) => {
  const { name, registered, id } = payload;



    const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }


  try {
    const response = await axios.put(
      `${baseurl}/api/updateProfileName`,
      {
        name: name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    


    return response;
  } catch (error) {
    return error.response;
  }
};






export const UpdateMerchantProfile = async (merchant) => {
  console.log("Merchant Data Before Validation:", merchant);

  // Retrieve token
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }


  // Validate address
  if (!merchant.address || merchant.address.trim().length === 0) {
    return "Address is required.";
  }

  // Validate and format contact number
  const cleanedContact = merchant.contact.replace(/\+91\s+/, "+91"); 

  
  // Validate email
  if (!merchant.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchant.email)) {
   return "Invalid email format.";
  }

  // Validate GSTIN (Indian GST number format)
  if (!merchant.gstin || !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$/.test(merchant.gstin)) {
    return "Invalid GSTIN format.";
  }


  // Validate services (Convert to array if string)
  let servicesArray = merchant.services;
  if (typeof merchant.services === "string") {
    servicesArray = merchant.services.split(",").map((s) => s.trim());
  }
  if (!Array.isArray(servicesArray) || servicesArray.length === 0) {
    return "Services must be an array with at least one item.";
  }

  // Validate store name
  if (!merchant.storeName || merchant.storeName.trim().length === 0) {
   return "Store Name is required.";
  }




  // **Send API Request**
  try {
    const response = await axios.post(
      `${baseurl}/api/admin/update-merchant-profile`,
      {
        address: merchant.address,
        contact: cleanedContact,
        email: merchant.email,
        gstin: merchant.gstin,
        name: merchant.name,
        pan: merchant.pan || null,
        services: servicesArray,
        storeName: merchant.storeName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};




export const UpdatePan = async ({ panName, panNumber, token }) => {
  // Validate input
  if (!panName || !panNumber) {
    console.error("Missing required fields for profile update");
    return null; // Return null or throw an error based on your preference
  }

  try {
    const response = await axios.put(
      `${baseurl}/api/updatepancard`, // Update the URL as per your API endpoint
      {
        PanName: panName,
        PanNumber: panNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Profile updated successfully:", response.data);
    alert("Profile updated successfully!");

    return response.data; // Return response data
  } catch (error) {
    // Handle specific error cases
    if (error.response && error.response.data && error.response.data.message) {
      console.error("Error updating profile:", error.response.data.message);
      alert(`Error updating profile: ${error.response.data.message}`);
    } else {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }

    throw error; // Throw the error to handle it in the calling function if needed
  }
};

export const Update_Particular_addresss = async (combinedObject) => {
  const {
    full_addresss,
    address_type,
    alternate_phone,
    City,
    landmark,
    Locality,
    name,
    phone,
    pin_code,
    state,
    latitude,
    longitude,
    token,
    id,
  } = combinedObject;
  console.log(combinedObject);

  try {
    const response = await axios.put(
      `${baseurl}/api/addresses/${id}`,
      {
        full_addresss,
        address_type,
        alternate_phone,
        City,
        landmark,
        Locality,
        name,
        phone,
        pin_code,
        state,
        latitude,
        longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);

    if (response.data.address) {
      console.log("Address posted successfully:", response.data.address);

      return response.data.address;
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error("Error posting address:", error.response.data.message);
      // Handle specific error message
    } else {
      console.error("Error posting address:", error);
      // Handle generic error
    }
    throw error; // Re-throw the error for any higher-level error handling
  }
};

export const sendNumberOTP = async (payload) => {
  const {  phone  ,  registered ,token ,id } = payload;

  


  try {
    const response = await axios.post(
      `${baseurl}/api/SendUserMoblileOtp`,
      {
        input : phone,
        type : "phone",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
        'Accept': 'application/json',
        },
      }
    );

    console.log("OTP sent successfully:", response);

    return response;
  } catch (error) {

    return error.response;
  }
};

export const verifyNumberOtp = async (payload) => {
  const { phone, registered, token, number } = payload;

  // Ensure all required fields are present
  if (!registered  || !phone || !number) {
    console.error("Missing required fields for OTP verification");
    return;
  }

  try {
    const response = await axios.post(
      `${baseurl}/api/verify-otp`,
      {
        otp: phone,
        phone: number,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("OTP verified successfully:", response.data);

    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.message === "Invalid OTP") {
        alert(error.response.data.message);
      }
      console.error("Error verifying OTP:", error.response.data.message);
      alert(`Error verifying OTP: ${error.response.data.message}`);
    } else {
      console.error("Error verifying OTP:", error);
      alert("An error occurred while verifying the OTP.");
    }
  }
};

export const sendMailOTP = async (payload) => {
  const { mail, registered, token } = payload;

  // Ensure all required fields are present
  if (!registered  || !mail || !token) {
    return console.error("Missing required fields for OTP sending");
  }

  try {
    const response = await axios.post(
      `${baseurl}/api/send-update-customer-email-mobile-Otp`,
      {
        email: mail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("OTP sent successfully:", response.data);

    return response;
  } catch (error) {
    return error.response;

  }
};

// sendDeactivationOtp

export const sendDeactivationOtp = async () => {
  
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }


  try {
    const response = await axios.post(
      `${baseurl}/api/sendDeactivationOtp`,
      {
        Message : "Send Deactivate otp",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("OTP sent successfully:", response);

    return response;
  } catch (error) {
    return error.response;

  }
};

// verifyDeactivationOtp

export const verifyDeactivationOtp = async (payload) => {
  const { otp , type } = payload;


  


  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    const response = await axios.post(
      `${baseurl}/api/verifyDeactivationOtp`,
      {
        otp , type
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    return response;
  } catch (error) {
    return error.response;



  }
};

export const verifyMailOtp = async (payload) => {
  const { emailOtp, email, registered, token, id } = payload;


  


  if (!registered || !email) {
    console.error("Missing required fields for OTP verification");
    return;
  }

  try {
    const response = await axios.post(
      `${baseurl}/api/verify-otp`,
      {
        email: email,
        otp: emailOtp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    return response;
  } catch (error) {
    return error.response;



  }
};


export const verifyPhoneOtp = async (payload) => {
  const {  registered, token, id,


    input ,
    type ,
    otpId,
    otp

   } = payload;


  



  try {
    const response = await axios.post(
      `${baseurl}/api/VerifyUserMobileOtp`,
      {
        input ,
        type ,
        otpId,
        otp
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    return response;
  } catch (error) {
    return error.response;



  }
};

// update admin main category
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const Update_Main_Category = async (name, desktopImage, status, Category_id) => {


console.log(name);
console.log(Category_id);
console.log(desktopImage);


console.log(status);




  // Create a FormData instance
  const formData = new FormData();
  formData.append("name", name);
  formData.append("status", status);



  if (desktopImage && desktopImage instanceof File) {
    console.log(desktopImage);
    
    formData.append("category_desktop_Image", desktopImage); // Add the desktop_image file if it exists
  }



  try {
    // Get token from localStorage
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Send the PUT request with FormData
    const response = await axios.post(
      `${baseurl}/api/admin/updateMainCategory/${Category_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Specify multipart form data content type
        },
      }
    );

    console.log("Response:", response);

    // Return the updated category from the response
    return response;
  } catch (error) {

    return error.response;

  }
};


// export const Update_Main_Category_Swapping = async (newRows) => {

//   console.log("Chala1");

//   console.log(newRows);
  
  
  
  
  
  
  
  
  
  
  
//     try {
//       // Get token from localStorage
//       const token = localStorage.getItem("Merchanttoken");
  
//       if (!token) {
//         console.error("No Sanctum token found");
//         return;
//       }
  
//       // Send the PUT request with FormData
//       const response = await axios.post(
//         `${baseurl}/api/admin/updateMainCategorySwapping`,
//       {
//         rows: newRows.map((row, idx) => ({ id: row.id, order: idx }))
//       },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       console.log("Response:", response);
  
//       // Return the updated category from the response
//       return response;
//     } catch (error) {
  
//       return error.response;
  
//     }





//   };



export const Update_Main_Category_Swapping = async (id1, id2) => {
    console.log("Chala1");

    try {
        // Get token from localStorage
        const token = localStorage.getItem("Merchanttoken");

        if (!token) {
            console.error("No Sanctum token found");
            return;
        }

        // Send the PUT request with the IDs to swap
        const response = await axios.post(
            `${baseurl}/api/admin/updateMainCategorySwapping`,
            {
                id1: id1,
                id2: id2,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Response:", response);

        // Return the updated category from the response
        return response;
    } catch (error) {
        console.error("Error during swap:", error);
        return error.response;
    }



    };

// update sub Category

export const Update_Sub_Category = async (   name,
  status,
  categoryId,
  mobileImage,
  EditingId,) => {


  // Create a FormData instance
  const formData = new FormData();
  formData.append("name", name);
  formData.append("status", status);




  if ((mobileImage instanceof File)) {
    formData.append("mobile_image", mobileImage); // Add the image file if it exists`

  }


  if (categoryId) {
    formData.append("parentCategory", categoryId); // Add the image file if it exists
  }


  try {
    // Get token from localStorage
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Send the PUT request with FormData
    const response = await axios.post(
      `${baseurl}/api/admin/updatesubcategories/${EditingId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Specify multipart form data content type
        },
      }
    );

    console.log("Response:", response);

    // Return the updated category from the response
    return response.data;
  } catch (error) {
    // Log the error and rethrow it
    return error.response;

  }
};

// update Update_Sub_SubCategory

export const Update_Sub_SubCategory = async (newSubsubCategory) => {
  // return newSubsubCategory;
  const { name, status, image, id, parentCategory, parentParentCategory } =
    newSubsubCategory;


  const formData = new FormData();
  formData.append("name", name);
  formData.append("status", status);

  // return newSubsubCategory;

  if (image) {
    formData.append("sub_subategory_Image", image); // Add the image file if it exists
  }

  if (parentCategory) {
    formData.append("parentCategory", parentCategory); // Add the image file if it exists
  }

  if (parentParentCategory) {
    formData.append("parentParentCategory", parentParentCategory); // Add the image file if it exists
  }

  try {
    // Get token from localStorage
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    

    // Send the PUT request with FormData
    const response = await axios.post(
      `${baseurl}/api/admin/updateSubSubCategory/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Specify multipart form data content type
        },
      }
    );

    console.log("Response:", response);

    // Return the updated category from the response
    return response;
  } catch (error) {
    return error.response;
  }
};

// updateItemImages

export const UpdateItemImage = async ({ Imagedata }) => {
  console.log(Imagedata);

  try {
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Send the PUT request with JSON data (including base64 image strings)
    const response = await axios.put(
      `${baseurl}/api/admin/updateItemImage`,
      {
        Imagedata,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const UpdatePackedVarient = async (UpdatedData) => {
  console.log(UpdatedData);

  try {
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Send the PUT request with JSON data (including base64 image strings)
    const response = await axios.put(
      `${baseurl}/api/admin/updatePackedVarients`,
      {
        UpdatedData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const UpdateLooseVarient = async (UpdatedData) => {
  console.log(UpdatedData);

  try {
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Send the PUT request with JSON data (including base64 image strings)
    const response = await axios.put(
      `${baseurl}/api/admin/updatelooseVarients`,
      {
        UpdatedData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Specification Key

export const UpdateSpecificationKey = async ({ KeyData }) => {
  console.log(KeyData);

  try {
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Send the PUT request with JSON data (including base64 image strings)
    const response = await axios.put(
      `${baseurl}/api/admin/updateSpecificationKey`,
      {
        KeyData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// UpdateSpecificationValue

export const UpdateSpecificationValue = async ({ ValueData }) => {
  console.log(ValueData);

  try {
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Send the PUT request with JSON data (including base64 image strings)
    const response = await axios.put(
      `${baseurl}/api/admin/updateSpecificationValue`,
      {
        ValueData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const AddNewSpecification = async ({ id, AddKeys, AddValues }) => {
  console.log(
    "READY FOR GOING TO BACKEND",
    AddKeys,
    AddValues,

    id
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.put(
      `${baseurl}/api/admin/AddSpecification/${id}`,
      { AddKeys, AddValues },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    console.log("Category created successfully:", response.data.message);
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(
        "Error posting category:",
        error.response.data.message || "An error occurred."
      );
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response received from server:", error.request);
    } else {
      // Something else happened while setting up the request
      console.error("Error setting up the request:", error.message);
    }
    throw error; // Re-throw the error for higher-level error handling
  }
};

// updateManufacturer

export const updateManufacturer = async (
  importer_details,
  packer_details,
  manufacturer_details,
  seller_details,
  legal_disclaimer,
  item_id
) => {
  console.log(
    importer_details,
    packer_details,
    manufacturer_details,
    seller_details,
    legal_disclaimer,
    item_id
  );

  try {
    const token = localStorage.getItem("Merchanttoken");

    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Send the PUT request with JSON data (including base64 image strings)
    const response = await axios.put(
      `${baseurl}/api/admin/updateManufacturere/${item_id}`,
      {
        importer_details,
        packer_details,
        manufacturer_details,
        seller_details,
        legal_disclaimer,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// updateDeliveryChargesOnDistance
export const updateDeliveryChargesOnDistance = async (deliveryChargesOnDistanceFormData) => {
  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Destructure the form data to use directly in the request
    const { id, min_distance, max_distance, delivery_charge } = deliveryChargesOnDistanceFormData;

    // Log the form data (for debugging purposes)
    console.log("Updating Delivery Charges Data:", deliveryChargesOnDistanceFormData);

    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/deliveryChargesOnDistanceUpdate/${id}`,
      {
        min_distance,
        max_distance,
        delivery_charge,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response.data;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};

// updateDeliveryChargesOnValue



export const updateDeliveryChargesOnValue = async (deliveryChargesOnValueFormData) => {
  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    // Destructure the form data to use directly in the request
    const { id, Min_order_price, Max_order_price, delivery_charges } = deliveryChargesOnValueFormData;

    // Log the form data (for debugging purposes)
    console.log("Updating Delivery Charges Data:", deliveryChargesOnValueFormData);

    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/deliveryChargesOnValueUpdate/${id}`,
      {
        Min_order_price,
        Max_order_price,
        delivery_charges
        
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response.data;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};

// UpdatewareHouses


export const UpdatewareHouses = async (newWarehouseDetails) => {
  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    console.log(newWarehouseDetails);
    

    // Destructure the form data to use directly in the request
    const {   id,
      warehouse_name,
      address,
      mobile_number,
      email,
      pin_code,
      latitude,
      longitude
    } = newWarehouseDetails;


    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/updatewarehouse/${id}`,
      {
        warehouse_name,
      address,
      mobile_number,
      email,
      pin_code,
      latitude,
      longitude
        
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};


// UpdatePinCodeStatus

export const UpdatePinCodeStatus = async ({id, Status}) => {
  console.log(id, Status);
  
  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    



    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/updatePinCodeStatus/${id}`,
      {
        Status
        
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};


// UpdateSupplier

export const UpdateSupplier = async ({id, formData}) => {
  console.log(id, formData);

  const { Email,
    Supplier_Name,
    Mobile_Number,
    Company_Address,
    Fssai_number,
    GSTIN,
    State_Name,
    Code,} = formData

  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    



    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/updateSupplier/${id}`,
      {
        Email,
        Supplier_Name,
        Mobile_Number,
        Company_Address,
        Fssai_number,
        GSTIN,
        State_Name,
        Code,
        
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};


// UpdateBrand

export const UpdateBrandData = async ({id, formData}) => {
  console.log(id, formData);

  const {brand_name ,
    brand_description,
    status, } = formData

  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    



    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/updateBrand/${id}`,
      {
        brand_name ,
    brand_description,
    status, 
        
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};


// UpdateUnit

export const UpdateUnitData = async ({id, formData}) => {
  console.log(id, formData);

  const { unit,
    value,
    parent_id,} = formData

  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    



    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/updateunit/${id}`,
      {

        unit,
      value,
      parent_id,
        
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};



// UpdateUnit

export const UpdatePurchaseData = async ({ id, form }) => {
  console.log("READY FOR GOING TO BACKEND", form);

  // Destructuring the fields from `formData`
  const { invoiceDetails, items, summaryTotals } = form;

  console.log("Data being sent to backend:", invoiceDetails, items, summaryTotals);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append('supplier', invoiceDetails.supplier);
  formData.append('invoiceNo', invoiceDetails.invoiceNo);
  formData.append('date', invoiceDetails.date);
  formData.append('ModeofPayment', invoiceDetails.ModeofPayment);
  formData.append('MotorVehicleNo', invoiceDetails.MotorVehicleNo);
  formData.append('e_WayBillNo', invoiceDetails.e_WayBillNo);

  // Append summary totals
  formData.append('totalTaxableAmount', summaryTotals.totalTaxableAmount);
  formData.append('cgst', summaryTotals.cgst);
  formData.append('sgst', summaryTotals.sgst);
  formData.append('igst', summaryTotals.igst);
  formData.append('discount', summaryTotals.discount);
  formData.append('totalAmount', summaryTotals.totalAmount);
  formData.append('roundOff', summaryTotals.roundOff);
  formData.append('roundOff_Value', summaryTotals.roundOff_Value);
  formData.append('payment', summaryTotals.payment);

  // Append items
  items.forEach((item, index) => {
    Object.keys(item).forEach(key => {
      formData.append(`items[${index}][${key}]`, item[key]);
    });
  });

  try {
    const response = await axios.post(
      `${baseurl}/api/admin/updatepurchase/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Update Response:", response);

    // Return the response data
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};





// UpdateUnit

export const UpdateLooseStockData = async ({id, formData}) => {
  console.log(id, formData);

  const { purchase_id,
    purchase_item_id,
    quantity,
    unit,unit_value} = formData

  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    



    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/updateloose_stock/${id}`,
      {
        purchase_id,
        purchase_item_id,
        quantity,
        unit,unit_value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};




// UpdateUnit

export const UpdatePacketStockData = async ({id, formData}) => {
  console.log(id, formData);

  const { 
    purchase_id ,
      quantity,
      unit,} = formData

  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    



    // Send the PUT request to update delivery charges
    const response = await axios.post(
      `${baseurl}/api/admin/updatepacketStock/${id}`,
      {

        purchase_id ,
      quantity,
      unit,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the successful response
    console.log("Update Response:", response);
    
    // Return the response data
    return response;
  } catch (error) {
    // Log and handle errors (server or network)
    if (error.response) {
      // Error response from the server
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    // Re-throw the error for further handling
    throw error;
  }
};

// UpdateLooseVarientData


export const UpdateLooseVarientData = async ({ id, formData }) => {


  console.log("READY FOR GOING TO BACKEND", formData);

  // Destructuring the fields from `formData`
  const {
    item_id,
    LooseVarients,
  } = formData;

  console.log(
    "Data being sent to backend:",
    item_id,
    LooseVarients,
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Initialize FormData object
  const formDataToSend = new FormData();
  
  formDataToSend.append("item_id", Number(item_id));
  

  // Append each item in the LooseVarients array
  LooseVarients.forEach((variant, index) => {
    if(variant.image_path instanceof File){
      formDataToSend.append(`LooseVarients[${index}][image_path]`, variant.image_path);
    }
    formDataToSend.append(`LooseVarients[${index}][sku_id]`, variant.sku_id);
    formDataToSend.append(`LooseVarients[${index}][variantName]`, variant.variantName);
    formDataToSend.append(`LooseVarients[${index}][limit_per_order]`, variant.limit_per_order);
    formDataToSend.append(`LooseVarients[${index}][Status]`, variant.Status);

    formDataToSend.append(`LooseVarients[${index}][unit_id]`, variant.unit_id);
    formDataToSend.append(`LooseVarients[${index}][quantity]`, variant.quantity);

    // Status

  });











  try {
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No token found");
      return;
    }
    const response = await axios.post(
      `${baseurl}/api/admin/updateloose_Varient/${id}`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for sending files
        },
      }
    );

    // Handle success
    console.log("Update Response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};



export const UpdatePacketVarientData = async({ id, formData })=>{

  const {
    purchases_id,
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
  } = formData;

  console.log(formData);
  

  try {
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No token found");
      return;
    }

    // Create a FormData object
    const formDataToSend = new FormData();
    formDataToSend.append('purchases_id', purchases_id);
    formDataToSend.append('packet_stock_id', packet_stock_id);
    formDataToSend.append('sku_id', sku_id);
    formDataToSend.append('brand_id', brand_id);
    formDataToSend.append('quantity_unit', quantity_unit);
    formDataToSend.append('quantity', quantity);
    formDataToSend.append('limit_per_order', limit_per_order);
    formDataToSend.append('warehouse_id', warehouse_id);

    formDataToSend.append('category_id', category_id);
    formDataToSend.append('subCategory_id', subCategory_id);
    formDataToSend.append('sub_subCategory_id', sub_subCategory_id);

    formDataToSend.append('mrp', mrp);
    formDataToSend.append('discount_id', discount_id);
    formDataToSend.append('packet_size', packet_size);
    formDataToSend.append('selling_price_per_packet', selling_price_per_packet);









    if (Array.isArray(images)) {
      images.forEach((file, index) => {
        formDataToSend.append(`images[${index}]`, file);
      });
    } else if (images instanceof File) {
      // If it's a single file, handle it as before
      formDataToSend.append('images[0]', images);
    }





    const response = await axios.post(
      `${baseurl}/api/admin/updatePacket_Varient/${id}`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for sending files
        },
      }
    );

    // Handle success
    console.log("Update Response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }


}



export const UpdateGST = async({ id, formData })=>{

  const {
    gst_title,
    value,
    status,
  } = formData;

  console.log(formData);
  

  try {
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No token found");
      return;
    }

    // Create a FormData object
    const formDataToSend = new FormData();
    formDataToSend.append('gst_title', gst_title);
    formDataToSend.append('value', value);
    formDataToSend.append('status', status);













    const response = await axios.post(
      `${baseurl}/api/admin/updateGST/${id}`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for sending files
        },
      }
    );

    // Handle success
    console.log("Update Response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }


}


// ChangeItemStatus


export const ChangeItemStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/admin/updateItemStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    console.log("Purchase stored successfully:", response.data.message);
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(
        "Error posting purchase:",
        error.response.data.message || "An error occurred."
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

// ChangeOrderStatus

export const ChangeOrderStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status, id);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/admin/updateOrderStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    console.log("Purchase stored successfully:", response.data.message);
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(
        "Error posting purchase:",
        error.response.data.message || "An error occurred."
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

// ChangePaymentStatus

export const ChangePaymentStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status, id);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/admin/updatePaymentStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    console.log("Purchase stored successfully:", response.data.message);
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(
        "Error posting purchase:",
        error.response.data.message || "An error occurred."
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

// ChangeDeliveryExecutiveStatus

export const ChangeDeliveryExecutiveStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/admin/updateDeliveryExecutiveStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    console.log("Purchase stored successfully:", response.data.message);
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(
        "Error posting purchase:",
        error.response.data.message || "An error occurred."
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

// ChangeOfferStatus

export const ChangeOfferStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/admin/updateOfferStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    console.log("Purchase stored successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response;
   
  }
}



// changeHomeManagementCategoryStatus

export const changeHomeManagementCategoryStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/admin/changeHomeManagementCategoryStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    console.log("Purchase stored successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response;
  }
}


// updateVarientStatus


export const updateVarientStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/admin/updatelooseVarientStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(
        "Error posting purchase:",
        error.response.data.message || "An error occurred."
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

// updatePacketVarientStatus


export const updatePacketVarientStatus = async ({ id, Status }) => {
  console.log("READY FOR GOING TO BACKEND", Status);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Correcting the payload to include 'Status' as a field
    const response = await axios.post(
      `${baseurl}/api/admin/updatePacketVarientStatus/${id}`,
      { Status }, // <-- Sending as an object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    console.log(response);

    // Log the response and return the data
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(
        "Error posting purchase:",
        error.response.data.message || "An error occurred."
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};


// updateprimaryaddress



export const updateprimaryaddress = async (id,token) => {
  console.log(id);
  console.log(token);



  try {
    const response = await axios.get(
      `${baseurl}/api/updateprimaryaddresss/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    return response;
  } catch (error) {
   console.log(error);
   
  }
};

// performAcceptOrderAction


export const performAcceptOrderAction = async ({message,orderStatus,orderId,currentDate}) => {

  
log(currentDate);

  console.log(message);
  console.log(orderId);
  console.log(orderStatus);


  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }




  try {
    const response = await axios.put(
      `${baseurl}/api/admin/performAcceptOrderAction/${orderId}` ,{message,orderStatus,currentDate},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    return response;
  } catch (error) {
   console.log(error);
   
  }
};

// performAcceptCancel_OrderAction

export const performAcceptCancel_OrderAction = async ({message,cancellationStatus,cancellationId,order_id,currentDate}) => {



  
  log(currentDate);
  
    console.log(message);
    console.log(cancellationStatus);
    console.log(cancellationId);
  
  
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
  
  
  
  
    try {
      const response = await axios.put(
        `${baseurl}/api/admin/cancel-approval-request/${cancellationId}` ,{message,cancellationStatus,order_id,currentDate},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(response);
      return response;
    } catch (error) {
     console.log(error);
     
    }
  };

  // orderStatusChangeByMerchant

  export const orderStatusChangeByMerchant = async ({toChangeStatus ,
    orderId,
    currentDate,}) => {



  
    
    
      const token = localStorage.getItem("Merchanttoken");
      if (!token) {
        console.error("Authorization token is missing. Please log in.");
        return;
      }
    
    
    
    
      try {
        const response = await axios.put(
          `${baseurl}/api/admin/orderStatusChangeByMerchant/${orderId}` ,{toChangeStatus,orderId,currentDate},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log(response);
        return response;
      } catch (error) {
        return error.response;
       
      }
    };
  







    // Update_LatLongInData_Base

    export const Update_LatLongInData_Base = async ({latitude, longitude, id}) => {

      console.log(latitude);
      console.log(longitude);
      
      console.log(id);

  
  
  
    
      
      
      
      
        try {
          const response = await axios.put(
            `${baseurl}/api/Update_LatLongInData_Base/${id}` ,{latitude, longitude}
          );
      
          console.log(response);
          return response;
        } catch (error) {
          return error.response;
         
        }
      };