import MainPartBase from "./MainPart/MainPartBase";
import BillingSectionBase from "./BillingSection/BillingSectionBase";
// import AddressPopUp from "./AddressPopUp";

const CartDashboard = () => {

  return (
    <div className=" p-3  bg-gray-200">
      <div className="flex gap-6 flex-col xl:flex-row  ">
         <MainPartBase />
         <BillingSectionBase />
      </div>
    </div>
  );
};

export default CartDashboard;
