import axios from 'axios';
import baseurl from './customURl';
import { toast } from 'react-toastify';


  const Merchant_token = localStorage.getItem('Merchanttoken') || null;
  const User_token = localStorage.getItem('token') || null;



// ************************** user Refferal ****************************




export const getUserReferralDetails = async () => {


    if(!User_token){
toast.warn("token is missing!!!");
        return;
    }

   

    try {
        const response = await axios.get(`${baseurl}/api/getUserReferralDetails`, {
            headers: {
                Authorization: `Bearer ${User_token}`
            }
        });
        if(response){
            return response;
        }

    } catch (error) {
          ('Error fetching tables', error);
        return error.response;
    }

    
};



export const GetUser_RefferalWallet = async () => {


    if(!User_token){
toast.warn("token is missing!!!");
        return;
    }

   

    try {
        const response = await axios.get(`${baseurl}/api/getUserReferralBalance`, {
            headers: {
                Authorization: `Bearer ${User_token}`
            }
        });
                  return response;

    } catch (error) {
        throw error
    }

    
};




export const Admin_getReferralMilestones = async () => {


    if(!Merchant_token){
toast.warn("token is missing!!!");
        return;
    }

   

    try {
        const response = await axios.get(`${baseurl}/api/admin/admingetReferralMilestones`, {
            headers: {
                Authorization: `Bearer ${Merchant_token}`
            }
        });
                  return response;

    } catch (error) {
        throw error
    }

    
};




export const getReferralMilestones = async () => {


    if(!User_token){
toast.warn("token is missing!!!");
        return;
    }

   

    try {
        const response = await axios.get(`${baseurl}/api/getReferralMilestones`, {
            headers: {
                Authorization: `Bearer ${User_token}`
            }
        });
                  return response;

    } catch (error) {
        throw error
    }

    
};


export const getReferralDetails = async () => {


    if(!User_token){
toast.warn("token is missing!!!");
        return;
    }

   

    try {
        const response = await axios.get(`${baseurl}/api/getReferralDetails`, {
            headers: {
                Authorization: `Bearer ${User_token}`
            }
        });
                  return response;

    } catch (error) {
        throw error
    }

    
};


export const getReferralTransactions = async () => {


    if(!User_token){
toast.warn("token is missing!!!");
        return;
    }

   

    try {
        const response = await axios.get(`${baseurl}/api/getReferralTransactions`, {
            headers: {
                Authorization: `Bearer ${User_token}`
            }
        });
                  return response;

    } catch (error) {
        throw error
    }

    
};















// *****************************SuperAdmin ____ superadmintoken****************************************************** 

