import axios from "axios";
import baseurl from "./customURl";
import { log } from "tone/build/esm/core/util/Debug";
import { toast } from "react-toastify";

  const Merchant_token = localStorage.getItem('Merchanttoken') || null;
  const User_token = localStorage.getItem('token') || null;


// *****************************SuperAdmin ____ superadmintoken******************************************************

// CreteDeliveryExecutive

export const CreteRoles = async ({ formDataa }) => {
    ("READY FOR GOING TO BACKEND", formDataa);

  // Destructuring the fields from `formData`
  const { name, phone, email, password, address, role } = formDataa;


  // Retrieve token from localStorage
  const token = localStorage.getItem("superadmintoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", role);
  formData.append("address", address);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/superadmin/store_new_role`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Purchase stored successfully:", response.data.message);
    return response;
  } catch (error) {
    // // Enhanced error handling
    // if (error.response) {
    //   // Server responded with a status other than 2xx
    //   console.error(
    //     "Error posting purchase:",
    //     error.response.data.message || "An error occurred."
    //   );
    // } else if (error.request) {
    //   // Request was made but no response was received
    //   console.error("No response received from server:", error.request);
    // } else {
    //   // Something else happened while setting up the request
    //   console.error("Error setting up the request:", error.message);
    // }
    // throw error; // Re-throw the error for higher-level error handling
    return error.response;
  }
};

// ************************************************User************************************************************

export const InitiatePayment = async (payload) => {
  const { amount } = payload;
    (amount);

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Authorization token is missing. Please log in.");
    return { error: "Authorization token missing" };
  }

  const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    (date); // Output: "2025-03-09 21:16:36"

  try {
    let response = await fetch(`${baseurl}/api/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        date,
      }),
    });
    let data = await response.json();
      (data);
    return data;
  } catch (error) {
    return error.response;
  }
};

export const verifyInitiatedpayment = async (payload) => {
  const { order_id, payment_id, signature } = payload;

    ("Order ID:", order_id);
    ("Payment ID:", payment_id);
    ("Signature:", signature);

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return { success: false, message: "Authorization token is missing" };
  }

  const currentDate = new Date().toISOString().split("T")[0];

  try {
    let response = await fetch(`${baseurl}/api/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id,
        payment_id,
        signature,
        message: "PLACE_ORDER",
        current_date: currentDate,
      }),
    });

    // Handle API response
    let data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to verify payment");
    }

      ("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error during payment verification:", error.message);
    return { success: false, message: error.message };
  }
};

export const FinalPaymentVarification = async (
  userID,
  Order_id,
  paymentID,
  signature,
  amount
) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return { success: false, message: "Authorization token is missing" };
  }

  const currentDate = new Date().toISOString().split("T")[0];

  try {
    let response = await fetch(
      `${baseurl}/api/final-verify-payment/${userID}/${Order_id}/${currentDate}/${paymentID}/${signature}/${amount}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Handle API response
    let data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to verify payment");
    }

      ("API Response:", data);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const VerifyOrderID = async ({ orderId }) => {
    (orderId);

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return { success: false, message: "Authorization token is missing" };
  }

  try {
    let response = await fetch(`${baseurl}/api/verifyOrderId/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle API response
    let data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to verify payment");
    }

      ("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error during payment verification:", error.message);
    return { success: false, message: error.message };
  }
};

export const userRegister = async (payload) => {
  const { mail, pass } = payload;

  if (mail !== "" && pass !== "") {
    try {
        (mail);
        (pass);
      // https://retaildukan.wipenex.com/public/api/registers
      let response = await fetch(`${baseurl}/api/registers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: mail,
          password: pass,
        }),
      });
      let data = await response.json();
        (data);

      if (data) {
        localStorage.setItem("token", data.token);
        alert("Successfully Registered");
        return data;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  } else {
    alert("Email and password cannot be empty.");
  }
};

//

export const userLogin = async (payload) => {
  const { input, type, otp, otp_id ,selectedOffers,referrer,mode ,  Latitude , Longitude ,AreaPin } = payload;
    (input);
    (type);
    (otp);
    (otp_id);
    (selectedOffers);
    (mode);

  const current_date = new Date().toISOString().split("T")[0];
    (current_date);

  try {
    let response = await fetch(`${baseurl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        type,
        otp: otp,
        otpId: otp_id,
        selectedOffers: selectedOffers,
        referrer  : referrer, 
        mode : mode,
        Latitude ,
        Longitude ,
        AreaPin,
        current_date

      }),
    });

      (response);

    let data = await response.json();


    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

          return data;
  
  } catch (error) {
    throw error
  }




};

export const SenduserAuthenticationOTP = async (payload) => {
  const { input, type } = payload;

  try {
    let response = await fetch(`${baseurl}/api/SenduserAuthenticationOTP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        type,
      }),
    });

    let data = await response.json();

    return data;
  } catch (error) {
    return error.response;
  }
};

// superAdmin login

export const uploadLogo = async (logo) => {
    ("Uploading logo:", logo);

  const token = localStorage.getItem("superadmintoken");

  // ✅ Use FormData to send files
  const formData = new FormData();
  formData.append("logo", logo);

  try {
    let response = await fetch(`${baseurl}/api/superadmin/uploadLogo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Keep token
        // ❌ Do NOT set "Content-Type", browser will handle it
      },
      body: formData, // ✅ Correct way to send files
    });

    let data = await response.json();
      ("Upload Response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload logo");
    }

    return data;
  } catch (error) {
    console.error("Upload error:", error);
    alert("An error occurred during upload.");
  }
};

export const superAdminLogin = async (payload) => {
  const { authMethod, userType, inputValue } = payload;
    (authMethod);
    (userType);
    (inputValue);

  if (authMethod) {
    try {
      let response = await fetch(`${baseurl}/api/authorization/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: authMethod === "email" ? inputValue : null,
          phone: authMethod === "phone" ? inputValue : null,
          userType: userType,
          authMethod,
        }),
      });
      let data = await response.json();
        (data);
      return data;
    } catch (error) {
      return error.response;
    }
  } else {
    alert("Email and password cannot be empty.");
  }
};

