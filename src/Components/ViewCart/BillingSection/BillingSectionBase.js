import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import BillingSection from "./BillingSection";

import animationData from "../../../assets/animations/shopCart.json";
import { toast } from "react-toastify";

const BillingSectionBase = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const navigate = useNavigate();

  const address = useSelector((state) => state.auth.address);
  const phone = useSelector((state) => state.auth.phone);
  const name = useSelector((state) => state.auth.name);

  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

  if (!reduxcartItems.bill) {
    return;
  }

  return (
    <div>
      {
        <div className="flex flex-col  gap-2">
          {/* animation */}
          <div className=" p-4 w-[400px] hidden xl:block bg-white rounded-md shadow-md">
            {/* Placeholder for price details */}
            <Lottie options={defaultOptions} height={200} width={380} />
          </div>

          <div>
            {/* Billing Section */}
            <BillingSection />

            <div className="w-full  text-white bg-green-400 text-center mt-2 shadow-sm py-2 rounded-md">
              <button
                onClick={() => {
                  if (address.length <= 0) {
                    toast.warn("Please Complete Delivery Address");

                    navigate("/profile/addresses");

                    return;
                  }

                  if (!phone) {
                    toast.warn("Please Verify Mobil Number");

                    navigate("/profile");

                    return;
                  }

                  if (!name) {
                    toast.warn("Please Enter your Name!");
                    navigate("/profile");
                    return;
                  }

                  navigate("/CheckOut");
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default BillingSectionBase;
