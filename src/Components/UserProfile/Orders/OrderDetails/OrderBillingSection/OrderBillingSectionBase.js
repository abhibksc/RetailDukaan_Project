import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "react-lottie";

import animationData from "../../../../../assets/animations/orderPage.json";
import { toast } from "react-toastify";
import OrderBillingSection from "./OrderBillingSection";
import { getOrderBillFromDataBase } from "../../../../CrudOperations/GetOperation";
import { useEffect, useState } from "react";

const OrderBillingSectionBase = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { orderId } = useParams(); // Retrieves the dynamic orderId from the URL

  const navigate = useNavigate();

  const address = useSelector((state) => state.auth.address);
  const phone = useSelector((state) => state.auth.phone);
  const name = useSelector((state) => state.auth.name);

  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

  const [Bill, setBill] = useState();
  const [orderItems, setOrderItems] = useState([]);

  const getOrderBill = async () => {
    const response = await getOrderBillFromDataBase(orderId);
    console.log(response);
    if (response?.data?.Success) {
      setBill(response?.data?.Data);
      setOrderItems(response?.data?.Total_Order_Items);
    }
  };

  useEffect(() => {
    getOrderBill();
  }, []);

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
            {console.log(reduxcartItems)}
            {console.log(orderItems)}
            {/* Billing Section */}
            <OrderBillingSection
              orderItems={orderItems}
              reduxcartItems={Bill}
            />
          </div>
        </div>
      }
    </div>
  );
};

export default OrderBillingSectionBase;