export const CreateAdmin = async ({ newAdmin }) => {
  const {
    fullName,
    email,
    phoneNumber,
    role,
    status,
    createdDate,
    lastLoginDate,
    profilePicture,
    department,
    notes,
  } = newAdmin;

  const token = localStorage.getItem("superadmintoken");
  const convertedToken = JSON.parse(token); // Ensure token is not null

  if (
    fullName &&
    email &&
    phoneNumber &&
    role &&
    status &&
    createdDate &&
    lastLoginDate &&
    profilePicture &&
    department &&
    notes &&
    convertedToken
  ) {
    try {
      let response = await fetch(`${baseurl}/api/superadmin/createAdmin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${convertedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          phone: phoneNumber,
          role,
          status,
          created_Date: createdDate,
          last_login: lastLoginDate,
          profile_photo: profilePicture,
          department,
          Notes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();
        (data);
      return data;
    } catch (error) {
      console.error("Error during admin creation:", error);
      alert("An error occurred during admin creation.");
    }
  } else {
    alert("All fields and token must be provided.");
  }
};

// superAdmin otp Verify

export const Verify_admin_superadminLogin__otp = async ({
  authMethod,
  userType,
  otp,
  inputValue,
}) => {
    (authMethod);
    (userType);
    (otp);
    (inputValue);

  // ll

  if (authMethod && userType && otp) {
    try {
        (authMethod);
        (userType);
        (otp);

      let response = await fetch(`${baseurl}/api/authorization/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOtp: authMethod === "email" ? otp : null,
          phoneOtp: authMethod === "phone" ? otp : null,
          userType: userType,
          authMethod,
          inputValue,
        }),
      });
      let data = await response.json();
        (data);

      alert(data.message);

      if (data.message == "merchant Login successful") {
          ("Cjflkdsflkdsjklfjd");

        localStorage.setItem("Merchanttoken", data.token);
      } else if (data.message === "SuperAdmin Login successful") {
        localStorage.setItem("superadmintoken", data.token);
      }

      return data;
    } catch (error) {
        (error);
      
     return error.response;
    }
  } else {
    alert("Email and password cannot be empty.");
  }
};

export const postAddress = async (combinedObject) => {
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
  } = combinedObject;

    (combinedObject);
    console.log(token);
    

  try {
    const response = await axios.post(
      `${baseurl}/api/addresses`,
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
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

       return response;
  } catch (error) {
    throw error
  }
};

