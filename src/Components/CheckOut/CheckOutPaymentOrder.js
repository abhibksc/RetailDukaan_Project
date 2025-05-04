import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { emptyCart } from "../ReduxStore/Slices/cartSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FinalPaymentVarification,
  InitiatePayment,
  placeOrder,
  verifyInitiatedpayment,
} from "../CrudOperations/PostOperation";
import LoadingModal from "../LoadingModal";
import baseurl, { baseUIurl } from "../CrudOperations/customURl";

const CheckOutPaymentOrder = ({ isPaymentChanged, handlePaymentChange }) => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [upiMethod, setUpiMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, SetLoading] = useState(false);

  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(840);
  const billAmount = useSelector((state) => state.cartReducer.cartItems.bill);

const Auth_userID = useSelector((state) => state.auth.Customer_userId);

const Auth_name = useSelector((state) => state.auth.name);
const Auth_number = useSelector((state) => state.auth.phone);
const Auth_emailID = useSelector((state) => state.auth.email);




  const location = useLocation();
 // Extract all parameters using regex
 const match = location.pathname.match(/userId=([^/]+)\/orderId=([^/]+)\/paymentId=([^/]+)\/signature=([^/]+)\/amount=([^/]+)/  );

 const userId = match ? match[1] : null;
 const orderId = match ? match[2] : null;
 const paymentID = match ? match[3] : null;
 const signature = match ? match[4] : null;
 const amount = match ? match[5] : null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    console.log(Auth_name);
    console.log(Auth_number);
    console.log(Auth_emailID);








    console.log(userId);
    console.log(orderId);
    console.log(paymentID);
    console.log(signature);
    console.log(amount);

    


    if(userId && orderId && paymentID && signature && amount){

      console.log(userId ,orderId , paymentID , signature,amount);
      

      SetLoading(true);


      const fun = async() => {
   


        const response = await FinalPaymentVarification(userId, orderId , paymentID, signature, amount);
        console.log(response);
        
        if(response && response.status == "Success"){

          navigate(`/Order/successfullyOrder/userId-${userId}/amount-${amount}/orderId-${response?.data?.order_Id}`);

          dispatch(emptyCart());

        }else{
          console.log("error in payment verification");
          console.log(response);
          
          navigate(`/Order/payment-fail/userId-${userId}/orderId-${orderId}/${response.message}`);  
        }





      };
      fun();
          

    }




  }, []);



  // Handle Payment Selection
  const handlePaymentSelection = (event) => {
    setSelectedPayment(event.target.value);
    setUpiMethod(""); // Reset UPI method when changing payment mode
    setIsUpiVerified(false);
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async () => {
    SetLoading(true);


    if (selectedPayment === "COD") {
      const placeOrderResponse = await placeOrder();
      console.log(placeOrderResponse);

      if (placeOrderResponse.data.message === "Order Placed") {
        toast.success("Order Successfully Placed!");
        navigate(`/Order/successfullyOrder/userId-${placeOrderResponse.data.userId}/amount-${Math.round(placeOrderResponse.data.amount)}/orderId-${placeOrderResponse.data.order_Id}`);

        // navigate(
        //   `/Order/successfullyOrder/${placeOrderResponse.data.order_Id}`
        // );
        
        dispatch(emptyCart());
      } else if (placeOrderResponse.data.message === "Out Of Stock") {
        console.log(placeOrderResponse);
        toast.warning(
          "This item is out of stock. If payment was deducted, the refund will be processed within 2-3 working days."
        );
      }

      SetLoading(false);
      return;
    }






















    const res = await InitiatePayment({ amount: billAmount.total_amount });
  console.log(res);
  
    if (res && res.Message) {
      toast.error(res.Message);
      SetLoading(false);
      return;
    }
    const currentDate = new Date().toISOString().split("T")[0];
    
    // Create a form dynamically
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://api.razorpay.com/v1/checkout/embedded";
  
    const fields = {
      key_id: "rzp_live_Gf5E5XNbMy7RBo", // Replace with your Razorpay Key ID
      amount: billAmount.total_amount * 100, // Convert to paisa
      currency: "INR",
      order_id: res.order_id, // Get from your InitiatePayment response
      name: "Retail Dukaan",
      description: "Order Payment",
      image: "https://firebasestorage.googleapis.com/v0/b/wipenexit-48482.appspot.com/o/grocery%2Fretail_dukaan_images.png?alt=media&token=b7a79b72-4ad6-47ff-ab59-06ceaa3aa05d",
      "prefill[name]": Auth_name,
      "prefill[contact]": Auth_number,
      // "prefill[email]": Auth_emailID || Auth_emailID,
      // "notes[shipping address]": "L-16, The Business Centre, 61 Wellfield Road, New Delhi - 110001",
      callback_url: `${baseurl}/api/verify-payment/${Auth_userID}/${res.order_id}/${currentDate}`, // Redirect to React route
      cancel_url: `${baseurl}/api/verify-payment/${Auth_userID}/${res.order_id}/${currentDate}`, // Redirect to React route

      
    };
  
    // Append fields to form
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
  
    document.body.appendChild(form);
    SetLoading(false);
    form.submit();


  };
  

  // const handleRazorpayPayment = async (order_id) => {
  //   if (selectedPayment === "COD") {
  //     const placeOrderResponse = await placeOrder();
  //     console.log(placeOrderResponse);

  //     if (placeOrderResponse.data.message === "Order Placed") {
  //       toast.success("Order Successfully Placed!");
  //       navigate(
  //         `/Order/successfullyOrder/${userID}/${placeOrderResponse.data.order_Id}`
  //       );
  //       window.location.reload();
  //     } else if (placeOrderResponse.data.message === "Out Of Stock") {
  //       console.log(placeOrderResponse);
  //       toast.warning(
  //         "This item is out of stock. If payment was deducted, the refund will be processed within 2-3 working days."
  //       );
  //     }

  //     SetLoading(false);
  //     return;
  //   }

  //   const res = await loadScript(
  //     "https://checkout.razorpay.com/v1/checkout.js"
  //   );
  //   if (!res) {
  //     toast.error("Payment Gateway Failed to load");
  //     return;
  //   }

  //   setTimeLeft(840); // Reset countdown timer
  //   let timerInterval;

  //   const options = {
  //     key: "rzp_test_pBtn3lJ6WG7wc8", // Replace with your Razorpay Key ID
  //     currency: "INR",
  //     name: "Retail Dukaan",
  //     description: "Order Payment",
  //     image: "https://firebasestorage.googleapis.com/v0/b/wipenexit-48482.appspot.com/o/grocery%2Fretail_dukaan_images.png?alt=media&token=b7a79b72-4ad6-47ff-ab59-06ceaa3aa05d",
  //     order_id: order_id,
  //     handler: async function (response) {
  //       if (response) {
  //         console.log(response);
  //         try {
  //           const verifyData = await verifyInitiatedpayment({
  //             order_id: response.razorpay_order_id,
  //             payment_id: response.razorpay_payment_id,
  //             signature: response.razorpay_signature,
  //           });
    
  //           console.log(verifyData);
    
  //           if (verifyData.Status === "Success") {
  //             SetLoading(false);
  //             toast.success("Payment Verified Successfully!");
  //             navigate(`/Order/successfullyOrder/${verifyData.order_Id}`);
  //           } else {
  //             toast.error(verifyData.message);
  //           }
  //         } catch (error) {
  //           SetLoading(false);
  //           console.error("Error verifying payment:", error);
  //           toast.error("Error verifying payment!");
  //         }
  //       } else {
  //         SetLoading(false);
  //         toast.error("Payment failed!");
  //       }
  //     },
  //     prefill: {
  //       name: "John Doe",
  //       email: "john.doe@example.com",
  //       contact: "9999999999",
  //     },
  //     theme: {
  //       color: "#3399cc",
  //     },
  //   };
    

  //   const razorpay = new window.Razorpay(options);
  //   razorpay.open();

  //   // **Start Timer**
  //   timerInterval = setInterval(() => {
  //     setTimeLeft((prevTime) => {
  //       if (prevTime <= 1) {
  //         clearInterval(timerInterval);
  //         razorpay.close(); // Try closing Razorpay popup

  //         // Force close Razorpay popup (in case `.close()` fails)
  //         const razorpayPopup = document.querySelector("iframe");
  //         if (razorpayPopup) {
  //           razorpayPopup.parentNode.style.display = "none";
  //         }

  //         toast.error("Payment session expired. Please try again.");
  //         return 0;
  //       }
  //       return prevTime - 1;
  //     });
  //   }, 1000);
  // };

  if (loading) return <LoadingModal />;

  return (
    <>
      {isPaymentChanged ? (
        <div className="bg-white rounded shadow-md mb-4">
          <div className="flex gap-2 bg-blue-500 text-white py-3 px-2">
            <span className="border px-1 self-center bg-white text-blue-700 mx-2 rounded-md font-inter font-semibold text-[13px]">
              4
            </span>
            <span className="font-inter font-semibold">PAYMENT OPTIONS</span>
          </div>

          <div className="p-7">
            <div className="flex flex-col gap-4">
              {/* UPI PAYMENT OPTION */}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="UPI"
                  name="payment"
                  onChange={handlePaymentSelection}
                  checked={selectedPayment === "UPI"}
                />

                <div className="flex flex-row gap-3">
                  <span>Pay</span>
                  {selectedPayment !== "COD" &&
                    selectedPayment !== "" &&
                    timeLeft > 0 && (
                      <div className="fixed bottom-10 right-10 bg-black text-white p-3 rounded-md text-sm font-semibold">
                        Payment expires in:{" "}
                        <span className="text-yellow-400">
                          {`${String(Math.floor(timeLeft / 60)).padStart(
                            2,
                            "0"
                          )}:${String(timeLeft % 60).padStart(2, "0")}`}
                        </span>
                      </div>
                    )}
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="COD"
                  name="payment"
                  onChange={handlePaymentSelection}
                />
                <span>Cash on Delivery (COD)</span>
              </label>

              {/* Confirm Order Button */}
              {selectedPayment && (
                <button
                  onClick={createRazorpayOrder}
                  className="bg-orange-500 text-white px-2 py-1 rounded-md mt-4"
                >
                  {selectedPayment === "COD" ? "Confirm Order" : "Pay Now"}
                </button>
              )}


              
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow-md">...</div>
      )}
    </>
  );
};

export default CheckOutPaymentOrder;
