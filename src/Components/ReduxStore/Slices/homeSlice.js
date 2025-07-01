import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMegaUIGroupInCustomerUI ,getDesktopFeaturedBannersInCustomerUI,
  getdesktopUIMainBanner,
  getDesktopHomeManagementGroupInCustomerUI,
  getDesktopHomeManagementCategoryInCustomerUI
 } from '../../CrudOperations/GetOperation';

export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async (pincode, { rejectWithValue }) => {
    try {
      const [getMegaUIGroupInCustomerUIRes,
         getDesktopHomeManagement_Group_InCustomerUIRes,
          getDesktopFeaturedBannersInCustomerUIRes,
           getdesktopUIMainBannerRes,
          getDesktopHomeManagement_Category_InCustomerUIRes
          ] = await Promise.all([
        getMegaUIGroupInCustomerUI(pincode),
        getDesktopHomeManagementGroupInCustomerUI(pincode),
        getDesktopFeaturedBannersInCustomerUI(pincode),
        getdesktopUIMainBanner(pincode),
        getDesktopHomeManagementCategoryInCustomerUI(pincode)
      ]);


         (getDesktopHomeManagement_Category_InCustomerUIRes);
      

      return {
        megaGroups: getMegaUIGroupInCustomerUIRes.data,
        megaGroupCategoryListing: getDesktopHomeManagement_Group_InCustomerUIRes.data.data,
        featuredBanner: getDesktopFeaturedBannersInCustomerUIRes.data.data,
        mainBanner: getdesktopUIMainBannerRes.data.data,
        desktop_homeManagement_category : getDesktopHomeManagement_Category_InCustomerUIRes.data.data
      };
    } catch (err) {
         (err);
      
      return rejectWithValue(err.response?.data?.message || 'Something went wrong');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    megaGroups: [],
    megaGroupCategoryListing: [],
    featuredBanner: [],
    mainBanner: [],
    desktop_homeManagement_category : [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.megaGroups = action.payload.megaGroups;
        state.megaGroupCategoryListing = action.payload.megaGroupCategoryListing;
        state.mainBanner = action.payload.mainBanner;

           state.desktop_homeManagement_category = action.payload.desktop_homeManagement_category;


        state.featuredBanner = action.payload.featuredBanner;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const homeSlice_reducer = homeSlice.reducer;