export const buyCard = async ({
  receiver_mail,
  receiver_name,
  cardValue,
  numberOfCard,
  receiver_Gifter_Name,
  receiver_message,
}) => {
    (receiver_mail);
    (receiver_name);
    (cardValue);
    (numberOfCard);
    (receiver_Gifter_Name);
    (receiver_message);

  const response = localStorage.getItem("token");
  const token = JSON.parse(response);
    (token.token);

  try {
    const response = await axios.post(
      `${baseurl}/api/buyGiftCard`,
      {
        receiver_mail_id: receiver_mail,
        receiver_name: receiver_name,
        cardValue: cardValue,
        number_Of_card: numberOfCard,
        gifter_Name: receiver_Gifter_Name,
        message: receiver_message,
      },
      {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
    );

    if (response) {
      alert("Address posted successfully");
        (response);
      return response;
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

// Add StoreMainGroup

export const StoreMainGroup = async (name, desktopImage, status, selectedWarehouses) => {
  if (!name || !desktopImage || !(desktopImage instanceof File)) {
    console.warn("Invalid input: name and image are required.");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", desktopImage);
  formData.append("status", status);

  selectedWarehouses?.forEach((id) => {
    formData.append("warehouse_ids[]", id);
  });

  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Missing token. Please login.");
    return;
  }

  try {
    const response = await axios.post(
      `${baseurl}/api/admin/store-group`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Error while creating group:", error?.response?.data || error.message);
    throw error;
  }
};





// Refferals *****************************************************************************************



export const CreateRefferalConfiguration = async (
 reward_amount, referrals_required, status , MileStoneName
) => {
    (reward_amount);
    (referrals_required);
    (status);


  // Create a FormData object
  const formData = new FormData();
  formData.append("reward_amount", reward_amount);
  formData.append("referrals_required", referrals_required);
  formData.append("status", status);
  formData.append("MileStoneName", MileStoneName);


  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  } else {
      (token);
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/CreateRefferalConfiguration`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;

  } catch (error) {
    return error.response;
  }
};

























// Add Main Category

export const StoreCategory = async (
  name,
  desktop_image,
  mobile_image,
  status,
  GroupId
) => {
    (desktop_image);
    (mobile_image);
    (name);
    (status);
    (GroupId);


  // Ensure that 'image' is a File object before appending it to FormData
  if (!(desktop_image instanceof File)) {
    return;
  }

  // Create a FormData object
  const formData = new FormData();
  formData.append("category_desktop_Image", desktop_image);
  if (mobile_image) {
    formData.append("category_mobile_Image", mobile_image);
  }
  formData.append("name", name);
  formData.append("status", status);
  formData.append("GroupId", GroupId);


  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  } else {
      (token);
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/categories`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// add SubCategory

export const storeSubCategory = async (
       name,
        categoryId,
        groupId,
        status,
        mobileImage
) => {
    (groupId);
    (name);

    (categoryId);

    (status);
    (mobileImage);

  // Ensure that 'image' is a File object before appending it to FormData
  if (!(mobileImage instanceof File)) {
    toast.error(
      "Invalid image file. Make sure 'desktop_imageFile' is a File object."
    );
    return;
  }

  // Create a FormData object
  const formData = new FormData();
  // formData.append("mobile_image", mobileImage);
  // only save mobile image
  formData.append("mobile_image", mobileImage);
  formData.append("groupId", groupId);
  formData.append("parentCategory", categoryId);

  formData.append("name", name);
  formData.append("status", status);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/subcategories`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Sub Category created successfully:", response.data.data);
    return response;
  } catch (error) {
    return error.response;
  }
};

// add storeSubSubCategory

export const storeSubSubCategory = async (newSubCategory) => {
  const { image, name, status, parentCategory, GroupID, parentParentCategory } =
    newSubCategory;

  // Ensure that 'image' is a File object before appending it to FormData
  if (!(image instanceof File)) {
    toast.error("Invalid image file. Make sure 'image' is a File object.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();
  formData.append("sub_subategory_Image", image);
  formData.append("name", name);
  formData.append("status", status);
  formData.append("GroupID", GroupID);

  formData.append("SubCategory", parentCategory);
  formData.append("Category", parentParentCategory);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    toast.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/SubSubCategory`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

// postItem

export const postLooseItem = async (
  item_name,
  brand,
  stock_type,
  loose_sku_Id,
  loose_batch_number,
  categories,
  subcategories,
  sub_subcategories,
  description,
  loose_expiry_date,
  loose_area_pin,
  loose_stock_wareHouse,
  varients,
  specification,
  loose_images,
  importer_details,
  packer_details,
  manufacturer_details,
  seller_details,
  legal_disclaimer
) => {
    (loose_images);

    (
    "READY FOR GOING TO BACKEND",
    " ",
    " ",
    item_name,
    brand,
    stock_type,
    loose_sku_Id,

    loose_batch_number,
    categories,
    subcategories,
    sub_subcategories,
    description,
    loose_expiry_date,
    loose_area_pin,
    loose_stock_wareHouse,
    varients,
    specification,
    loose_images,
    importer_details,
    packer_details,
    manufacturer_details,
    seller_details,
    legal_disclaimer
  );

  // Ensure that 'image' is a File object before appending it to FormData
  // if (!(images instanceof File)) {
  //   console.error("Invalid image file. Make sure 'image' is a File object.");
  //   return;
  // }

  // Create a FormData object
  const formData = new FormData();
  formData.append("item_name", item_name);
  formData.append("brand", brand);
  formData.append("stock_type", stock_type);
  formData.append("loose_sku_Id", loose_sku_Id);

  formData.append("loose_batch_number", loose_batch_number);
  formData.append("categories", categories);
  formData.append("subcategories", subcategories);
  formData.append("sub_subcategories", sub_subcategories);
  formData.append("description", description);
  formData.append("loose_expiry_date", loose_expiry_date);
  formData.append("loose_area_pin", loose_area_pin);
  formData.append("loose_stock_wareHouse", loose_stock_wareHouse);

  // Append each variant according to Laravel's expected structure

  varients.forEach((variant, index) => {
    formData.append(
      `varients[${index}][loose_varient_title]`,
      variant.loose_varient_title
    );
    formData.append(
      `varients[${index}][loose_product_unit]`,
      variant.loose_product_unit
    );
    formData.append(
      `varients[${index}][loose_product_mrp]`,
      variant.loose_product_mrp
    );
    formData.append(
      `varients[${index}][loose_product_discount]`,
      variant.loose_product_discount
    );
    formData.append(
      `varients[${index}][loose_product_price]`,
      variant.loose_product_price
    );
    formData.append(
      `varients[${index}][loose_product_quantity]`,
      variant.loose_product_quantity
    );
    formData.append(
      `varients[${index}][loose_price_per_unit]`,
      variant.loose_price_per_unit
    );
    formData.append(`varients[${index}][loose_pack_of]`, variant.loose_pack_of);
    formData.append(
      `varients[${index}][loose_limit_per_order]`,
      variant.loose_limit_per_order
    );

    formData.append(
      `varients[${index}][loose_stock_quantity]`,
      variant.loose_stock_quantity
    );
    formData.append(
      `varients[${index}][loose_stock_unit]`,
      variant.loose_stock_unit
    );
    formData.append(
      `varients[${index}][loose_purchase_price]`,
      variant.loose_purchase_price
    );
  });

  // Append each specification according to Laravel's expected structure
  specification.forEach((spec, index) => {
    formData.append(`specification[${index}][keys]`, spec.keys);
    formData.append(`specification[${index}][value]`, spec.value);
  });

  // Append each image according to Laravel's expected structure

  loose_images.forEach((image, index) => {
    formData.append(`loose_images[${index}][image]`, image.image); // assuming image is a File object
  });

  formData.append("importer_details", importer_details);
  formData.append("packer_details", packer_details);
  formData.append("manufacturer_details", manufacturer_details);
  formData.append("seller_details", seller_details);
  formData.append("legal_disclaimer", legal_disclaimer);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storeitems/loose`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
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

// packetItem

export const postPacketItem = async (
  item_name,
  brand,
  stock_type,
  categories,
  subcategories,
  sub_subcategories,
  description,
  varients,
  specification,
  importer_details,
  packer_details,
  manufacturer_details,
  seller_details,
  legal_disclaimer,
  packet_varient_warehouse
) => {
    (
    "READY FOR GOING TO BACKEND",
    " ",
    " ",
    item_name,
    brand,
    stock_type,
    categories,
    subcategories,
    sub_subcategories,
    description,
    varients,
    specification,
    importer_details,
    packer_details,
    manufacturer_details,
    seller_details,
    legal_disclaimer,
    packet_varient_warehouse
  );
    (varients);

  // Create a FormData object
  const formData = new FormData();
  formData.append("item_name", item_name);
  formData.append("brand", brand);
  formData.append("stock_type", stock_type);
  formData.append("categories", categories);
  formData.append("subcategories", subcategories);
  formData.append("sub_subcategories", sub_subcategories);
  formData.append("description", description);

  // Append each variant according to Laravel's expected structure

  // Loop through each variant
  varients.forEach((variant, variantIndex) => {
    formData.append(
      `varients[${variantIndex}][packet_varient_sku_Id]`,
      variant.packet_varient_sku_Id
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_stock_quantity]`,
      variant.packet_varient_stock_quantity
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_warehouse]`,
      variant.packet_varient_warehouse
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_stock_unit]`,
      variant.packet_varient_stock_unit
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_purchase_price]`,
      variant.packet_varient_purchase_price
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_sell_unit]`,
      variant.packet_varient_sell_unit
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_quantity_PerPacket]`,
      variant.packet_varient_quantity_PerPacket
    );

    formData.append(
      `varients[${variantIndex}][packet_varient_quantity_PerPacket_unit]`,
      variant.packet_varient_quantity_PerPacket_unit
    );

    formData.append(
      `varients[${variantIndex}][packet_varient_mrp]`,
      variant.packet_varient_mrp
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_discount_percentage]`,
      variant.packet_varient_discount_percentage
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_selling_price]`,
      variant.packet_varient_selling_price
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_price_per_unit]`,
      variant.packet_varient_price_per_unit
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_expiry_date]`,
      variant.packet_varient_expiry_date
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_batch_number]`,
      variant.packet_varient_batch_number
    );

    formData.append(
      `varients[${variantIndex}][packet_varient_sku_name]`,
      variant.packet_varient_sku_name
    );

    formData.append(
      `varients[${variantIndex}][packet_varient_limit_per_order]`,
      variant.packet_varient_limit_per_order
    );

    formData.append(
      `varients[${variantIndex}][packet_varient_gst]`,
      variant.packet_varient_gst
    );

    formData.append(
      `varients[${variantIndex}][packet_varient_gst_description]`,
      variant.packet_varient_gst_description
    );

    formData.append(
      `varients[${variantIndex}][packet_varient_area_pin]`,
      variant.packet_varient_area_pin
    );
    formData.append(
      `varients[${variantIndex}][packet_varient_pack_of]`,
      variant.packet_varient_pack_of
    );
    formData.append(
      `varients[${variantIndex}][expirydate]`,
      variant.expity_date
    );

    // Append each image file in the variant's images array
    if (
      variant.packet_varient_images &&
      Array.isArray(variant.packet_varient_images)
    ) {
      variant.packet_varient_images.forEach((imageObject, imageIndex) => {
        if (imageObject.image) {
          formData.append(
            `varients[${variantIndex}][packet_varient_images][${imageIndex}][image]`,
            imageObject.image
          );
        }
      });
    }
  });

  // Append each specification according to Laravel's expected structure
  specification.forEach((spec, specIndex) => {
    formData.append(`specification[${specIndex}][keys]`, spec.keys);
    formData.append(`specification[${specIndex}][value]`, spec.value);
  });

  formData.append("importer_details", importer_details);
  formData.append("packer_details", packer_details);
  formData.append("manufacturer_details", manufacturer_details);
  formData.append("seller_details", seller_details);
  formData.append("legal_disclaimer", legal_disclaimer);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storeitems/packet`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
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

// addDeliveryConstraints

export const addDeliveryChargesOnDistance = async (formData) => {
    ("READY FOR GOING TO BACKEND", " ", " ", formData);
    (formData);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/postdeliveryDeliveryChargesOnDistance`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      (response);

    // Log the response and return the data

      ("Category created successfully:", response.data.message);
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

