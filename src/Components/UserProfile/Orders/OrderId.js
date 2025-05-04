import React from 'react';
import './OrderDetails.css'; // Assuming you have a CSS file for styling

const OrderId = () => {
  return (
    <div className="order-details-container">
      <h1>My Account</h1>
      <h2>My Orders</h2>
      <div className="order-id">
        <strong>Order ID:</strong> OD125472675644549000
      </div>

      <div className="delivery-address">
        <h3>Delivery Address</h3>
        <p>Abhishek</p>
        <p>Chuna batta road, kokar Kokar dislary pool, Kokar park</p>
        <p>Ranchi - 834001, Jharkhand</p>
        <p><strong>Phone number:</strong> 7992275028, 9525287906</p>
      </div>

      <div className="rewards">
        <h3>Your Rewards</h3>
        <p><strong>4 SuperCoins Cashback</strong></p>
        <p>Use it to save on your next order</p>
      </div>

      <div className="more-actions">
        <h3>More actions</h3>
        <button>Download Invoice</button>
        <button>Replacement Request</button>
      </div>

      <div className="order-status">
        <h3>Cancelled</h3>
        <p>We're sorry. We are unable to process your replace request. Please refer to seller return policy.</p>
      </div>

      <div className="order-item">
        <h3>KWINE CASE Back Cover for vivo S1 Pro</h3>
        <p><strong>Color:</strong> Red</p>
        <p><strong>Seller:</strong> DESIGNERHUBZ</p>
        <p><strong>Price:</strong> ₹299</p>
        <p><strong>1 Offer & 1 Coupon Applied?</strong></p>
        <div className="order-timeline">
          <p><strong>Order Confirmed:</strong> Fri, 15th Jul</p>
          <p><strong>Delivered:</strong> Sun, 17th Jul</p>
          <p><strong>Return Cancelled:</strong> Sat, 23rd Jul</p>
          <p><strong>Cancelled on:</strong> Jul 23, 2022</p>
        </div>
        <div className="actions">
          <button>Rate & Review Product</button>
          <button>Chat with us</button>
        </div>
      </div>

      <div className="order-item">
        <h3>Replacement KWINE CASE Back Cover for vivo S1 Pro</h3>
        <p><strong>Color:</strong> Red</p>
        <p><strong>Seller:</strong> DESIGNERHUBZ</p>
        <p><strong>Price:</strong> ₹299</p>
        <p><strong>Cancelled on:</strong> Jul 22, 2022</p>
        <p>Your Return request is Cancelled</p>
      </div>
    </div>
  );
};

export default OrderId;
