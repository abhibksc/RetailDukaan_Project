import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDeliveryAddress from "./OrderDeliveryAddress";
import OrderTracking from "./OrderTracking";
import { getOrderDetail, OrderItem } from "../../../CrudOperations/GetOperation";
import OrderItems, { CancelOrders } from "./OrderItems";
import LoadingModal from "../../../LoadingModal";
import { toast } from "react-toastify";


const OrderDetail = () => {


    const { orderId } = useParams(); // Retrieves the dynamic orderId from the URL

    console.log(orderId);

    const [delivery_Addresss, setDeliveryAddress] = useState("");
    const [order_status, setOrderStatus] = useState("");

    const [trackItem, setTrackItem] = useState({
      itemDetail : "",
      BillDetail : "",
      trackDetail : ""
    });
    const [OrderItemsData, setOrderItems] = useState("");

    const [loading, setLoading] = useState(false);
    // loading



    useEffect(()=>{

      setLoading(true)

      const fun = async()=>{

        if(orderId){

          const response = await getOrderDetail(orderId)
          console.log(response);
          


          if(response && response?.data?.message === `All ${orderId} Order Details Retrieved Successfully!!`){

            const orderDetails = response?.data?.orders

if(orderDetails){

              setDeliveryAddress(orderDetails?.Customer?.delivery_address)
            setTrackItem({
               itemDetail : orderDetails.Items,
               BillDetail : orderDetails.Total_Bill,               
               trackDetail : orderDetails.order_track


            })

            setOrderStatus(orderDetails.order_status)

            setOrderItems(orderDetails.Items)

}
else{

            toast.error("There is no any order of this orderID");


}

            console.log(response);

          }
          else{
            toast.error(response?.data?.message || response?.data?.error);
          }
          


        }

      setLoading(false)



      }

      fun();


    },[])
    


  return loading ? <div className="min-h-screen">

<LoadingModal/> 
  </div>: (
    <div className="mx-20">
      <div className=" shadow-md ">
        {/* Delivery Address Section */}
       <OrderDeliveryAddress delivery_Addresss_data={delivery_Addresss}/>

    <OrderTracking order_track_data={trackItem} orderId={orderId} order_status={order_status}/>


    

    <OrderItems OrderItems_data={OrderItemsData} order_status={order_status}/>


    <CancelOrders OrderItems_data={OrderItemsData} order_status={order_status}/>





      </div>
    </div>
  );
};

export default OrderDetail;
