import { createSlice } from "@reduxjs/toolkit";

const updateImages = createSlice({
    name : "toggleSlices",
    initialState : {
       ItemImage : ""
    },
    reducers : {
        UpdateImagereducer(state, action){
          console.log(action.payload);
            state.ItemImage = action.payload;
        },

        AddImagereducer(state, action){
            console.log(action.payload);
              state.ItemImage.push(action.payload);
          }
      
    }
})






export const  updatedImageReducer  = updateImages.reducer;
export const {UpdateImagereducer,AddImagereducer}  = updateImages.actions;