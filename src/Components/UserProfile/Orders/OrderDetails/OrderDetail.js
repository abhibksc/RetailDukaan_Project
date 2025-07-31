import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDeliveryAddress from "./OrderDeliveryAddress";
import OrderTracking from "./OrderTracking";
import {
  getOrderDetail,
  OrderItem,
} from "../../../CrudOperations/GetOperation";
import OrderItems, { CancelOrders } from "./OrderItems";
import LoadingModal from "../../../LoadingModal";
import { toast } from "react-toastify";
import SignUpOfferItem from "./SignUpOfferItem";
import OrderBillingSectionBase from "./OrderBillingSection/OrderBillingSectionBase";

const OrderDetailBase = () => {
  const { orderId } = useParams(); // Retrieves the dynamic orderId from the URL

  console.log(orderId);

  const [delivery_Addresss, setDeliveryAddress] = useState("");
  const [order_status, setOrderStatus] = useState("");

  const [trackItem, setTrackItem] = useState({
    itemDetail: "",
    BillDetail: "",
    trackDetail: "",
    orderImage: "",
  });
  const [OrderItemsData, setOrderItems] = useState({
    items: [],
    signupItems: [],

    normalItems: [],
  });

  const [SinguPOfferItemData, setSinguPOfferItemData] = useState("");

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
          response?.data?.message ===
            `All ${orderId} Order Details Retrieved Successfully!!`
        ) {
          const orderDetails = response?.data?.orders;

          if (orderDetails) {
            setDeliveryAddress(orderDetails?.Customer?.delivery_address);

            setSinguPOfferItemData(orderDetails?.Items?.signupItems);

            setTrackItem({
              itemDetail: orderDetails.Items,
              BillDetail: orderDetails.Total_Bill,
              trackDetail: orderDetails.order_track,
              orderImage: orderDetails.order_image,
            });

            setOrderStatus(orderDetails.order_status);

            setOrderItems(orderDetails.Items);
          } else {
            toast.error("There is no any order of this orderID");
          }

          console.log(response);
        } else {
          toast.error(response?.data?.message || response?.data?.error);
        }
      }

      setLoading(false);
    };

    fun();
  }, []);

  const isOpen = () => {
    const data = OrderItemsData?.items?.some(
      (ele) => ele.approved_quantity !== parseInt(ele.quantity)
    );

    if (data) {
      return true;
    } else {
      return false;
    }
  };

  return loading ? (
    <div className="min-h-screen">
      <LoadingModal />
    </div>
  ) : (
    <div className="w-full ">
      <div className=" shadow-md">
        {/* Delivery Address Section */}

        <OrderDeliveryAddress delivery_Addresss_data={delivery_Addresss} />

        <OrderTracking
            OrderItems_data={OrderItemsData}

          order_track_data={trackItem}
          orderId={orderId}
          order_status={order_status}
        />

        <SignUpOfferItem
          SinguPOfferItemData={SinguPOfferItemData}
          order_status={order_status}
              orderId={orderId}
        />

        {console.log(OrderItemsData)}
        {console.log(order_status)}

        {OrderItemsData?.normalItems?.length > 0 && (
          <OrderItems
            OrderItems_data={OrderItemsData}
            order_status={order_status}
          />
        )}

        {console.log(isOpen())}
        {isOpen() && (
          <CancelOrders
            OrderItems_data={OrderItemsData}
            order_status={order_status}
          />
        )}
      </div>
    </div>
  );
};

// OrderDetailBase

const OrderDetail = () => {
  return (
    <div className="">
      <div className="flex gap-6 flex-col xl:flex-row  ">
        <OrderDetailBase />
        <OrderBillingSectionBase />
      </div>
    </div>
  );
};

export default OrderDetail;
