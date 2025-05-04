import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProfileUpdate from './ProfileUpdate';
import OrderStatus from './OrderStatus';
import DeliveryHistory from './DeliveryHistory';
import TrackOrder from './TrackOrder';

const DeliveryBoyApp = () => {
  return (
    <div>
      <h1>Delivery Boy Application</h1>
      <Routes>
        <Route path="profile-update" element={<ProfileUpdate />} />
        <Route path="order-status" element={<OrderStatus />} />
        <Route path="delivery-history" element={<DeliveryHistory />} />
        <Route path="track-order/:id" element={<TrackOrder />} />
        <Route path="/" element={<h3>Please select an option from delivery boy application.</h3>} />
      </Routes>
    </div>
  );
};

export default DeliveryBoyApp;
