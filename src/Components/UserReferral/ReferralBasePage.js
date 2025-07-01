import { Route, Routes } from "react-router-dom";
import Referral from "./Referral";

const ReferralBasePage = () => {

  return (
   <div className=" ">
      <div className="min-h-screen mt-24 mx-20">
        <Routes>
          <Route path="/" element={<Referral/>} />

        </Routes>
      </div>
    </div>
  );
};

export default ReferralBasePage;