export const addDeliveryChargesOnValue = async (formData) => {
    ("READY FOR GOING TO BACKEND", " ", " ", formData);
    (formData);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/postdeliveryDeliveryChargesOnValue`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      (response);

    // Log the response and return the data

      ("Category created successfully:", response.data.message);
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

// StoreItemToCart

export const StoreItemToCart = async (
         Customer_userId,
          purchase_item_id,
          Varient_type,
          variantId,
          stock_type,
          stock_id,
          Latitude,
          Longitude,
          AreaPin
) => {
    (
    "READY FOR GOING TO BACKEND",
    " ",
    " ",
          Customer_userId,
          purchase_item_id,
          Varient_type,
          variantId,
          stock_type,
          stock_id,
          Latitude,
          Longitude,
          AreaPin
  );

  const currentDate = new Date().toISOString().split("T")[0];
    (currentDate);

  // Create a FormData object
  const formData = new FormData();
  formData.append("user_id", Customer_userId);
  formData.append("sku_id", variantId);
  formData.append("quantity", 1);
  formData.append("current_date", currentDate);
  formData.append("purchase_item_id", purchase_item_id);
  formData.append("Varient_type", Varient_type);
  formData.append("stock_type", stock_type);
  formData.append("stock_id", stock_id);
  formData.append("AreaPin", AreaPin);
formData.append("Longitude", String(Longitude));
formData.append("Latitude", String(Latitude));



  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(`${baseurl}/api/addtocart`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response;
  }
};

// IncreaseItemQuantityToCart

export const IncreaseItemQuantityToCart = async ({
  grocery_cart_Item_id,
  grocery_cart_id,
  sku_id,
  purchase_item_id,
  Varient_type,
   Latitude,
          Longitude,
          AreaPin
}) => {
    (
    "READY FOR GOING TO BACKEND",
    " ",
    " ",
    grocery_cart_Item_id,
    grocery_cart_id,
    sku_id,
    purchase_item_id,
    Varient_type,
     Latitude,
          Longitude,
          AreaPin
  );

  const currentDate = new Date().toISOString().split("T")[0];
    (currentDate);

  // Create a FormData object
  const formData = new FormData();
  formData.append("grocery_cart_Item_id", grocery_cart_Item_id);
  formData.append("grocery_cart_id", grocery_cart_id);
  formData.append("current_date", currentDate);

  formData.append("sku_id", sku_id);

  formData.append("purchase_item_id", purchase_item_id);

  formData.append("Varient_type", Varient_type);

  formData.append("Latitude", Latitude);
  formData.append("Longitude", Longitude);
  formData.append("AreaPin", AreaPin);


  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/increaseItemQuantity`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Quantity Increases successfully:", response.data.message);
    return response;
  } catch (error) {
      (error);

    return error.response;
  }
};

// DecreaseItemQuantityToCart

export const DecreaseItemQuantityToCart = async ({
  grocery_cart_Item_id,
  grocery_cart_id,
  sku_id,
  purchase_item_id,
  Varient_type,
    Latitude,
          Longitude,
          AreaPin
}) => {
    (
    "READY FOR GOING TO BACKEND",
    " ",
    " ",
    grocery_cart_Item_id,
    grocery_cart_id,
    sku_id,
    purchase_item_id,
    Varient_type,
      Latitude,
          Longitude,
          AreaPin
  );

  const currentDate = new Date().toISOString().split("T")[0];
    (currentDate);

  // Create a FormData object
  const formData = new FormData();
  formData.append("grocery_cart_Item_id", grocery_cart_Item_id);
  formData.append("grocery_cart_id", grocery_cart_id);
  formData.append("current_date", currentDate);

  formData.append("sku_id", sku_id);

  formData.append("purchase_item_id", purchase_item_id);

  formData.append("Varient_type", Varient_type);

    formData.append("Latitude", Latitude);
  formData.append("Longitude", Longitude);
  formData.append("AreaPin", AreaPin);


  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/decreaseItemQuantity`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Quantity decreases successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response;
  }
};

// storeWareHouse

export const storeWareHouse = async (newWarehouse) => {
    (
    "READY FOR GOING TO BACKEND",
    " ",
    " ",

    newWarehouse
  );

  const {
    warehouse_name,
    address,
    mobile_number,
    email,
    pin_code,
    latitude,
    longitude,
  } = newWarehouse;

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/postwarehouse`,
      {
        warehouse_name,
        address,
        mobile_number,
        email,
        pin_code,
        latitude,
        longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    return response;
  } catch (error) {
      (error);
    
    return error.response;

  }
};

// AddPinCode

