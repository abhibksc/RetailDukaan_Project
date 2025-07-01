import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingModal from "../LoadingModal";
import SGroupBasePage from "./Small Screen/SmallScreenGroupPages/SGroupBasePage";


const Small_Screen_UserMainContent = () => {

  return (
    <div className="">
      {/* Main content area */}
      <div className="">
        <Suspense fallback={<LoadingModal />}>

          <Routes>
            <Route path="/" element={<SGroupBasePage />} />
            {/* <Route path="/Groups/:name/:id/:pincode" element={<CategoryBasePage />} />
            <Route path="/:Groups/:name/:id/Cat/:catName/:catId/:pincode" element={<SubCat_BasePage />} /> */}
            {/* <Route path="/:Groups/:Category/:SubCategory/" element={<LargeScreenHomePage />} /> */}
            {/* <Route path="/:Groups/:Category/:SubCategory/:SubSubCategory" element={<LargeScreenHomePage />} /> */}



          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Small_Screen_UserMainContent;