export const GetLogo = async () => {



    try {
        const response = await axios.get(`${baseurl}/api/superadmin/get-logo`);

        if(response){
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};



export const GetAllroles = async () => {
    const token = localStorage.getItem('superadmintoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/superadmin/getAllRoles`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};






export const GetUserData = async () => {
    const token = localStorage.getItem('token');
    // const token = JSON.parse(response);
      (token);

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/getUserData`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


export const showroles = async () => {
    const token = localStorage.getItem('superadmintoken');

    if (!token) {
        return console.error('No Sanctum token found');
    }

    try {
        const response = await axios.get(`${baseurl}/api/superadmin/showadmins`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


// fetch current login marchant data 

export const MerchantDetails = async () => {
    const tokenString = localStorage.getItem('Merchanttoken');
    if (!tokenString) {
        console.error('No token found in localStorage');
        return null;
    }

    // No need to use JSON.parse since the token is a plain string
    const token = tokenString;

    try {
        const response = await axios.get(`${baseurl}/api/admin/merchant-totalSales`, {
        // const response = await axios.get(`${baseurl}/api/auth-merchant`, {

            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response) {
            return response.data;
        }
    } catch (error) {
        return error.response;
    }
};


// fetch current login marchant data 

export const getTotalSales = async () => {
    const tokenString = localStorage.getItem('Merchanttoken');
    if (!tokenString) {
        console.error('No token found in localStorage');
        return null;
    }

    // No need to use JSON.parse since the token is a plain string
    const token = tokenString;

    try {
        const response = await axios.get(`${baseurl}/api/admin/get-sales-data`, {
        // const response = await axios.get(`${baseurl}/api/auth-merchant`, {

            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response) {
            return response.data;
        }
    } catch (error) {
        return error.response;
    }
};


// fetch current login marchant data 

export const getNewOrders = async () => {
    const tokenString = localStorage.getItem('Merchanttoken');
    if (!tokenString) {
        console.error('No token found in localStorage');
        return null;
    }

    // No need to use JSON.parse since the token is a plain string
    const token = tokenString;

    try {
        const response = await axios.get(`${baseurl}/api/admin/getNewOrders-graph`, {
        // const response = await axios.get(`${baseurl}/api/auth-merchant`, {

            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response) {
            return response.data;
        }
    } catch (error) {
        return error.response;
    }
};

export const GetNewCustomer_graph = async () => {
    const tokenString = localStorage.getItem('Merchanttoken');
    if (!tokenString) {
        console.error('No token found in localStorage');
        return null;
    }

    // No need to use JSON.parse since the token is a plain string
    const token = tokenString;

    try {
        const response = await axios.get(`${baseurl}/api/admin/getNewusers-graph`, {
        // const response = await axios.get(`${baseurl}/api/auth-merchant`, {

            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response) {
            return response.data;
        }
    } catch (error) {
        return error.response;
    }
};


// Import UserDetails

export const ImportCustomerDetails = async (login) => {

   

    try {
        const response = await axios.get(`${baseurl}/api/auth-users`, {
            headers: {
                Authorization: `Bearer ${login}`
            }
        });
        if(response){
            return response;
        }

    } catch (error) {
          ('Error fetching tables', error);
        return error.response;
    }

    
};




export const Show_Users_Groups_for_Creating_Offer = async () => {

   

    try {
        const response = await axios.get(`${baseurl}/api/Show_Users_Groups_for_Creating_Offer`, {
           
        });

                return response;


    } catch (error) {
        throw error;
    }

    
};



export const fetchParticular_grouid_data = async (id) => {
  const token = localStorage.getItem('Merchanttoken');

  try {
    const response = await axios.get(`${baseurl}/api/admin/fetchParticular_grouid_data/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};



export const AllUseFullCategories = async () => {
  const token = localStorage.getItem('Merchanttoken');
   

    try {
        const response = await axios.get(`${baseurl}/api/admin/AllUseFullCategories`, {

              headers: {
        Authorization: `Bearer ${token}`,
      },
           
        });


          (response);
        

        return response;

    } catch (error) {
        throw error;
    }

    
};





// Show_Users_MainCategory

export const Show_Users_MainCategory = async ({id,pincode}) => {

   

    try {
        const response = await axios.get(`${baseurl}/api/all_maincategories/${id}/${pincode}`, {
           
        });

        return response;

    } catch (error) {
        throw error;
    }

    
};

// Show_users_SubCategory

export const Show_users_SubCategory = async () => {
    try {
        const response = await axios.get(`${baseurl}/api/all_subcategories`, {
           
        });

        if(response){
            return response.data;
        }

    } catch (error) {
        return error.response;
    }
};

// Show_Users_Sub_SubCategory

export const Show_Users_Sub_SubCategory = async () => {
    try {
        const response = await axios.get(`${baseurl}/api/all_SubSubCategory`, {
           
        });

        if(response){
            return response.data;
        }

    } catch (error) {
        return error.response;
    }
};

// getsubCategoryItem

export const getAllItem = async ({id,type,pincode}) => {
      (id,type);
    
    try {
        const response = await axios.get(`${baseurl}/api/getItems/${id}/${type}/${pincode}`);

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {

        
        return error?.response;
    }
};


// GetVariantDetails

export const GetVariantDetails = async (Variantid,Varient_type,purchase_item_id,stock_id ,area_pin) => {
      (Variantid);
      (Varient_type);
      (purchase_item_id);
      (stock_id);
      (area_pin);


    
    
    try {
        const response = await axios.get(`${baseurl}/api/getVariantsDetails/${Variantid}/${Varient_type}/${purchase_item_id}/${stock_id}/${area_pin}`); 
           return response;
    } catch (error) {
        throw error
    }
};


// getdesktopUIMainBanner

export const getdesktopUIMainBanner = async (pincode) => {


    try {
        const response = await axios.get(`${baseurl}/api/getDesktopMainBannersInCustomerUI/${pincode}`, {
          
        });

           return response;

    } catch (error) {
           throw error;
    }
};


// getMainBannerUptoOfferItems

export const getMainBannerUptoOfferItems = async (bannerId) => {


    try {
        const response = await axios.get(`${baseurl}/api/getMainBannerUptoOfferItems/${bannerId}`);

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};


// getFeaturedBannerUptoOfferItems

export const getFeaturedBannerUptoOfferItems = async (ImageId) => {


    try {
        const response = await axios.get(`${baseurl}/api/getFeaturedBannerUptoOfferItems/${ImageId}`);

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};





// getUptoOfferItems


export const getUptoOfferItems = async () => {


    try {
        const response = await axios.get(`${baseurl}/api/getDesktopMainBannersInCustomerUI`, {
          
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};



// Get Group Category

export const ShowGroupCategories = async () => {
    const token = localStorage.getItem('Merchanttoken');

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/all_Groupcategories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
          ('Error fetching tables', error);
    }
};








// Refferals *****************************************************************************************


export const getRefferal_Configuraion = async () => {
    const token = localStorage.getItem('Merchanttoken');

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getRefferal_Configuraion`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
          ('Error fetching tables', error);
    }
};

//Admin Side SignUp Offer *****************************************************************************************



export const getSingupAllOffers = async () => {
    const token = localStorage.getItem('Merchanttoken');

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getSingupAllOffers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
          ('Error fetching tables', error);
    }
};


export const Get_Singup_Edited_Data = async (EditData) => {
    const token = localStorage.getItem('Merchanttoken');

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/Get_Singup_Edited_Data/${EditData}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
         return error.response;
    }
};


// User Side SignUp Offer *****************************************************************************************



export const GetUserSingUpOffer = async (AreaPin) => {

    try {
        const response = await axios.get(`${baseurl}/api/GetUserSingUpOffer/${AreaPin}`);

           return response;
    } catch (error) {
        throw error;

    }
};








// Get Main Category

export const ShowMainCategory = async () => {
    const token = localStorage.getItem('Merchanttoken');

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/all_maincategories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
          ('Error fetching tables', error);
    }
};


// Get SubCategory

export const ShowSubCategory = async () => {
    const token = localStorage.getItem('Merchanttoken');
      (token);
    

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/all_subcategories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};



// Get GetMerchantDetails

export const GetMerchantDetails = async () => {
    const token = localStorage.getItem('Merchanttoken');
      (token);
    

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/auth-merchant`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
        return error.response;
    }
};


// Get Sub_subCategory

export const Show_Sub_SubCategory = async () => {
    const token = localStorage.getItem('Merchanttoken');


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/all_SubSubCategory`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response.data;
        }

    } catch (error) {
        return error.response;
    }
};




export const GetUserAddresses = async () => {
    const response = localStorage.getItem('token');
    const token = JSON.parse(response);
      (token);

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/getUseraddresses`, {
            headers: {
                Authorization: `Bearer ${token.token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};



export const GetItemDetails = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getItems/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


export const GetUsersDetails = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getUsers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


export const getAllOrders = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllOrders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


export const Admin_all_referrals = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/Admin_all_referrals`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

       return response;

    } catch (error) {
        throw error
    }
};



export const Admin_ReferrerMilestoneSummary = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/Admin_ReferrerMilestoneSummary`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

       return response;

    } catch (error) {
        throw error
    }
};


export const Admin_ReferrerMilestoneTracking = async (referrer_id) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/Admin_ReferrerMilestoneTracking/${referrer_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

       return response;

    } catch (error) {
        throw error
    }
};


export const getPendingMilestoneRequests = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getPendingMilestoneRequests`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

       return response;

    } catch (error) {
        throw error
    }
};





// GetAllConfirmPayments

export const GetAllConfirmPayments = async () => {
    const token = localStorage.getItem('Merchanttoken');


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getConfirmPayments`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// GetPaymentDetailResponse

export const GetPaymentDetailResponse = async (orderId) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/GetPaymentDetailResponse/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
          (response);
        

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


// AllDeliveryExecutive_retrive


export const AllDeliveryExecutive_retrive = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllExecutive`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// OrderItem

export const OrderItem = async (item) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/OrderItems/${item}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// order Delivery 

export const order_DeliveryData = async (item) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/OrderDelivery/${item}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// order_Confirm_Payment_details

export const order_Confirm_Payment_details = async (item) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/ConfirmOrder/${item}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


export const GetdeliveryCargesOnDistance = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getDeliveryChargesOnDistance`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


export const GetdeliveryCargesOnValue = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getDeliveryChargesOnValue`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// getwareHouses

export const GetwareHouses = async () => {
    const token = localStorage.getItem('Merchanttoken');


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getwarehouses`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
            return response;
        }

    } catch (error) {
        return error.response;
    }
};


// getAllPincode


export const getAllPincode = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllPinCodes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};




// VerifyPinCode


export const VerifyPinCode = async ($pincode) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/verifyPincode/${$pincode}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// Supplier

export const getAllSupplier = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllSupplier`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


// brand

export const getAllBrand = async () => {
    const token = localStorage.getItem('Merchanttoken');


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllBrand`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
        return error.response;
    }
};


// brand

export const getAllUnit = async () => {
    const token = localStorage.getItem('Merchanttoken');


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllunit`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
        return error.response;
    }
};


// getAllPurchase

export const getAllPurchase = async () => {
    const token = localStorage.getItem('Merchanttoken');


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllpurchase`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
        return error.response;
    }
};


// getAllPurchaseItems


export const getAllPurchaseItems = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllPurchaseItems`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};



// getAllStockItem

export const getAllStockItem = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllStockItems`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


// getAllLooseVariantsRegarding

export const getAllLooseVariantsRegarding = async (variantId) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllLooseVariantsRegarding/${variantId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
        return error.response;
    }
};



// getAll__Unique_purchased_packet_item

export const getAll__Unique_purchased_packet_item = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAll__Unique_purchased_packet_item`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
          (response);
        

         return response;

    } catch (error) {
          (error);

        throw error
    }
};





// getAllPacketStock

export const getAllPacketStock = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllpacketStock`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
          (response);
        

         return response;

    } catch (error) {
          (error);

        throw error
    }
};

// get_Warehouse_Stock



export const get_Warehouse_Stock = async (stock_type , warehouse_unique_id) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/get_Warehouse_Stock/${stock_type}/${warehouse_unique_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

           return response;

    } catch (error) {
        throw error;
    }
};






// getAllLooseStock

export const getAllLooseStock = async () => {
    const token = localStorage.getItem('Merchanttoken');


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllloose_stock`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

                 return response;


    } catch (error) {
        throw error;
    }
};



// getAllPacketStock

export const getAllLooseVarient = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllloose_Varient`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};



export const getAllLooseVarientForCreatingOFFER = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllLooseVarientForCreatingOFFER`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


export const LooseVariants_for_CreateSingupAllOffers = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/LooseVariants_for_CreateSingupAllOffers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// GetItemVariants_for_creating_SingUpOffer

export const GetItemVariants_for_creating_SingUpOffer = async (Created_for_warehouse) => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/GetItemVariants_for_creating_SingUpOffer/${Created_for_warehouse}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        throw error
    }
};


export const getAllPacketVarientForCreatingOFFER = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllPacketVarientForCreatingOFFER`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


export const getAllpacketVariants_CreatingFor_SignupOffer = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllpacketVariants_CreatingFor_SignupOffer`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};



// getAllLooseStock

export const getAllPacketVarient = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllpacket_Varient`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

               return response;
    } catch (error) {

        throw error;
    }
};




  // getAllLooseStock

export const fetchWarehousesPincode = async () => {
    const token = localStorage.getItem('Merchanttoken');
      ("Chala");
    


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getwarehousesPincode`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

                return response;

    } catch (error) {
          ('Error fetching tables', error);

        throw error;
    }
};


