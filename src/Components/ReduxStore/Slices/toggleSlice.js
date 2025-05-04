import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
    name : "toggleSlices",
    initialState : {
       mobileMenuToggle : false
    },
    reducers : {
        Mobilemenu(state, action){
          console.log(action.payload);
            state.mobileMenuToggle = action.payload.mobileMenuToggle;
        },
      
    }
})






export const  toggleSlices  = toggleSlice.reducer;
export const {Mobilemenu}  = toggleSlice.actions;