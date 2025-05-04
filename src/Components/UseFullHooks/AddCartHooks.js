import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DecreaseItemQuantityToCart, IncreaseItemQuantityToCart, StoreItemToCart } from "../CrudOperations/PostOperation";
import { addCart, decreaseCart, importCartItems, increaseCart } from "../ReduxStore/Slices/cartSlice";






const useCartActions = () => {
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
    items
  ) => {

    console.log(variantId);
    console.log(purchase_item_id);
    
    console.log(Varient_type);

    console.log(stock_type);
    console.log(stock_id);

    const login = localStorage.getItem("token");

    if (login) {
      const filterItem = items.find(
        (ele) => ele.sku_id == variantId
      );


      console.log(items);

      console.log(filterItem);
      

      


      if (!filterItem) {
        toast.warn("Item not found");
        return;
      }


  
        if (filterItem) {
            console.log(Customer_userId);
            console.log(variantId);
  
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
  
              toast.success("Item added to cart successfully.");
            }
            if (response && response.data.message == "address not found") {
              toast.warn("Please Set Address");
              console.log(response);
  
              navigate("/profile/addresses");
            }
  
            if (response && response.data.message == "Out Of Stock") {
              toast.warn("Out Of Stock");
              console.log(response);
            }
        }

        console.log(Customer_userId);
        
    } else {
      toast.warn("Please login");
    }
  };

  const increaseQuantity = async (
    variantId,
    purchase_item_id,
    Varient_type
  ) => {
    const login = localStorage.getItem("token");

    

    if (!login) {
      toast.warn("Please Login!");
      return;
    }

    console.log(reduxcartItems);
    console.log(variantId);
    

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
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error increasing item quantity:", error);
      dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));
    }
  };

  const decreaseQuantity = async (
    variantId,
    purchase_item_id,
    Varient_type
  ) => {
    const login = localStorage.getItem("token");

    if (!login) {
      console.log("User not logged in");
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
      }
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
      dispatch(addCart({ variant_sku_id: filterItem.variant_sku_id }));
    }
  };

  return { addItemToCart, increaseQuantity, decreaseQuantity };
};

export default useCartActions;
