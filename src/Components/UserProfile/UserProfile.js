import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import Addresses from './Addresses/Addresses';
import PANCardInfo from './PANCardInfo';
// import GiftCard from './GiftCard';
import SavedUPI from './SavedUpi';
import SavedCards from './SavedCards';
import MyCoupans from './MyCoupans';
import MyReviewsRating from './MyReviewsRating';
import AllNotifications from './AllNotifications';
import MyWhishlist from './MyWhishlist';
import StoreOffer from './StoreOffer';
import MobileCategoryHeader from '../Header&SideBar/MobileCategoryHeader';
import Orders from './Orders/Orders';
import GiftCard from './GiftCard/GiftCard';
import UserOrder from './Orders/UserOrder';
import OrderDetail from './Orders/OrderDetails/OrderDetail';
import ReferralBasePage from '../UserReferral/ReferralBasePage';
import Sidebar from '../Header&SideBar/Sidebar';

const UserProfile = () => {
  return (
    <div className="flex bg-gray-200 pt-24 justify-center gap-3  min-h-full w-full"
    
      style={{ minHeight: "calc(100vh - 90px)" }} // replace 80px with your actual footer height
    >
                <Sidebar />
      <div className=" ">
        
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="addresses" element={<Addresses />} />
          {/* <Route path="/orders" element={<UserOrder />} /> */}

    
          <Route path="pancard" element={<PANCardInfo />} />
          <Route path="giftcards" element={<GiftCard  />} /> 
          <Route path="savedupi" element={<SavedUPI  />} /> 
          <Route path="savedcard" element={<SavedCards  />} /> 
          <Route path="mycoupon" element={<MyCoupans  />} /> 
          <Route path="myreviews&ratings" element={<MyReviewsRating  />} /> 
          <Route path="allnotifications" element={<AllNotifications  />} /> 
          <Route path="mywishlist" element={<MyWhishlist  />} /> 
          <Route path="StoreOffer" element={<StoreOffer/>} /> 
          
        </Routes>
      </div>
    </div>
  );
};

export default UserProfile;
