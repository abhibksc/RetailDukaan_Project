import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DecreaseItemQuantityToCart, IncreaseItemQuantityToCart, StoreItemToCart } from "../CrudOperations/PostOperation";
import { addCart, decreaseCart, importCartItems, increaseCart } from "../ReduxStore/Slices/cartSlice";
import { activeMobileLoginPages, activePages, logout } from "../ReduxStore/Slices/auth";
import { useState } from "react";






const useCartActions = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const filteredProducts = useSelector((state) => state.filteredProducts); // Update with the correct state path
  const Customer_userId = useSelector((state) => state.auth.Customer_userId);

  const addItemToCart = async (
    variantId,
    purchase_item_id,
    Varient_type,
    stock_type,
    stock_id,
    items = null
  ) => {

    console.log(variantId);
    console.log(purchase_item_id);
    console.log(Varient_type);
    console.log(stock_type);
    console.log(stock_id);
    


    const login = localStorage.getItem("token");

    if (login) {

      if(  variantId &&
        purchase_item_id &&
        Varient_type &&
        stock_type &&
        stock_id){


          
          const response = await StoreItemToCart(
            Customer_userId,
            purchase_item_id,
            Varient_type,
            variantId,
            stock_type,
            stock_id
          );
          console.log(response);

          if (
            response &&
            response.data.message === "Item added to cart successfully."
          ) {
            dispatch(importCartItems(response.data.groceryItems));

            toast.success("added to cart.");
          }
         else if (response && response.data.message == "address not found") {
            toast.warn("Please Set Address");
            console.log(response);

            navigate("/profile/addresses");
          }

          else if (response && response.data.message == "Out Of Stock") {
            toast.warn("Out Of Stock");
            console.log(response);
          }

          else if (response && response.data.message || response.data.error) {
            toast.error(response.data.message || response.data.error);

            localStorage.removeItem("token");
                  dispatch(logout());
                  navigate("/");
          }



      }
      else{
        toast.warn("Something is missing!!!");
      }






  
  

        
    } else {
      toast.warn(windowWidth);
      if(windowWidth >= 1024 ) {
        dispatch(activePages({ login: true })) 

      } 
      
      else{
        dispatch(activeMobileLoginPages({ login: true }))

      }
      
    }
  };

  const increaseQuantity = async (
    variantId,
    purchase_item_id,
    Varient_type
  ) => {
    const login = localStorage.getItem("token");

    

    if (!login) {
      windowWidth >= 1024  ?  dispatch(activePages({ login: true })) : dispatch(activeMobileLoginPages({ login: true }))
      return;
    }

    

    const filterItem = reduxcartItems.data.find(
      (ele) => ele.variant_sku_id == variantId
    );



    if (!filterItem) {
      toast.warn("Item not found");
      return;
    }
    console.log(reduxcartItems);
    dispatch(increaseCart({ variant_sku_id: filterItem.variant_sku_id }));

    try {
      const response = await IncreaseItemQuantityToCart({
        grocery_cart_Item_id: filterItem.grocery_cart_Item_id,
        grocery_cart_id: filterItem.grocery_cart_id,
        sku_id: variantId,
        purchase_item_id,
        Varient_type,
      });

      console.log(response);
      

      

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
        toast.error(response.data.message || response.data.error);
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Error increasing item quantity:", error);
      dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
  };

  const decreaseQuantity = async (
    variantId,
    purchase_item_id,
    Varient_type
  ) => {


    const login = localStorage.getItem("token");

    if (!login) {
      windowWidth >= 1024  ?  dispatch(activePages({ login: true })) : dispatch(activeMobileLoginPages({ login: true }))

      return;
    }

    const filterItem = reduxcartItems.data.find(
      (ele) => ele.variant_sku_id === variantId
    );

    if (!filterItem) {
      console.log("Item not found");
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
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
      dispatch(addCart({ variant_sku_id: filterItem.variant_sku_id }));
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }




    
  };

  return { addItemToCart, increaseQuantity, decreaseQuantity };
};

export default useCartActions;
