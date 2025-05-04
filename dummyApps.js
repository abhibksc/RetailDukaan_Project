import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import UserProfile from "./Components/UserProfile/UserProfile";
import HomePage from "./Components/Home/HomePage";
import Header from "./Components/Header&SideBar/Header";
import MobileSideBar from "./Components/Header&SideBar/MobileSideBar";
import Footer from "./Components/Footer/Footer";
import NotFound from "./Components/Errors/NotFound";
import { activePages } from "./Components/ReduxStore/Slices/auth";
import ViewCart from "./Components/ViewCart/ViewCart";
// import CheckOut from "./Components/ViewCart/CheckOut";
// import SubCategoryPage from "./Components/ProductCategories/SubCategoryPage";
import SuperAdminRoute from "./Components/SuperAdmin/SuperAdminRoute";
import AdminSuperAdminAuth from "./Components/AdminSuperAdminAuth/AdminSuperAdminAuth";
import MegaMenu from "./Components/Header&SideBar/MegaMenu";
import LoginModal from "./Components/UserAuth/LoginModal";
import Orders from "./Components/UserProfile/Orders/Orders";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Single_Product_page from "./Components/Product/Single_Product_page";
import Product_Listing_Page from "./Components/Product/Product_Listing_Page";
import CheckOut from "./Components/CheckOut/CheckOut";

// Route guard component
const ProtectedRoute = ({ children }) => {
  const registered = useSelector((state) => state.auth.registered);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!registered) {
      dispatch(activePages({ login: true, signup: false }));
    }
  }, [registered, dispatch, location]);

  if (!registered) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const loginPageActive = useSelector((state) => state.auth.loginpageActive);
  const signupPageActive = useSelector((state) => state.auth.signupPageActive);
  const admintoken = useSelector((state) => state.auth.admintoken);
  const superadmintoken = useSelector((state) => state.auth.superadmintoken);

  // console.log(alldata);
  console.log(admintoken);
  console.log(superadmintoken);

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <ToastContainer />

      {loginPageActive && <LoginModal />}

      <Routes>
        {/* user Auth */}

        {/* Dynamic admin and superadmin login routes */}
        {<Route path="/:userType/login" element={<AdminSuperAdminAuth />} />}

        {/* {    <Route path="/admin/login" element={<AdminSuperAdminAuth />} />} */}

        {/* SuperAdmin routes */}
        {localStorage.getItem("superadmintoken") && (
          <Route path="/superadmin/*" element={<SuperAdminRoute />} />
        )}

        {/* Admin routes */}
        {localStorage.getItem("Merchanttoken") && (
          <Route path="/admin/*" element={<AdminPanel />} />
        )}

        {/* Checkout route */}
        <Route
          path="/CheckOut/*"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />

        {/* Main app routes */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <MegaMenu />

              <MobileSideBar />
              <div className="md:hidden mx-auto w-72 mt-3 rounded-md border">
                <input
                  type="text"
                  id="search"
                  placeholder="Search"
                  className="rounded-lg px-3 py-1"
                />
              </div>
              <Routes>
                {/* <Route path="/subcategorypage" element={<SubCategoryPage />} /> */}
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/" element={<HomePage />} /> */}


                <Route path="/Profile/*" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />

                  {/* Dynamic route for a main category */}
                  <Route path="/:grocery" element={<Product_Listing_Page />} />

                {/* Dynamic route for a main category */}
                <Route path="/grocery/:category" element={<Product_Listing_Page />} />

                {/* Dynamic route for subcategory */}
                <Route
                  path="/grocery/:category/:subCategory"
                  element={<Product_Listing_Page />}
                />

                {/* Dynamic route for product item page */}
                <Route
                  path="/grocery/:category/:subCategory/:productItem"
                  element={<Product_Listing_Page />}
                />
              </Routes>
              <Footer />
            </>
          }
        />

        <>
          <Route path="/viewCart" element={<ViewCart />} />
        </>
      </Routes>
    </>
  );
};

const App = () => (
  <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-200">
    <Router>
      <AppContent />
    </Router>
  </div>
);

export default App;

























