export const AddPinCode = async (newPincode) => {
    ("READY FOR GOING TO BACKEND", newPincode);

  // Accessing the nested `formData` object
  const { formData } = newPincode;

  // Destructuring the fields from `formData`
  const { Area, Status, country_name, district_name, pincode, state_name } =
    formData;

    (
    "Data being sent to backend:",
    Area,
    Status,
    country_name,
    district_name,
    pincode,
    state_name
  );

  // Check for undefined values
  if (
    !Area ||
    !Status ||
    !country_name ||
    !district_name ||
    !pincode ||
    !state_name
  ) {
    console.warn("Some fields are missing or undefined");
  }

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storePinCode`,
      {
        Area,
        Status,
        country_name,
        district_name,
        pincode,
        state_name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
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

// AddSupplier

export const AddSupplier = async ({ formData }) => {
    ("READY FOR GOING TO BACKEND", formData);

  // Destructuring the fields from `formData`
  const {
    Supplier_Name,
    Mobile_Number,
    Email,
    Company_Address,
    Fssai_number,
    Code,
    State_Name,
    GSTIN,
  } = formData;

    (
    "Data being sent to backend:",
    Supplier_Name,
    Mobile_Number,
    Email,
    Company_Address,
    Fssai_number,
    Code,
    State_Name,
    GSTIN
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storeSupplier`,
      {
        Supplier_Name,
        Mobile_Number,
        Email,
        Company_Address,
        Fssai_number,
        Code,
        State_Name,
        GSTIN,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response;
  }
};

// AddBrand

