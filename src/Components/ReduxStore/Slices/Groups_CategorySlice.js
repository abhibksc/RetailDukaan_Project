import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AllGroups,
  AllCategory,
  AllSubCategory,
  AllSubSubCategory,
  AllItems,
  AllPacketVariant,
  AllLooseVariant,
} from "../../CrudOperations/GetOperation";

export const fetchCategoryData = createAsyncThunk(
  "category/fetchCategoryData",
  async (_, { rejectWithValue }) => {
    try {
      const [
        AllGroupsRes,
        AllCategoryRes,
        AllSubCategoryRes,
        AllSubSubCategoryRes,
        AllItemsRes,
        AllPacketVariantRes,
        AllLooseVariantRes,
      ] = await Promise.all([
        AllGroups(),
        AllCategory(),
        AllSubCategory(),
        AllSubSubCategory(),
        AllItems(),
        AllPacketVariant(),
        AllLooseVariant(),
      ]);

      return {
        user_AllGroup: AllGroupsRes.data.data,
        user_AllCategory: AllCategoryRes.data.data,
        user_AllSubCategory: AllSubCategoryRes.data.data,
        user_AllSubSubCategory: AllSubSubCategoryRes.data.data,
        user_AllItems: AllItemsRes.data.data,
        user_AllPacketVariant: AllPacketVariantRes.data.data,
        user_AllLooseVariant: AllLooseVariantRes.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);


const Groups_CategorySlice = createSlice({
  name: "category",
  initialState: {
    user_AllGroup: [],
    user_AllCategory: [],
    user_AllSubCategory: [],
    user_AllSubSubCategory: [],
    user_AllItems: [],
    user_AllPacketVariant: [],
    user_AllLooseVariant: [],


    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.user_AllGroup = action.payload.user_AllGroup;
        state.user_AllCategory = action.payload.user_AllCategory;
        state.user_AllSubCategory = action.payload.user_AllSubCategory;

        state.user_AllSubSubCategory =
          action.payload.user_AllSubSubCategory;

        state.user_AllItems = action.payload.user_AllItems;


                state.user_AllPacketVariant = action.payload.user_AllPacketVariant;
                        state.user_AllLooseVariant = action.payload.user_AllLooseVariant;
      })
      .addCase(fetchCategoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const GroupCategorySlice_reducer = Groups_CategorySlice.reducer;