// getAllLooseStock

export const getAllDiscounts = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllDiscounts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// get_gst

export const getAllGST = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllgstRates`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// GetAllCreatedItems


export const GetAllCreatedItems = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllItems`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};



// GetAllCreatedItemsforCreatingpacketVarients


export const GetAllCreatedItemsforCreatingpacketVarients = async () => {
    const token = localStorage.getItem('Merchanttoken');


    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/GetAllCreatedItemsforCreatingpacketVarients`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
        return error.response;
    }
};


// GetAllCreatedItemsForCreatingVarients


export const GetAllCreatedItemsForCreatingVarients = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/GetAllCreatedItemsForCreatingVarients`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);

        return response.error;
    }
};

// GetAllCreatedDeliveryExecutive


export const GetAllCreatedDeliveryExecutive = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/GetAllCreatedDeliveryExecutive`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// GetAllOffers

export const GetAllOffers = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllOffers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


// Banners ****************************************** Banner ********************************************* Banner ********************

// GetDesktopMainBanners

export const GetDesktopMainBanners = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getdesktop-mainBanner`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};



// GetDesktopFeaturedBanners

export const GetDesktopFeaturedBanners = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getdesktop-FeaturedBanner`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};

// GetDesktopFeaturedZoneImageResponse

export const GetDesktopFeaturedZoneImageResponse = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/GetDesktopFeaturedZoneImageResponse`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};