export const StoreBrand = async ({ formData }) => {
    ("READY FOR GOING TO BACKEND", formData);

  // Destructuring the fields from `formData`
  const { brand_name, brand_description, status } = formData;

    (
    "Data being sent to backend:",
    brand_name,
    brand_description,
    status
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storeBrand`,
      {
        brand_name,
        brand_description,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response;
  }
};

// unit

export const Storeunit = async ({ formData }) => {
    ("READY FOR GOING TO BACKEND", formData);

  // Destructuring the fields from `formData`
  const { unit, value, parent_id } = formData;

    ("Data being sent to backend:", unit, value, parent_id);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storeunit`,
      {
        unit,
        value,
        parent_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
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

// storeloose_stock

export const storeloose_stock = async ({ formData }) => {
    ("READY FOR GOING TO BACKEND", formData);

  // Destructuring the fields from `formData`
  const {
    quantity,
    warehouse,
    paketings,
    unit,
    unit_value,
    purchase_item_id,
    item_id,
    parentloosevarientId,
    varientType,
    varientId,
  } = formData;

    (
    "Data being sent to backend:",
    quantity,
    warehouse,
    unit,
    item_id,
    unit_value,
    purchase_item_id,
    varientType,
    varientId
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storeloose_stock`,
      {
        purchase_item_id,
        parentloosevarientId,
        paketings,
        warehouse,
        quantity,
        item_id,
        unit,
        unit_value,
        varientType,
        varientId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response; // Re-throw the error for higher-level error handling
  }
};

// storepacketStock

export const storepacketStock = async ({ formData }) => {
    ("READY FOR GOING TO BACKEND", formData);

  // Destructuring the fields from `formData`

  const {
    varientType,
    varientId,
    purchase_item_id,
    quantity,
    item_id,
    unit,
    warehouse,
    unit_value,
  } = formData;

    (
    "Data being sent to backend:",
    varientType,
    varientId,
    purchase_item_id,
    quantity,
    item_id,
    unit,
    warehouse,
    unit_value
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storepacketStock`,
      {
        varientType,
        varientId,
        purchase_item_id,
        quantity,
        unit,
        unit_value,
        item_id,
        warehouse,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response;
  }
};

// storeloose_Varient

export const storeloose_Varient = async ({ formData }) => {
    ("READY FOR GOING TO BACKEND", formData);

  // Destructuring the fields from `formData`
  const { item_id, LooseVarients } = formData;

    ("Data being sent to backend:", item_id, LooseVarients);

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
    if (variant.image_path instanceof File) {
      formDataToSend.append(
        `LooseVarients[${index}][image_path]`,
        variant.image_path
      );
    }

    // Handle SpecificationBucket
    if (
      variant.SpecificationBucket &&
      Array.isArray(variant.SpecificationBucket)
    ) {
      variant.SpecificationBucket.forEach((spec, specIndex) => {
        if (spec.key && spec.value) {
          formDataToSend.append(
            `LooseVarients[${index}][SpecificationBucket][${specIndex}][key]`,
            spec.key
          );
          formDataToSend.append(
            `LooseVarients[${index}][SpecificationBucket][${specIndex}][value]`,
            spec.value
          );
        }
      });
    }

    // brand_id
    formDataToSend.append(
      `LooseVarients[${index}][brand_id]`,
      variant.brand_id
    );

    formDataToSend.append(`LooseVarients[${index}][sku_id]`, variant.sku_id);
    formDataToSend.append(
      `LooseVarients[${index}][variantName]`,
      variant.variantName
    );
    formDataToSend.append(
      `LooseVarients[${index}][limit_per_order]`,
      variant.limit_per_order
    );
    formDataToSend.append(`LooseVarients[${index}][Status]`, variant.Status);
    formDataToSend.append(
      `LooseVarients[${index}][forPurchase]`,
      variant.forPurchase
    );
    formDataToSend.append(`LooseVarients[${index}][unit_id]`, variant.unit_id);
    formDataToSend.append(
      `LooseVarients[${index}][quantity]`,
      variant.quantity
    );

    // forPurchase

    // Status
  });

  // Make the POST request to the API
  const response = await axios.post(
    `${baseurl}/api/admin/storeloose_Varient`,
    formDataToSend,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

    (response);

  return response;
};

// storePacket_Varient

export const storePacket_Varient = async ({ formData }) => {

  const { item_id, PacketVarients } = formData; // Update to match the property name

  if (!item_id  || !Array.isArray(PacketVarients)) {
    console.log("Invalid formData structure:", formData);
    return;
  }


  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("item_id", Number(item_id));

  PacketVarients.forEach((variant, index) => {

    console.log(variant)
    

    if(variant.ImageBucket.length <= 0){
toast.warn("ImageBucket is Empty")

      return 

    }


        if(variant.SpecificationBucket.length <= 0){
toast.warn("SpecificationBucket is Empty")

      return 

    }


    // Handle ImageBucket
    if (variant.ImageBucket && Array.isArray(variant.ImageBucket)) {
      variant.ImageBucket.forEach((image, imageIndex) => {
        if (image.file instanceof File) {
          formDataToSend.append(
            `PacketVarients[${index}][image_path][${imageIndex}]`, image.file
          );
        }
      });
    }

    console.log(variant);
    

    // Handle SpecificationBucket
    if (
      variant.SpecificationBucket &&
      Array.isArray(variant.SpecificationBucket)
    ) {
      variant.SpecificationBucket.forEach((spec, specIndex) => {
        if (spec.key && spec.value) {
          formDataToSend.append(
            `PacketVarients[${index}][SpecificationBucket][${specIndex}][key]`,
            spec.key
          );
          formDataToSend.append(
            `PacketVarients[${index}][SpecificationBucket][${specIndex}][value]`,
            spec.value
          );
        }
      });
    }

    // Add other variant details
    formDataToSend.append(
      `PacketVarients[${index}][sku_id]`,
      variant.sku_id || ""
    );
    formDataToSend.append(
      `PacketVarients[${index}][brand_id]`,
      variant.brand_id || ""
    );

    formDataToSend.append(
      `PacketVarients[${index}][variantName]`,
      variant.variantName || ""
    );

    formDataToSend.append(
      `PacketVarients[${index}][limit_per_order]`,
      variant.limit_per_order || ""
    );
    formDataToSend.append(
      `PacketVarients[${index}][Status]`,
      variant.Status || "inactive"
    );
  });

  formDataToSend.forEach((value, key) => {
      (`${key}:`, value);
  });

  try {
    const response = await axios.post(
      `${baseurl}/api/admin/storePacket_Varient`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      ("Response from backend:", response);
    return response;
  } catch (error) {
    throw error
  }


};




export const saveWarehousesPincode = async (formData) => {
  const token = localStorage.getItem("Merchanttoken");

  console.log("FormData received in API function:");
  for (let pair of formData.entries()) {
    console.log(pair[0] + ':', pair[1]);
  }

  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    const response = await axios.post(
      `${baseurl}/api/admin/saveWarehousesPincode`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Response from backend:", response);
    return response;
  } catch (error) {
    console.log("Error in saveWarehousesPincode:", error);
    throw error;
  }
};






// Verifysku

export const checkSkuExists = async (sku_id) => {
    ("READY FOR GOING TO BACKEND", " ", " ", sku_id);
    (sku_id);

    ("Chala");

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
      ("chala");

    console.error("Authorization token is missing. Please log in.");
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/CheckSKUIDExitORNOT`,
      { sku_id: sku_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
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

// checkHSNExists

export const checkHSNExists = async ({ hsn }) => {
    ("READY FOR GOING TO BACKEND", " ", " ", hsn);
    (hsn);

    ("Chala");

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
      ("chala");

    console.error("Authorization token is missing. Please log in.");
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/CheckHSNExitORNOT`,
      { hsn: hsn },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      (response);

    // Log the response and return the data
      ("Category created successfully:", response.data.message);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const storeGST = async ({ formData }) => {
    ("READY FOR GOING TO BACKEND", formData);

  // Destructuring the fields from `formData`

  const { gst_title, status, value } = formData;

    (
    "Data being sent to backend:",

    gst_title,
    status,
    value
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storegst`,
      {
        gst_title,
        status,
        value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
      ("gst created successfully:", response.data.message);
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

// StorePurchase

export const StorePurchase = async ({ form }) => {
  // Destructuring the fields from `formData`
  const { invoiceDetails, items, summaryTotals, purchase_id } = form;

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("supplier", invoiceDetails.supplier);
  formData.append("invoiceNo", invoiceDetails.invoiceNo);
  formData.append("date", invoiceDetails.date);
  formData.append("ModeofPayment", invoiceDetails.ModeofPayment);
  formData.append("MotorVehicleNo", invoiceDetails.MotorVehicleNo);
  formData.append("e_WayBillNo", invoiceDetails?.e_WayBillNo || null);

  formData.append("totalTaxableAmount", summaryTotals.totalTaxableAmount);
  formData.append("cgst", summaryTotals.cgst);
  formData.append("sgst", summaryTotals.sgst);
  formData.append("igst", summaryTotals.igst);
  formData.append("discount", summaryTotals.discount);
  formData.append("totalAmount", summaryTotals.totalAmount);
  formData.append("roundOff", summaryTotals.roundOff);
  formData.append("roundOff_Value", summaryTotals.roundOff_Value);
  formData.append("payment", summaryTotals.payment);

  if (purchase_id !== undefined && purchase_id !== null) {
    formData.append("purchase_id", purchase_id);
  }

  // Append items
  items.forEach((item, index) => {
    Object.keys(item).forEach((key) => {
      formData.append(`items[${index}][${key}]`, item[key]);
    });
  });

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storePurchase`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Log the response and return the data
    return response;
  } catch (error) {
    throw error; // Re-throw the error for higher-level error handling
  }
};

// CreteItems

export const CreteItems = async ({ formDataa }) => {
    ("READY FOR GOING TO BACKEND", formDataa);

  // Destructuring the fields from `formData`
  const { ItemName, category_id, subCategory_id, sub_subCategory_id, Status,GroupId,isVeg } =
    formDataa;


  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("ItemName", ItemName);
  formData.append("category_id", category_id);
  formData.append("subCategory_id", subCategory_id);
  formData.append("sub_subCategory_id", sub_subCategory_id);
  formData.append("Status", Status);
  formData.append("GroupId", GroupId);
  formData.append("isVeg", isVeg);



  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/store_items`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    

    return response;
  } catch (error) {
    throw error;
  }
};

// CreteOfferZone
export const CreteOfferZone = async ({ formDataa }) => {
    ("Preparing to send data to backend:", formDataa);

  // Destructure the fields from `formDataa`
  const { zoneName, uploadedImages, Status, Device } = formDataa;

  // Validate required fields
  if (
    !zoneName ||
    !Array.isArray(uploadedImages) ||
    uploadedImages.length === 0 ||
    !Status ||
    !Device
  ) {
    console.error(
      "Missing required fields: zoneName, uploadedImages, Status, or Device"
    );
    return;
  }

    ("Validated data:", { zoneName, uploadedImages, Status, Device });

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create and populate FormData object
  const formData = new FormData();
  formData.append("zoneName", zoneName);
  formData.append("status", Status);
  formData.append("Device", Device);

  // Append uploadedImages to FormData
  uploadedImages.forEach((image, index) => {
    formData.append(`uploadedImages[${index}]`, image);
  });

  try {
    // API POST request
    const response = await axios.post(
      `${baseurl}/api/admin/CreteOfferZone`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      ("Offer zone created successfully:", response.data.message);
    return response; // Return response data for further use
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(
        "Error creating offer zone:",
        error.response.data.message || "An error occurred.",
        "Status Code:",
        error.response.status
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error; // Re-throw error for upstream handling
  }
};

// CreteDeliveryExecutive

export const CreteDeliveryExecutive = async ({ formDataa }) => {
    ("READY FOR GOING TO BACKEND", formDataa);

  // Destructuring the fields from `formData`
  const { name, phone, email, password, address } = formDataa;

    (
    "Data being sent to backend:",
    name,
    phone,
    email,
    password,
    address
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("address", address);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/store_newDelivery_Executive`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
   
    return error.response;
  }
};

// CreateOffer

export const CreateOffer = async ({ formDataa }) => {
    ("READY FOR GOING TO BACKEND", formDataa);

  // Destructuring the fields from `formData`
  const {
    PostedDate,
    offerName,
    OfferPercentValue,
    category_id,
    subCategory_id,
    sub_subCategory_id,
    item_id,
    startDate,
    endDate,
    Status,
    looseVariantId,
    PacketVariantId,
    group_id
  } = formDataa;


  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("PostedDate", PostedDate);
  formData.append("offerName", offerName);
  formData.append("OfferPercentValue", OfferPercentValue);
  formData.append("category_id", category_id || "");
  formData.append("group_id", group_id || "");

  formData.append("subCategory_id", subCategory_id || "");
  formData.append("sub_subCategory_id", sub_subCategory_id || "");
  formData.append("item_id", item_id || "");
  formData.append("startDate", startDate);
  formData.append("endDate", endDate);
  formData.append("Status", Status);
  formData.append("looseVariantId", looseVariantId || "");
  formData.append("PacketVariantId", PacketVariantId || "");

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/CreateOffer`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    return error.response;
  }
};

// Create Signup Offer
export const CreateSignUpOffer = async (
  Merchant_userId,
  Created_for_warehouse,
  offer_name,
  offer_mrp,
  offer_discount,
  offer_cashback,
  offer_description,
  offer_status,
  offer_image_path,
  offerItemBucket
) => {
    (Merchant_userId);

    (offer_name);
    (offer_mrp);
    (offer_discount);
    (offer_cashback);
    (offer_description);
    (offer_status);
    (offer_image_path);
    (offerItemBucket);



  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("Merchant_Id", Merchant_userId);
  formData.append("Created_for_warehouse", Created_for_warehouse);


  formData.append("offer_name", offer_name);
  formData.append("offer_mrp", offer_mrp);
  formData.append("offer_discount", offer_discount);
  formData.append("offer_cashback", offer_cashback);
  formData.append("offer_description", offer_description);
  formData.append("offer_status", offer_status);
  // formData.append('offer_image_path', offer_image_path);

  if (offer_image_path instanceof File) {
      ("Image is a file:", offer_image_path);

    formData.append("offer_image_path", offer_image_path);
  }

  offerItemBucket.forEach((item, index) => {

    if(item.looseVariantId){

          formData.append(
      `offerItemBucket[${index}][looseVariantId]`,
      item.looseVariantId
    );


        formData.append(
      `offerItemBucket[${index}][PacketVariantId]`,
      ""
    );


    }
    else if(item.PacketVariantId){

      

    formData.append(
      `offerItemBucket[${index}][PacketVariantId]`,
      item.PacketVariantId
    );

              formData.append(
      `offerItemBucket[${index}][looseVariantId]`,
      ""
    );


    }





  });

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/CreateSignUpOffer`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    return error.response;
  }



};

// placeOrder

export const placeOrder = async () => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  const currentDate = new Date().toISOString().split("T")[0];
    (currentDate);

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("message", "PLACE_ORDER");
  formData.append("current_date", currentDate);

  try {
    // Make the POST request to the API
    const response = await axios.post(`${baseurl}/api/placeOrder`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });


    // Log the response and return the data
    return response;
  } catch (error) {
    throw error;
  }
};

export const OrderCancelByCustomer = async ({
  message,
  orderId,
  OrderItemId,
  reason,
}) => {
  log("OrderCancelByCustomer", orderId, reason);
  log("OrderItemId", OrderItemId);

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  const currentDate = new Date().toISOString().split("T")[0];
    (currentDate);

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("orderId", orderId);
  formData.append("reason", reason);
  formData.append("currentDate", currentDate);
  formData.append("message", message);
  // formData.append("OrderItemId", OrderItemId);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/Od-CancelByUser`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    return error.response;
  }
};

