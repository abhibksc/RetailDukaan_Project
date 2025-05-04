import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SProfile from './SProfile';
import MobileSideBar from './MobileSideBar';
import { FaRegUserCircle } from 'react-icons/fa';
import BackButton from '../BackButton';
import useTruncateSentance from '../UseFullHooks/useTruncateSentance';
import { useDispatch, useSelector } from 'react-redux';
import SAddresses from './SmallScreenAddresses/SAddresses';
import { activeMobileLoginPages, logout } from '../ReduxStore/Slices/auth';
// import Profile from './Profile';
// import Addresses from './Addresses';
// import PANCardInfo from './PANCardInfo';
// // import GiftCard from './GiftCard';
// import SavedUPI from './SavedUpi';
// import SavedCards from './SavedCards';
// import MyCoupans from './MyCoupans';
// import MyReviewsRating from './MyReviewsRating';
// import AllNotifications from './AllNotifications';
// import MyWhishlist from './MyWhishlist';
// import StoreOffer from './StoreOffer';
// import MobileCategoryHeader from '../Header&SideBar/MobileCategoryHeader';
// import Orders from './Orders/Orders';
// import GiftCard from './GiftCard/GiftCard';

const SUserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {truncateText} = useTruncateSentance();

  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const phone = useSelector((state) => state.auth.phone);
  const register = useSelector((state) => state.auth.registered);


  return (
    <div className="flex h-[calc(100vh-66px)] overflow-y-auto">
      <div className="w-full ">
        <header className="fixed  z-40 w-full h-16 bg-gradient-to-b from-green-400 to-white shadow-md shadow-green-200">
        <div className="flex  justify-between mx-5">
        <BackButton className="mt-3 "/>
        
        {/* Profile Info */}
        <div className="flex mt-5 gap-3">
        
        <h1 className="font-semibold" onClick={()=>{

             localStorage.removeItem("token");
                  dispatch(logout());
                  navigate("/");
 dispatch(activeMobileLoginPages({ login: true }));


        }}>
        {  (name || email) ? truncateText(name || email , 1) || email  : "logout"}
        </h1>
        <FaRegUserCircle size={25} className="text-blue-600 hover:text-blue-800"  onClick={()=>navigate("/Profile")  }/>
        
        </div>
        
        </div>
        
        
                </header>

        <Routes>
          <Route path="/" element={<MobileSideBar />} />
          <Route path="/personal-Information" element={<SProfile />} />
          <Route path="/addresses" element={<SAddresses />} />


          <Route path="/mywishlist" element={<div className='text-center text-gray-500 mt-28'> 
            No Data
          </div>} />
          <Route path="/giftcards" element={<div className='text-center text-gray-500 mt-28'> 
            No Data
          </div>} />

          <Route path="/allnotifications" element={<div className='text-center text-gray-500 mt-28'> 
            No Data
          </div>} />


          {/* <Route path="addresses" element={<Addresses />} /> */}
          {/* <Route path="pancard" element={<PANCardInfo />} /> */}
          {/* <Route path="giftcards" element={<GiftCard  />} />  */}
          {/* <Route path="savedupi" element={<SavedUPI  />} />  */}
          {/* <Route path="savedcard" element={<SavedCards  />} />  */}
          {/* <Route path="mycoupon" element={<MyCoupans  />} />  */}
          {/* <Route path="myreviews&ratings" element={<MyReviewsRating  />} />  */}
          {/* <Route path="allnotifications" element={<AllNotifications  />} />  */}
          {/* <Route path="mywishlist" element={<MyWhishlist  />} />  */}
          {/* <Route path="StoreOffer" element={<StoreOffer/>} />  */}
          
        </Routes>
      </div>
    </div>
  );
};

export default SUserProfile;
