import  {  useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  activePages,
  updateAreaPin,
} from "../../ReduxStore/Slices/auth";
import { Mobilemenu } from "../../ReduxStore/Slices/toggleSlice";
import { checkPincodeAvailability } from "../../CrudOperations/GetOperation";
import NavPincode from "./NavPincode";
import NavLogin from "./NavLogin";
import NavMore from "./NavMore";
import NavCart from "./NavCart";
import { logo } from "../../CrudOperations/customURl";

const Header = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const AreaPin = useSelector((state) => state.auth.AreaPin);




  



  return (
    <header className="fixed z-40 w-screen h-16 text-black text-[14px] shadow-sm shadow-green-100 bg-gradient-to-b from-green-300 to-white">
      <div className="flex  justify-between  py-3 xl:py-0 ">
        <div className="flex   xl:ml-10 gap-10">
       

          <div
            className="header cursor-pointer ml-10"
            onClick={() => {
              dispatch(Mobilemenu({ mobileMenuToggle: false })); // Close mobile menu
              navigate("/"); // Navigate to the homepage
              window.location.reload(); // Reload the page
            }}
          >


          <img
            src={logo}
            alt="Logo"
            className="sm:w-14 md:w-14 lg:w-14 xl:w-20 w-14 mt-1 h-auto"
          />


          </div>



        </div>

        <ul className="gap-10  xl:flex hidden xl:mr-40">

      <NavPincode/>

<NavLogin/>

<NavMore/>

<NavCart/>
       



        

       
        </ul>



      </div>
    </header>
  );
};

export default Header;
