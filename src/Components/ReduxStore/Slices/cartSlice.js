import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cartSlices",
  initialState: {
    cartItems: {
      bill : null,
      data : [],
      message : "Cart items retrieved successfully!"
    }
  },
  reducers: {
    // Add item to cart or increase quantity if it already exists
    addCart(state, action) {

      console.log(action.payload);

      const { variant_sku_id, quantity, grocery_cart_id, grocery_cart_Item_id } = action.payload;


      state.cartItems.data.push({
        variant_sku_id,
        quantity: quantity || 1, // Default to 1 if quantity is not provided
        grocery_cart_id: grocery_cart_id ? grocery_cart_id : null,
        grocery_cart_Item_id: grocery_cart_Item_id
          ? grocery_cart_Item_id
          : null,
      });

    
    },

    importCartItems(state,action){
      
      state.cartItems = action.payload;

    },


    increaseCart(state, action) {
      const { variant_sku_id } = action.payload;

      

      // Find the item in the cart


      if(state && Array.isArray(state.cartItems.data)){


        const existingItem = state.cartItems.data.find(
          (item) => item.variant_sku_id == variant_sku_id
        );
  
        console.log(existingItem);
        
  
        if (existingItem) {
          existingItem.quantity += 1;
        }
        



      }

    
    },


    // Decrease item quantity by 1

    decreaseCart(state, action) {
      const { variant_sku_id } = action.payload;
      console.log(variant_sku_id);
      

      // Find the item in the cart


      if(state && Array.isArray(state.cartItems.data)){


        const existingItem = state.cartItems.data.find(
          (item) => item.variant_sku_id == variant_sku_id
        );
  
        console.log(existingItem);
        
  
        if (existingItem) {
          // If the quantity is greater than 1, decrease it by 1
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          } else {
            // Optionally, if the quantity is 1, you can remove the item from the cart
            state.cartItems.data = state.cartItems.data.filter(
              (item) => item.variant_sku_id !== variant_sku_id
            );
          }
        }



      }

    
    },




    emptyCart(state,action){
      console.log(action);
      
      state.cartItems.bill = null
      state.cartItems.data = []
      state.cartItems.message = "Cart items retrieved successfully!"


    }


    
  },
});

export const { addCart,increaseCart, decreaseCart ,importCartItems,emptyCart} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
