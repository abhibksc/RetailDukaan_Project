import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDeliveryAddress from "./S_OrderDeliveryAddress";
import OrderTracking from "./S_OrderTracking";
import {
  getOrderDetail,
  OrderItem,
} from "../../../CrudOperations/GetOperation";
import OrderItems, { CancelOrders } from "./OrderItems";
import LoadingModal from "../../../LoadingModal";
import BackButton from "../../../BackButton";
import ViewOrders_Item from "./ViewOrders_Item";
import S_OrderTracking from "./S_OrderTracking";
import S_OrderDeliveryAddress from "./S_OrderDeliveryAddress";
import SOrder_billingSection from "./SOrder_billingSection";

const S_OrderDetail = () => {
  const { orderId } = useParams(); // Retrieves the dynamic orderId from the URL

  console.log(orderId);

  const [delivery_Addresss, setDeliveryAddress] = useState("");
  const [order_status, setOrderStatus] = useState("");
  const [isOpenItemViewModal, setIsOpenItemViewModal] = useState(false);


  // isOpenItemViewModal

  const [trackItem, setTrackItem] = useState({
    itemDetail: "",
    BillDetail: "",
    trackDetail: "",
  });
  const [OrderItemsData, setOrderItems] = useState("");

  const [loading, setLoading] = useState(false);
  // loading

  useEffect(() => {
    setLoading(true);

    const fun = async () => {
      if (orderId) {
        const response = await getOrderDetail(orderId);
        console.log(response);

        if (
          response &&
          response.data.message ===
            `All ${orderId} Order Details Retrieved Successfully!!`
        ) {
          const orderDetails = response.data.orders;

          setDeliveryAddress(orderDetails.Customer.delivery_address);
          setTrackItem({
            itemDetail: orderDetails.Items,
            BillDetail: orderDetails.Total_Bill,
            trackDetail: orderDetails.order_track,
          });

          setOrderStatus(orderDetails.order_status);

          setOrderItems(orderDetails.Items);

          console.log(response);
        }
      }

      setLoading(false);
    };

    fun();
  }, []);

  return loading ? (
    <div className="min-h-screen">
      <LoadingModal />
    </div>
  ) : (
    <div className="  min-h-screen bg-white">
      <div className=" shadow-md ">


  {isOpenItemViewModal &&    <ViewOrders_Item order_status={order_status} orderItems ={OrderItemsData} onclose={()=>setIsOpenItemViewModal(false)} />}



        <header className="shadow-md shadow-gray-700 mb-3 bg-gradient-to-b from-green-400 to-white">
          <div className="flex mx-3">
            <BackButton className="" />
            <h1 className="mt-2 ml-4 font-semibold text-gray-700">
              Order Details
            </h1>
          </div>
        </header>

        <div className="text-sm mx-1 p-1 shadow-sm text-gray-500 font-semibold">
          Order ID - {orderId}
        </div>

        <div className="mt-3 mx-1 p-1 flex gap-3 flex-col pb-3 shadow-sm">
          <div className="flex justify-between">
            <div>Grocery {OrderItemsData.length} items</div>

            <div>
              <button onClick={()=>setIsOpenItemViewModal(true)} className="shadow-md border-1 border-gray-900 p-2 rounded-md text-blue-500 text-sm">
                View all
              </button>
            </div>
          </div>

          <div>
            {console.log(OrderItemsData)}

            {OrderItemsData && (
              <img
                src={OrderItemsData[0].image}
                alt="image"
                className="h-20 w-20 overscroll-contain "
              />
            )}
          </div>

          <div className="font-semibold ">
            ₹{trackItem.BillDetail.total_amount}
          </div>
        </div>


        <S_OrderTracking order_track_data={trackItem} orderId={orderId} order_status={order_status} />

        <S_OrderDeliveryAddress delivery_Addresss_data={delivery_Addresss} />

        <SOrder_billingSection Bill={trackItem.BillDetail} />

















      </div>
    </div>
  );
};

export default S_OrderDetail;
