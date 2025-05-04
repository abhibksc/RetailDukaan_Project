// store.js

import { combineReducers } from "redux";
import { LoginSignUpSlicee, logout } from "./Slices/auth"; // Ensure logout action is exported
import { toggleSlices } from "./Slices/toggleSlice";

import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState ,deleteStateKey} from "./utils/localStorage";
import { updatedImageReducer } from "./Slices/updateImages";
import { UpdateItems } from "./Slices/UpdateItemsSlice";
import { cartReducer } from "./Slices/cartSlice";


const appReducer = combineReducers({
  auth: LoginSignUpSlicee,
  toggle: toggleSlices,
  updatedImageReducer : updatedImageReducer ,
  UpdateItems  : UpdateItems,
  cartReducer : cartReducer
});


const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    // Clear specific slices of the state on logout
 

    state = {
      auth: undefined,
      toggle: state.toggle, // Preserve the toggle state if needed
    };
  }
  return appReducer(state, action);
};




// Load persisted state
const persistedState = loadState();

const Store = configureStore({
  reducer: rootReducer, 
  preloadedState: persistedState,
});

Store.subscribe(() => {
  saveState(Store.getState());
});

export default Store;
