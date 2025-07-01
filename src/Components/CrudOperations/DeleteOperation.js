import axios from "axios";
import baseurl from "./customURl";
import { toast } from "react-toastify";

const Merchant_token = localStorage.getItem("Merchanttoken") || null;
const User_token = localStorage.getItem("token") || null;

export const DeletePacketImage = async (id) => {
  try {
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      console.error("No Sanctum token found");
      return;
    }

    const response = await axios.delete(
      `${baseurl}/api/admin/DeletePacketImage/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Upload error:", error);
    throw error;
  }
};

// SingUpOffer_idCancellation_from_Cart

export const SingUpOffer_idCancellation_from_Cart = async (
  cartItem_id,
  singUpOffer_id,
  Latitude,
  Longitude,
  AreaPin
) => {
  cartItem_id;
  singUpOffer_id;
  Latitude;
  Longitude;
  AreaPin;
  User_token;

  if (!User_token) {
    ("user token not exist");

    toast.warn("Please Login Or SignUp");
  }

  console.log(User_token);

  try {
    const response = await axios.post(
      `${baseurl}/api/SingUpOffer_idCancellation_from_Cart`,
      {
        grocery_cart_Item_id: cartItem_id,
        singUpOffer_id,
        Latitude,
        Longitude,
        AreaPin,
      },
      {
        headers: {
          Authorization: `Bearer ${User_token}`,
        },
      }
    );
    response;

    if (response) {
      "Singup Offer Cancelled successfully:", response;

      return response;
    }
  } catch (error) {
    return error.response;
  }
};

export const Delete_Particular_addresss = async ({ id, token }) => {
  try {
    const response = await axios.delete(`${baseurl}/api/addresses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    response;

    if (response) {
      return response;
    }
  } catch (error) {
    return error.response;
  }
};

// DeleteDeliveryDate

export const DeleteDeliveryDate = async (id) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    console.error("Authorization token is missing. Please log in.");
    return;
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/deleteDeliveryDate/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Delivery Dates Deleted Successfully!!:", response;

      return response;
    }
  } catch (error) {
    // if (error.response && error.response.data && error.response.data.message) {
    //   console.error("Error posting address:", error.response.data.message);
    //   // Handle specific error message
    // } else {
    //   console.error("Error posting address:", error);
    //   // Handle generic error
    // }
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// deleteMainCategory

export const deleteMainCategory = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletecategory/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Address Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    return error.response;
    // if (error.response && error.response.data && error.response.data.message) {
    //   console.error("Error posting address:", error.response.data.message);
    //   // Handle specific error message
    // } else {
    //   console.error("Error posting address:", error);
    //   // Handle generic error
    // }
    throw error; // Re-throw the error for any higher-level error handling
  }
};

export const deleteGroup = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteGroup/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Address Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    return error.response;
    // if (error.response && error.response.data && error.response.data.message) {
    //   console.error("Error posting address:", error.response.data.message);
    //   // Handle specific error message
    // } else {
    //   console.error("Error posting address:", error);
    //   // Handle generic error
    // }
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// Refferals *****************************************************************************************

export const DeleteRefferal_Configuraion = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/DeleteRefferalConfiguration/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    return response;
  } catch (error) {
    return error.response;
    // if (error.response && error.response.data && error.response.data.message) {
    //   console.error("Error posting address:", error.response.data.message);
    //   // Handle specific error message
    // } else {
    //   console.error("Error posting address:", error);
    //   // Handle generic error
    // }
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// offeritem

// Delete_particular_OfferItem

export const Delete_particular_OfferItem = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/Delete_particular_OfferItem/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteParticular_SignUp_offer_FromDataBase = async ({
  id,
}) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/handleDeleteParticular_SignUp_offer_FromDataBase/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    return response;
  } catch (error) {
    return error.response;
  }
};

export const deleteSubCategory = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletesubcategories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Address Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    return error.response;
  }
};

export const DeleteSubSubCategory = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteSubSubCategory/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Address Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    return error.response;
  }
};

export const DeleteItemImage = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteItemImage/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Address Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteSpecification

export const DeleteSpecification = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteItemSpecification/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Address Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// deleteUser

export const deleteUser = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteUser/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "User Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteStock

export const DeleteStock = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletestocks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "User Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// deleteDeliveryConstraint

export const DeleteDeliveryChargeOnDistance = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletedeliveryChargesOnDistance/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "User Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

export const DeleteDeliveryChargeOnValue = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletedeliveryChargesOnValue/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "User Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// delterwarehouse

export const delterwarehouse = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletewarehouse/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "User Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// Deletepincode

export const Deletepincode = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletePinCode/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "User Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteSupplier

export const DeleteSupplier = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteSupplier/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "User Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteBrand

export const DeleteBrand = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteBrand/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "User Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteUnit

export const Deleteunit = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteunit/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeletePurchase

export const DeletePurchase = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletepurchase/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteLooseStock

export const DeleteLooseStock = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteloose_stock/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeletePacketStock

export const DeletePacketStock = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletepacketStock/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteLooseVarient

export const DeleteLooseVarient = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteloose_Varient/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteLooseVarientwholeItem

export const DeleteLooseVarientwholeItem = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteloose_Varient_wholeItem/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      return response;
    }
  } catch (error) {
    return error.response; // Re-throw the error for any higher-level error handling
  }
};

// DeletePacketVarientwholeItem

export const DeletePacketVarientwholeItem = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/DeletePacketVarientwholeItem/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      return response;
    }
  } catch (error) {
    return error.response; // Re-throw the error for any higher-level error handling
  }
};

// DeletePacketVarient

export const DeletePacketVarient = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletePacket_Varient/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    return error.response;
  }
};

// DeleteCreatedOffer

export const DeleteCreatedOffer = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteOffer/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// deltetePacketVarientImages

export const deltetePacketVarientImages = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletePacket_Varient_Images/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

export const delteteGST = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletegst/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// deletePurchaseItem

export const deletePurchaseItem = async ({ id }) => {
  id;
  const token = localStorage.getItem("Merchanttoken");
  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deletepurchaseItem/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "unit Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// deleteItem

export const deleteStoredItem = async ({ id }) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/deleteStoredItem/${id}`,
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

// DeleteMainBanner
export const DeleteBanner = async (bannerId) => {
  bannerId;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/DeleteBanner/${bannerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Banner Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteFeaturedBanner
export const DeleteFeaturedBanner = async (bannerId) => {
  bannerId;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/DeleteFeaturedBanner/${bannerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Banner Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// DeleteFeaturedBannerOffer
export const DeleteFeaturedBannerOffer = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/DeleteFeaturedBannerOffer/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      "Banner Deleted successfully:", response;

      return response;
    }
  } catch (error) {
    throw error; // Re-throw the error for any higher-level error handling
  }
};

// destroyDesktopHomeManagementCategory

export const destroyDesktopHomeManagementCategory = async (id) => {
  id;

  const token = localStorage.getItem("Merchanttoken");

  if (!token) {
    return console.error("No Sanctum token found");
  }

  try {
    const response = await axios.delete(
      `${baseurl}/api/admin/destroyDesktopHomeManagementCategory/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    response;

    if (response) {
      return response;
    }
  } catch (error) {
    return error.response;
  }
};