// GetOfferZone

export const GetOfferZone = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/GetOfferZone`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};



// GetAllOffers

export const getActiveFeaturedZone = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getActiveFeaturedZone`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// CustomerUIFeaturedBanners

// getDesktopFeaturedBannersInCustomerUI


export const getDesktopFeaturedBannersInCustomerUI = async (pincode) => {


    try {
        const response = await axios.get(`${baseurl}/api/getDesktopFeaturedBannersInCustomerUI/${pincode}`);

             return response;

    } catch (error) {
            throw error;
    }
};



// getDesktopHomeManagementCategory

export const getDesktopHomeManagementCategory = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getDesktopHomeManagementCategory`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);

        return error.response;
    }
};





export const GetAllVarients = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllVarients`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// getAllAddress

export const getAllAddress = async () => {
    const token = localStorage.getItem('token');

      ("chala");

    if (!token) {
        return   ('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/getUseraddresses`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
            return response;
        }

    } catch (error) {
        
          ('Error fetching tables', error);

        return error.response;
    }
};

// getAllCartItems


export const getAllCartItems = async (AreaPin) => {
    const token = localStorage.getItem('token');


    if (!token) {
        return   ('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/getAllCartItems/${AreaPin}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
          (response);
        

        if(response){
            return response;
        }

    } catch (error) {
          ('Error fetching tables', error);
        return error.response;
    }
};

// getAllActivePincodes

export const getAllActivePincodes = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllActivePincodes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// /getAllDeliveyDates

export const getAllDeliveyDates = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllDeliveyDates`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// getAllNotAssignedOrder


export const getAllNotAssignedOrder = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAllNotAssignedOrder`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        return error.response;
    }
};

