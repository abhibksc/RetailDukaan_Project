import { logo } from "../../CrudOperations/customURl";
import NavLogin from "../../Header&SideBar/Header/NavLogin";

const SPincodeHeader = () => {



  return (
    <header className="fixed z-40 w-screen h-16 text-black text-[14px] shadow-sm shadow-green-100 bg-gradient-to-b from-green-300 to-white">
      <div className="flex  justify-between  px-10 py-3 ">
      <img
            src={logo}
            alt="Logo"
            className="sm:w-14 md:w-14 lg:w-14 xl:w-20 w-14 mt-1 h-auto"
          />

      </div>

      <NavLogin/>
    </header>
  );
};

export default SPincodeHeader;
