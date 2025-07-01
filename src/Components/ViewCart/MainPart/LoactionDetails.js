import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useTruncateSentance from "../../UseFullHooks/useTruncateSentance";
import { getAllAddress } from "../../CrudOperations/GetOperation";
import AddressPopUp from "./AddressPopUp";
import { toast } from "react-toastify";

const LoactionDetails = () => {



    
    
      const address = useSelector((state) => state.auth.address);
      const AreaPin = useSelector((state) => state.auth.AreaPin);

console.log(address);

      const dispatch = useDispatch();
      const [primary, setPrimary] = useState("");
      const [AddresssList, setAddresssList] = useState(address);
      const navigate = useNavigate();
      const { truncateText} = useTruncateSentance();
      const [loading, setLoading] = useState(false);
    
      const [addressPopUp, setAddressPopUp] = useState(false);
    
    
    
    
    
    
    
      useEffect(() => {
        setLoading(true)

        if (AddresssList.length > 0) {
          const primary_add = AddresssList.find((ele) => ele.primary_address == 1);
          setPrimary(primary_add);
        }
        setLoading(false)

      }, [AddresssList]);
    
    
    
    
      const handleAddresspopUp = () => {
        setAddressPopUp(!addressPopUp);
      };
    
    
    










  return (
        <div className="bg-white">
                   {/* Location Details */}
          {(
            <div className="flex flex-col xl:flex-row justify-between mb-4 border p-4">
              <div className="">
                <div className="flex gap-4 text-gray-700">
                  <span>Deliver to:</span>
                  <span className="font-bold text-[15px]    text-black ">{`${ primary ?       truncateText(primary?.name, 1) : AreaPin}, ${ primary &&   primary.pin_code}`}</span>
                  <span className="border hidden xl:block bg-gray-200 font-inter text-sm px-2 rounded-md">
                    {primary ? primary?.address_type : "Home"}
                  </span>
                </div>
                <div>{primary?.full_addresss}</div>
              </div>
              

              <div>
                <button
                  className="text-blue-500 border p-2 rounded-md hover:bg-blue-600 hover:text-white shadow-md"
                  onClick={() =>  AddresssList.length > 0 ?  handleAddresspopUp()  : navigate("/profile/addresses")    }
                >
                  { AddresssList.length > 0 ?  "Change" : "Complete Delivery Address"}
                </button>
              </div>
            </div>
          )}


   {addressPopUp && (
                    <AddressPopUp
                      Addresss={AddresssList}
                      onclose={handleAddresspopUp}
                    //   OnUpdatePrimaryAdd={OnUpdatePrimaryAdd}
                    />
                  )}





          
        </div>
  );
};

export default LoactionDetails;