// getCancelledRequest

export const getCancelledRequest = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getCancelledRequest`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
          ('Error fetching tables', error);
    }
};


// getOnDeliveryExecutive
export const getOnDeliveryExecutive = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getOnDeliveryExecutive`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {

        console.error('Error fetching tables', error);
        return error.response;
    }
};

// GetExecutivesOrderHistory
export const GetExecutivesOrderHistory = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getExecutiveOrderhistory`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};

// checkPincodeAvailability

export const checkPincodeAvailability = async (pincode) => {
    const token = localStorage.getItem('Merchanttoken');


    try {
        const response = await axios.get(`${baseurl}/api/checkPincodeAvailability/${pincode}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

                    return response;


    } catch (error) {
            return error.response;

    }
};


// /getAvailableDeliveryExecutives


export const getAvailableDeliveryExecutives = async () => {
    const token = localStorage.getItem('Merchanttoken');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/admin/getAvailableDeliveryExecutive`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


// getUserOrders


export const getUserOrders = async () => {
    const token = localStorage.getItem('token');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/getUIOrders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
        console.error('Error fetching tables', error);
    }
};


// getOrderDetail

export const getOrderDetail = async (orderId) => {
    const token = localStorage.getItem('token');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/getOrderDetail/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response){
              (response);
            return response;
        }

    } catch (error) {
            return error.response;

    }
};

// getOrderBillFromDataBase

export const getOrderBillFromDataBase = async (orderId) => {
    const token = localStorage.getItem('token');

      ("chala");

    if (!token) {
        return console.error('No Sanctum token found');
        
    }

    try {
        const response = await axios.get(`${baseurl}/api/getOrderBill/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

       return response;

    } catch (error) {
            throw error;

    }
};





