import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DecreaseItemQuantityToCart, IncreaseItemQuantityToCart, StoreItemToCart } from "../CrudOperations/PostOperation";
import { addCart, decreaseCart, importCartItems, increaseCart } from "../ReduxStore/Slices/cartSlice";
import { getAllAddress } from "../CrudOperations/GetOperation";
import { addAddress } from "../ReduxStore/Slices/auth";






const useAddressActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const filteredProducts = useSelector((state) => state.filteredProducts); // Update with the correct state path
  const Customer_userId = useSelector((state) => state.auth.Customer_userId);

  const ImportAddress = async () => {



        const response = await getAllAddress();
              (response);


            if(response && response?.data){
                dispatch(addAddress(response?.data?.addresses));
            }
            else{

                toast.error(response?.data?.message || response?.data?.error)
            }


    


    // const login = localStorage.getItem("token");

    // if (login) {
    //   const filterItem = items.find(
    //     (ele) => ele.sku_id == variantId
    //   );


    //     (items);

    //     (filterItem);
      

      


    //   if (!filterItem) {
    //     toast.warn("Item not found");
    //     return;
    //   }


  
    //     if (filterItem) {
    //           (Customer_userId);
    //           (variantId);
  
    //         const response = await getAllAddress();
    //           (response);
  
    //         if (
    //           response &&
    //           response.data.message === "Item added to cart successfully."
    //         ) {
    //           dispatch(importCartItems(response.data.groceryItems));
  
    //           toast.success("Item added to cart successfully.");
    //         }
    //         if (response && response.data.message == "address not found") {
    //           toast.warn("Please Set Address");
    //             (response);
  
    //           navigate("/profile/addresses");
    //         }
  
    //         if (response && response.data.message == "Out Of Stock") {
    //           toast.warn("Out Of Stock");
    //             (response);
    //         }

    //         if (response && response.data.message) {
    //           toast.error(response.data.message);
    //             (response);
    //         }
    //     }

          (Customer_userId);
        
    } 


  const addNewAddress = async (
    variantId,
    purchase_item_id,
    Varient_type
  ) => {
    const login = localStorage.getItem("token");

    

    if (!login) {
      toast.warn("Please Login!");
      return;
    }

      (reduxcartItems);
      (variantId);
    

    const filterItem = reduxcartItems.data.find(
      (ele) => ele.variant_sku_id == variantId
    );

    if (!filterItem) {
      toast.warn("Item not found");
      return;
    }
      (reduxcartItems);
    dispatch(increaseCart({ variant_sku_id: filterItem.variant_sku_id }));

    try {
      const response = await IncreaseItemQuantityToCart({
        grocery_cart_Item_id: filterItem.grocery_cart_Item_id,
        grocery_cart_id: filterItem.grocery_cart_id,
        sku_id: variantId,
        purchase_item_id,
        Varient_type,
      });

        (response);
      

      if (response?.data.message === "Insufficient stock to increase item quantity") {
        dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));
        toast.error("Out of Stock");
      } else if (response?.data.message === "Item quantity increased successfully") {
        dispatch(importCartItems(response.data.groceryItems));
        toast.success(response.data.message);
      } else if (response?.data.error === "limit order is greater than newQuantity") {
        dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));
        toast.error("Out of Limit");
      } else {
        dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error increasing item quantity:", error);
      dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));
    }
  };

  const deleteAddress = async (
    variantId,
    purchase_item_id,
    Varient_type
  ) => {
    const login = localStorage.getItem("token");

    if (!login) {
        ("User not logged in");
      return;
    }

    const filterItem = reduxcartItems.data.find(
      (ele) => ele.variant_sku_id === variantId
    );

    if (!filterItem) {
        ("Item not found");
      return;
    }

    dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));

    try {
      const response = await DecreaseItemQuantityToCart({
        grocery_cart_Item_id: filterItem.grocery_cart_Item_id,
        grocery_cart_id: filterItem.grocery_cart_id,
        sku_id: variantId,
        purchase_item_id,
        Varient_type,
      });

     if (response && response.data.groceryItems) {
         dispatch(importCartItems(response.data.groceryItems));
         toast.success(response.data.message);
       } else {
        dispatch(addCart({ variant_sku_id: filterItem.variant_sku_id }));
      }
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
      dispatch(addCart({ variant_sku_id: filterItem.variant_sku_id }));
    }
  };

  return { ImportAddress, addNewAddress, deleteAddress };
};

export default useAddressActions;