import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import UserProfile from "./Components/UserProfile/UserProfile";
import HomePage from "./Components/Home/HomePage";
import Header from "./Components/Header&SideBar/Header";
import MobileSideBar from "./Components/Header&SideBar/MobileSideBar";
import Footer from "./Components/Footer/Footer";
import NotFound from "./Components/Errors/NotFound";
import { activePages } from "./Components/ReduxStore/Slices/auth";
import ViewCart from "./Components/ViewCart/ViewCart";
import SuperAdminRoute from "./Components/SuperAdmin/SuperAdminRoute";
import AdminSuperAdminAuth from "./Components/AdminSuperAdminAuth/AdminSuperAdminAuth";
import MegaMenu from "./Components/Header&SideBar/MegaMenu";
import LoginModal from "./Components/UserAuth/LoginModal";
import Orders from "./Components/UserProfile/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Single_Product_page from "./Components/Product/Single_Product_page";
import Product_Listing_Page from "./Components/Product/Product_Listing_Page";
import CheckOut from "./Components/CheckOut/CheckOut";
import baseurl, { baseUIurl } from "./Components/CrudOperations/customURl";

// Route guard component
const ProtectedRoute = ({ children }) => {
  const registered = useSelector((state) => state.auth.registered);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!registered) {
      dispatch(activePages({ login: true, signup: false }));
    }
  }, [registered, dispatch, location]);

  if (!registered) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const loginPageActive = useSelector((state) => state.auth.loginpageActive);
  const signupPageActive = useSelector((state) => state.auth.signupPageActive);
  const admintoken = useSelector((state) => state.auth.admintoken);
  const superadmintoken = useSelector((state) => state.auth.superadmintoken);

  const [admin, setAdmin] = useState(false);

  console.log(admintoken);
  console.log(superadmintoken);

  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const pathMatch = location.pathname.match(/^\/[^/]+\//); // Matches any "/userType/login" path

  //   // i want to setAdmin(true) also in /:userType/*
  //   if (pathMatch) {
  //     console.log("sdf");

  //     setAdmin(true);
  //   } else {
  //     setAdmin(false);
  //   }
  // }, [location.pathname]);

  return (
    <>
      <ToastContainer />

      {loginPageActive && <LoginModal />}

      <Routes>
        {/* user Auth */}

        {/* Checkout route */}
        <Route
          path="/CheckOut/*"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:userType/*"
          element={
            <>
             <Route path="login/" element={<AdminSuperAdminAuth />} /> 
              {/* SuperAdmin routes */}
              {localStorage.getItem("superadmintoken") && (
                <Route path="/superadmin/*" element={<SuperAdminRoute />} />
              )}

              {/* Admin routes */}
              {localStorage.getItem("Merchanttoken") && (
                <Route path="/admin/*" element={<AdminPanel />} />
              )}
            </>
          }
        />

        {/* Main app routes */}
        {/* <Route
          path="/*"
          element={
            <>
              {!admin && (
                <>
                  <Header />
                  <MegaMenu />
                  <MobileSideBar />
                  <div className="md:hidden mx-auto w-72 mt-3 rounded-md border">
                    <input
                      type="text"
                      id="search"
                      placeholder="Search"
                      className="rounded-lg px-3 py-1"
                    />
                  </div>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/Profile/*" element={<UserProfile />} />
                    <Route path="*" element={<NotFound />} />
                    <Route
                      path="/:grocery"
                      element={<Product_Listing_Page />}
                    />
                    <Route
                      path="/grocery/:category"
                      element={<Product_Listing_Page />}
                    />
                    <Route
                      path="/grocery/:category/:subCategory"
                      element={<Product_Listing_Page />}
                    />
                    <Route
                      path="/grocery/:category/:subCategory/:productItem"
                      element={<Product_Listing_Page />}
                    />
                  </Routes>
                  <Footer />
                </>
              )}
            </>
          }
        /> */}

        <Route path="/viewCart" element={<ViewCart />} />
      </Routes>
    </>
  );
};

const App = () => (
  <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-200">
    <Router>
      <AppContent />
    </Router>
  </div>
);

export default App;

