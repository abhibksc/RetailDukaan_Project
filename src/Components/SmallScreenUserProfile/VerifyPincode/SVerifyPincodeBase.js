import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SPincodeBox from "./SPincodeBox";
import SPincodeHeader from "./SPincodeHeader";
import SWelcomeAnimation from "./SWelcomeAnimation";
import SNearbyItems from "./SNearbyItems";

const SVerifyPincodeBase = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);

  return (
    <div className="flex flex-col gap-3 lg:hidden  bg-gray-50 min-h-screen ">
      <SPincodeHeader />
      <SPincodeBox />
      <SWelcomeAnimation />
      <SNearbyItems />
    </div>
  );
};

export default SVerifyPincodeBase;
