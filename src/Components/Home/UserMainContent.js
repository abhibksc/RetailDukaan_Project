import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingModal from "../LoadingModal";
import GroupBasePage from "./Large_Screen/LargeScreenGroupPages/GroupBasePage";
import CategoryBasePage from "./Large_Screen/LargeScreenCategoryPages/CategoryBasePage";
import SubCat_BasePage from "./Large_Screen/LargeScreenSubCategoryPages/SubCat_BasePage";


const UserMainContent = () => {




  return (
    <div className="">


      











      {/* Main content area */}
      <div className="">
        <Suspense fallback={<LoadingModal />}>

          <Routes>
            <Route path="/" element={<GroupBasePage />} />
            <Route path="/Groups/:name/:id/:pincode" element={<CategoryBasePage />} />
            <Route path="/:Groups/:name/:id/Cat/:catName/:catId/:pincode" element={<SubCat_BasePage />} />
            {/* <Route path="/:Groups/:Category/:SubCategory/" element={<LargeScreenHomePage />} /> */}
            {/* <Route path="/:Groups/:Category/:SubCategory/:SubSubCategory" element={<LargeScreenHomePage />} /> */}



          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default UserMainContent;
