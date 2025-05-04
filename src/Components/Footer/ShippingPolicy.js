import React from "react";
import { Link } from "react-router-dom";

const ShippingPolicy = () => {
  return (
    <div className=" px-5">
      <div className="max-w-6xl mx-auto bg-white p-8 ">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            At <span className="font-semibold">Gupta Trading Company</span>, we believe
            shipping should be hassle-free! That’s why we ensure your purchases
            reach you in a timely manner without additional shipping charges.
            Yes, you heard it right—<span className="font-semibold">free shipping across India</span> on all
            orders, no matter the size. So, shop to your heart’s content, and
            let us handle the logistics!
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Fast and Reliable Shipping
              </h2>
              <p className="text-gray-600 mt-2">
                All orders are shipped within <span className="font-semibold">3-5 working days</span> of placing the
                order. Deliveries typically take an additional{" "}
                <span className="font-semibold">2-5 working days</span> to reach
                your doorstep, depending on transit conditions.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Exceptional Delivery Experience
              </h2>
              <p className="text-gray-600 mt-2">
                We work hard to ensure your orders are delivered in excellent
                condition and as quickly as possible. While rare, delays may
                occur due to circumstances beyond our control, and we appreciate
                your understanding in such cases.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Transparency in Charges
              </h2>
              <p className="text-gray-600 mt-2">
                For products requiring separate shipping charges, the details
                will be clearly indicated on the product page and during
                checkout. However, most orders ship free!
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Single Shipping Address Per Order
              </h2>
              <p className="text-gray-600 mt-2">
                Each order can be shipped to only one address. To ship items to
                multiple addresses, you’ll need to place separate orders. Don’t
                worry—shipping is free no matter how many orders you place!
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Inclusive Pricing
              </h2>
              <p className="text-gray-600 mt-2">
                All prices are inclusive of applicable charges and taxes (Terms
                and Conditions apply).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Delivery Confirmation
              </h2>
              <p className="text-gray-600 mt-2">
                Delivery is deemed complete when the goods are delivered to the
                address you provided at the time of purchase.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Tracking Your Order
              </h2>
              <p className="text-gray-600 mt-2">
                Once your order is shipped, we’ll send you an email with the
                courier and tracking details. You can use these details to
                monitor your shipment’s progress online.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                No Express Delivery
              </h2>
              <p className="text-gray-600 mt-2">
                Please note that express delivery services are not available at
                the moment.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Courier Partner Contact
              </h2>
              <p className="text-gray-600 mt-2">
                By placing an order on <span className="font-semibold">Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)</span>, you authorize our
                logistics partner to contact you regarding the delivery of your
                order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