// DecreaseOrderItemQuantity
export const DecreaseOrderItemQuantity = async (
  cancellation_type,
  reason,
  message,
  decreasingQuantity,
  Order_itemId
) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  const currentDate = new Date().toISOString().split("T")[0];

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("Order_itemId", Order_itemId);
  formData.append("reason", reason);
  formData.append("cancellation_type", cancellation_type);

  formData.append("decreasingQuantity", decreasingQuantity);
  formData.append("currentDate", currentDate);
  formData.append("message", message);
  // formData.append("OrderItemId", OrderItemId);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/DecreaseOrderItemQuantity`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    throw error
  }
};

// **************************MERCHANT*****************************

// CreateHomeManagementCategory

export const CreateHomeManagementCategory = async ({ formDataa }) => {
    ("READY FOR GOING TO BACKEND", formDataa);

  // Destructuring the fields from `formData`
  const {
    device,
    PostedDate,
    CategoryTitle,
    category_id,
    subCategory_id,
    sub_subCategory_id,
    Status,
  } = formDataa;

    (
    "Data being sent to backend:",
    device,
    PostedDate,
    CategoryTitle,
    category_id,
    subCategory_id,
    sub_subCategory_id,
    Status
  );

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("device", device);
  formData.append("PostedDate", PostedDate);
  formData.append("CategoryTitle", CategoryTitle);
  formData.append("category_id", category_id);
  formData.append("subCategory_id", subCategory_id);
  formData.append("sub_subCategory_id", sub_subCategory_id);
  formData.append("Status", Status);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/CreateHomeManagementCategory`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    return error.response;
  }
};

// uploadMainBanner

export const uploadMainBanner = async (newBanner) => {
    (newBanner);

  // Debug log (optional)
  console.debug("Uploading new banner:", newBanner);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    toast.error("Authorization token is missing. Please log in.");
    return { error: "Authorization token missing" };
  }

  try {
    // Construct FormData for the file and other payload
    const formData = new FormData();
    formData.append("image", newBanner.image); // Image file
    formData.append("device", newBanner.device);
    formData.append("status", newBanner.status);

    newBanner.offerIds.forEach((offerId) => {
      formData.append("offerIds[]", offerId); // Use 'offerIds[]' to represent an array
    });

    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/uploadMainBanner`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Check response and handle success or error
    if (response) {
      toast.success("Banner uploaded successfully!");
      return response.data;
    } else {
      toast.error("Failed to upload banner. Please try again.");
      return { error: "Unexpected response", details: response };
    }
  } catch (error) {
    // Handle errors
    console.error("Error during uploadMainBanner:", error);

    // Show user-friendly error messages
    if (error.response) {
      toast.error(
        `Failed to upload banner: ${
          error.response.data?.message || "Unknown error"
        }`
      );
    }

    return { error: "Request failed", details: error.response };
  }
};

