import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CheckOut from './CheckOut';
import Header from '../Header&SideBar/Header/Header';



const CheckOutPanel = () => {
  return (
    <div className="">
                          <Header  />

      <div className="">

        <Routes>
        <Route path="/" element={<CheckOut />} />
        <Route path="/PaymentStatus-Check/*" element={<CheckOut />} />


        


          


         
          
        </Routes>
      </div>
    </div>
  );
};

export default CheckOutPanel;
