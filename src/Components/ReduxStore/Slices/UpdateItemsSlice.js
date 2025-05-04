import { createSlice } from "@reduxjs/toolkit";

const UpdateItemsSlice = createSlice({
  name: "UpdateItem",
  initialState: {
    item_name: "",
    item_id: "",
    brand: "",
    stock_type: "",
    loose_sku_Id: "",
    loose_stock_quantity: "",
    loose_stock_unit: "",
    loose_purchase_price: "",
    loose_batch_number: "",
    categories: "",
    categoryId: "",
    subcategories: "",
    subcategoryId: "",
    sub_subcategories: "",
    subSubcategoryId: "",
    description: "",
    loose_expiry_date: "",
    loose_area_pin: "",
    varients: [],
    specification: [],
    loose_images: [],
    importer_details: "",
    packer_details: "",
    manufacturer_details: "",
    seller_details: "",
    legal_disclaimer: "",
  },
  reducers: {
    Updatevarients(state, action) {
      console.log(action.payload);
      state.varients = action.payload;
    },
    UpdateSpecification(state, action) {
      console.log(action.payload);
      state.specification = action.payload;
    },
    Updateloose_images(state, action) {
      console.log(action.payload);
      state.loose_images = action.payload;
    },
  },
});

export const UpdateItems = UpdateItemsSlice.reducer;
export const { Updatevarients ,UpdateSpecification, Updateloose_images } = UpdateItemsSlice.actions;