// uploadFeaturedBanner

export const uploadFeaturedBanner = async (newBanner) => {
    (newBanner);

  // Debug log (optional)
  console.debug("Uploading new banner:", newBanner);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    toast.error("Authorization token is missing. Please log in.");
    return { error: "Authorization token missing" };
  }

  try {
    // Construct FormData for the file and other payload
    const formData = new FormData();
    formData.append("device", newBanner.device);
    formData.append("status", newBanner.status);

    newBanner.offerIds.forEach((offerId) => {
      formData.append("offerIds[]", offerId); // Use 'offerIds[]' to represent an array
    });

    newBanner.images.forEach((image) => {
      formData.append("image[]", image); // Use 'offerIds[]' to represent an array
    });

    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/uploadFeaturedBanner`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Check response and handle success or error
    if (response) {
      toast.success("featured uploaded successfully!");
      return response.data;
    } else {
      toast.error("Failed to upload banner. Please try again.");
      return { error: "Unexpected response", details: response };
    }
  } catch (error) {
    // Handle errors
    console.error("Error during uploadMainBanner:", error);

    // Show user-friendly error messages
    if (error.response) {
      toast.error(
        `Failed to upload banner: ${
          error.response.data?.message || "Unknown error"
        }`
      );
    }

    return { error: "Request failed", details: error.response };
  }
};

// uploadFeaturedBannerImage

export const uploadFeaturedBannerOfferIds = async (newBanner) => {
    (newBanner);

  // Debug log (optional)
  console.debug("Uploading new banner:", newBanner);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    toast.error("Authorization token is missing. Please log in.");
    return { error: "Authorization token missing" };
  }

  try {
    // Construct FormData for the file and other payload
    const formData = new FormData();
    formData.append("featuredBannerId", newBanner.featuredBannerId);
    formData.append("imageId", newBanner.image.id);

    newBanner.offerIds.forEach((offerId) => {
      formData.append("offerIds[]", offerId); // Use 'offerIds[]' to represent an array
    });

    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/uploadFeaturedBannerOfferIds`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Check response and handle success or error
    if (response) {
      return response.data;
    } else {
      toast.error("Failed to upload banner. Please try again.");
      return { error: "Unexpected response", details: response };
    }
  } catch (error) {
    // Handle errors
    console.error("Error during uploadMainBanner:", error);

    // Show user-friendly error messages
    if (error.response) {
      toast.error(
        `Failed to upload banner: ${
          error.response.data?.message || "Unknown error"
        }`
      );
    }

    return { error: "Request failed", details: error.response };
  }
};

export const CancelledItemSubmission = async (id) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/CancelledItemSubmission/${id}`,
      {}, // Pass an empty object for the data (if no payload is needed)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    console.error("Error during CancelledItemSubmission:", error);
    return error.response;
  }
};

export const OrderCancelRequestByMerchant = async ({
  message,
  orderId,
  reason,
}) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  const currentDate = new Date().toISOString().split("T")[0];
    (currentDate);

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("orderId", orderId);
  formData.append("reason", reason);
  formData.append("currentDate", currentDate);
  formData.append("message", message);
  // formData.append("OrderItemId", OrderItemId);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/OrderCancelledRequestByMerchant`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    return error.response;
  }
};

// AssignDelivery_Executive__

export const AssignDelivery_Executive__ = async (
  selectedExecutive,
  selectedOrderIds
) => {
    (selectedExecutive, selectedOrderIds);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  const currentDate = new Date().toISOString().split("T")[0];
    (currentDate);
  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("selectedExecutive", selectedExecutive);
  formData.append("selectedOrderIds", selectedOrderIds);
  formData.append("currentDate", currentDate);

  selectedOrderIds.forEach((orderId, index) => {
    formData.append(`selectedOrderIds[${index}][orderId]`, orderId || "");
  });

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/assignDeliveryExecutive`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    return error.response;
  }
};

export const MakeFreeDeliveryExecutive = async (selectedExecutive) => {
  const formData = new FormData();

  // Append invoice details
  formData.append("DelvieryExecutiveId", selectedExecutive);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/makefreeDeliveryBoyy/${selectedExecutive}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Schedule_timeDate = async ({ date, time, orderId }) => {
    (date, time, orderId);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("date", date);
  formData.append("time", time);
  formData.append("orderId", orderId);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/editDelivery_timeDate`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(
        "Error posting purchase:",
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

// AddDeliveryDate

export const AddDeliveryDate = async ({ pincode, noOfDays, time }) => {
    (pincode, noOfDays, time);

  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("pincode", pincode);
  formData.append("noOfDays", noOfDays);
  formData.append("time", time);

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/admin/storepincodeDeliveryDate`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(
        "Error posting purchase:",
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

// assignDeliveryExecutive

export const dymmythings = async () => {
  // Create a FormData object
  const formData = new FormData();

  // Append invoice details
  formData.append("pincode", "534534");
  formData.append("noOfDays", "54");
  formData.append("time", "54335");

  try {
    // Make the POST request to the API
    const response = await axios.post(
      `${baseurl}/api/dboy/track_delivery_executive`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${"690|VDwc8cEYbybOjSdeJ90F4VvHvZbRoaKYKWtO4lZZa28216d3"}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      (response);

    // Log the response and return the data
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(
        "Error posting purchase:",
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