// getDesktopHomeManagementCategoryInCustomerUI

export const getDesktopHomeManagementCategoryInCustomerUI = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/getDesktopHomeManagementCategoryInCustomerUI/${pincode}`);
           return response;

    } catch (error) {
                throw error;
    }
};

// dsfd

// getDesktopHomeManagementGroupInCustomerUI

export const getDesktopHomeManagementGroupInCustomerUI = async (pincode) => {
       (pincode);
    
 

    try {
        const response = await axios.get(`${baseurl}/api/getDesktopHomeManagementGroupInCustomerUI/${pincode}`);

                  return response;


    } catch (error) {
        throw error;

    }
};


// getMegaUIGroupInCustomerUI

export const getMegaUIGroupInCustomerUI = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/getMegaUIGroupInCustomerUI/${pincode}`);
           (response);
        

        return response.data; // Return only the useful data

    } catch (error) {

       throw error; // Let the thunk handle it using rejectWithValue
    }
};



// getDesktopHomeManagementCategoryListingsInCustomerUI

export const getDesktopHomeManagementCategoryListingsInCustomerUI = async (GroupId) => {

      (GroupId);
    

    
    
 

    try {
        const response = await axios.get(`${baseurl}/api/getDesktopHomeManagementCategoryListingsInCustomerUI/${GroupId}`);
      
        

                 return response;


    } catch (error) {

          throw error;
    }
};



// ************************* users all categories.. ********************



// getDesktopHomeManagementCategoryInCustomerUI

export const AllGroups = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/AllGroups`);
           return response;

    } catch (error) {
                throw error;
    }
};



export const AllCategory = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/AllCategory`);
           return response;

    } catch (error) {
                throw error;
    }
};



export const AllSubCategory = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/AllSubCategory`);
           return response;

    } catch (error) {
                throw error;
    }
};



export const AllSubSubCategory = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/AllSubSubCategory`);
           return response;

    } catch (error) {
                throw error;
    }
};




export const AllItems = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/AllItems`);
           return response;

    } catch (error) {
                throw error;
    }
};



export const AllPacketVariant = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/AllPacketVariant`);
           return response;

    } catch (error) {
                throw error;
    }
};



export const AllLooseVariant = async (pincode) => {
 

    try {
        const response = await axios.get(`${baseurl}/api/AllLooseVariant`);
           return response;

    } catch (error) {
                throw error;
    }
};







export const checkMultiplePincodes = async (pincodes) => {
  const token = localStorage.getItem("Merchanttoken");

  let pinStr = "";

  if (Array.isArray(pincodes)) {
    pinStr = pincodes.join(",");
  } else if (typeof pincodes === "object" && pincodes?.pincodes) {
    pinStr = pincodes.pincodes;
  } else {
    pinStr = String(pincodes);
  }

  pinStr = pinStr.trim();

  if (!pinStr) return;

  try {
    const response = await axios.post(
      `${baseurl}/api/admin/checkMultiplePincodes`,
      { pincodes: pinStr },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};


