import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TermsAndConditions from './TermsAndConditions';
import Profile from '../UserProfile/Profile';
import PrivacyPolicy from './PrivacyPolicy';
import ReturnsRefundPolicy from './ReturnsRefundPolicy';
import ShippingPolicy from './ShippingPolicy';
import AboutUs from './AboutUs';
import DisclaimerPolicy from './DisclaimerPolicy';
import ContactUs from './ContactUs';
import CancellationPolicy from './CancellationPolicy';



const FooterBasePage = () => {
  return (
    <div className="flex">
      <div className="w-full p-4">
        <Routes>
        <Route path="/terms-of-service" element={<TermsAndConditions />} />
          <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
          <Route path="/Returns-and-Refund" element={<ReturnsRefundPolicy />} />
          <Route path="/Exchange" element={<ReturnsRefundPolicy />} />
          <Route path="/Shipping-Policy" element={<ShippingPolicy />} />
          <Route path="/About-us" element={<AboutUs />} />
          <Route path="/disclaimer-policy" element={<DisclaimerPolicy />} />
          <Route path="/Contact-Us" element={<ContactUs />} />
          <Route path="/Cancellation" element={<CancellationPolicy />} />



          


         
          
        </Routes>
      </div>
    </div>
  );
};

export default FooterBasePage;
