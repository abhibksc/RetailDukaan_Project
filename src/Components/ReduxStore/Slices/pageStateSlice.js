// store/features/pageStateSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const pageStateSlice = createSlice({
  name: 'pageState',
  initialState,
  reducers: {
    savePageState: (state, action) => {
      const { path, componentState } = action.payload;
      state[path] = componentState;
    },
    clearPageState: (state, action) => {
      delete state[action.payload.path];
    },
  },
});

export const { savePageState, clearPageState } = pageStateSlice.actions;
export const PageStateSliceReducer =  pageStateSlice.reducer;








  // Get saved state for this page if exists


//   const savedState = useSelector((state) => state.pageState[pagePath]);


// **********************************


//  dispatch(savePageState({ path: pagePath, componentState: { qty } }));