import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MenuIcon } from '@heroicons/react/outline';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard/Dashboard';
// import Orders from './Orders';
// import Orders from './Orders/Orders';
import CategorySection from './Categories/MainCategory/CategorySection';
import SubCategorySection from './Categories/SubCategorySection';
import SubsubCategorySection from './Categories/SubsubCategorySection';
// import ItemsSection from './Categories/Items';

import Coupon from './Coupon';
import ManageUsers from './ManageUser';
import DeliveryReports from './DeliveryReports';
import CancelReports from './CancelReports';
import CustomerMails from './CustomerMail';
import RefundReport from './RefundReport';
import AdminProfile from './adminProfile';
import RatingsAndReviewsTable from './RatingsAndReviewsTable';
import AddItemForm from './Categories/AddItemForm';
import Single_Product_page from '../Product/Single_Product_page';
import SalesDetails from './SalesDetails';
import Delivery_management from './Delivery_management';
import Manage_warehouse from './Manage_warehouse';
import Manage_Pincode from './Manage_Pincode';
import Manage_Purchase from './Manage_Purchase';
import Manage_Supplier from './Manage_Supplier';
import Manage_SIUnits from './Manage_SIUnits';
import Managebrand from './Brand/Managebrand';
import ManagePurchaseStock from './Stocks/Purchase/ManagePurchaseStock';
import SIUnit from './SI_Units/SIUnit';
import Stocks from './Stocks/Stocks';
import LooseStocks from './Stocks/Loose/LooseStocks';
import PacketStocks from './Stocks/Packet/PacketStocks';
import PacketVarient from './Varients/PacketVarients/PacketVarient';
import AddPacketVarient from './Varients/PacketVarients/AddPacketVarient';
import LooseVarient from './Varients/LooseVarients/LooseVarient';
import ManageGST from './GST/ManageGST';
import PurchaseList from './Stocks/Purchase/PurchaseList';
import ViewDetails from './Stocks/Purchase/ViewDetails';
import AddLooseVarient from './Varients/LooseVarients/AddLooseVarient';
import AddItems from './Items/AddItems';
import ViewVarients from './Varients/LooseVarients/ViewVarients';
import ViewPacketVarient from './Varients/PacketVarients/ViewVariant/ViewPacketVarient';
import Manage_Offers from './Offer/Manage_Offers';
import Offer_History from './Offer/Offer_History';
import AddOffers from './Offer/AddOffers';
import AddDeliveryExecutive from './DeliveryExecutive/AddDeliveryExecutive';
import Merchant_Profile from './Profile/Merchant_Profile';
import DeliveryDateDashboard from './Orders/ManageDeliveryDates/DeliveryDateDashboard';
import AssignDeliveryExecutive from './Orders/AssignDeliveryExecutive';
import Track_order from './Orders/Track_order';
import OnDelivery from './Orders/OnDelivery';
import ViewAllExecutives from './DeliveryExecutive/ViewAllExecutives';
import ExecutiveOrderHistory from './DeliveryExecutive/ExecutiveOrderHistory/ExecutiveOrderHistory';
import Warehousestock from './Manage Warehouse/Warehousestock';
import ReturnOrders from './Orders/Manage Returned Order/ReturnOrders';
import ReturnRequests from './Orders/Manage Returned Order/ReturnRequests';
import Return_AssignDeliverExecutive from './Orders/Manage Returned Order/Return_AssignDeliverExecutive';
import CancelOrderItems from './Orders/Manage Cancel Order/CancelOrderItems';
import CancelRequests from './Orders/Manage Cancel Order/CancelRequests';
import MobileAppHomeManagement from './Home Management/Mobile/MobileAppHomeManagement';
import DesktopHomeManagement from './Home Management/Desktop/DesktopHomeManagement';
import FeaturedBannerZone from './Home Management/Desktop/FeaturedBannerZone';
import ReturnPurchase from './Stocks/Purchase/ReturnPurchase';
import ManagePayment from './Orders/ManagePayment/ManagePayment';
import UserPaymentDetails from './Orders/ManagePayment/UserPaymentDetails';
import ManageOrder from './Orders/ManageOrder/ManageOrder';
import SignUpOffers from './Manage_SingupOffers/SignUpOffers';
import AddSignUpOffers from './Manage_SingupOffers/AddSignUpOffers';
import MainGroup from './MainGroup/MainGroup';
// import TotalSales from './Dashboard/Totalsales';
// import AssignedOrders from './DeliveryExecutive/ExecutiveOrderHistory';






const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Merchanttoken = localStorage.getItem('Merchanttoken');

  return (
    <div className="relative xl:flex h-screen">
      {/* Menu Icon for small screens */}
      <div className="xl:hidden p-4">
        <MenuIcon
          className="h-6 w-6 text-black cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed z-10 top-0 left-0 h-screen bg-gray-800 text-white transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } xl:relative xl:translate-x-0 xl:w-64 xl:block`}
      >
        <Sidebar />
      </div>

      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

{/* // {`/admin/${Merchanttoken}/`} */}

      {/* Main content area */}
      <div className="flex-1 ml-0 xl:ml-6 overflow-y-auto p-4">
        <Routes>
          <Route path= {`${Merchanttoken}/mainGroup`} element={<MainGroup />} />

          <Route path= {`${Merchanttoken}/`} element={<Dashboard />} />
          <Route path= {`${Merchanttoken}/profile`} element={<Merchant_Profile />} />
          <Route path= {`${Merchanttoken}/dashboard`} element={<Dashboard />} />
          {/* <Route path= {`${Merchanttoken}/totalsales`} element={<TotalSales />} /> */}
          <Route path={`${Merchanttoken}/Orders`} element={<ManageOrder />} />
          <Route path={`${Merchanttoken}/maincategory`} element={<CategorySection />} />
          {/* <Route path="/maincategory/:category_id" element={<CategorySection />} /> */}

          <Route path={`${Merchanttoken}/subcategory`} element={<SubCategorySection />} />
          <Route path={`${Merchanttoken}/subsubCategory`} element={<SubsubCategorySection />} />
          <Route path={`${Merchanttoken}/coupons`} element={<Coupon />} />
          <Route path={`${Merchanttoken}/manageusers`} element={<ManageUsers />} />
          <Route path={`${Merchanttoken}/deliveryreport`} element={<DeliveryReports />} />
          <Route path={`${Merchanttoken}/cancelreport`} element={<CancelReports />} />
          <Route path={`${Merchanttoken}/customermail`} element={<CustomerMails />} />
          <Route path={`${Merchanttoken}/refundreport`} element={<RefundReport />} />
          <Route path={`${Merchanttoken}/adminprofile`} element={<AdminProfile/>} />
          <Route path={`${Merchanttoken}/rating&reviews`} element={<RatingsAndReviewsTable/>} />
          <Route path={`${Merchanttoken}/UserPaymentDetails/:orderId`} element={<UserPaymentDetails/>} />
          {/* <Route path={`${Merchanttoken}/addItems`} element={<AddItemForm/>} /> */}
          <Route path={`${Merchanttoken}/stocks`} element={<Stocks/>} />
          <Route path={`${Merchanttoken}/warehousestock`} element={<Warehousestock/>} />


          {/* warehousestock */}

          <Route path={`${Merchanttoken}/OrderDates`} element={<DeliveryDateDashboard/>} />
          <Route path={`${Merchanttoken}/asignDeliveryExecutive`} element={<AssignDeliveryExecutive/>} />


          {/* manageReturnedOrders */}
          <Route path={`${Merchanttoken}/returnOrders`} element={<ReturnOrders/>} />

          <Route path={`${Merchanttoken}/returnRequests`} element={<ReturnRequests/>} />
          <Route path={`${Merchanttoken}/returnAssignDeliveryExecutive`} element={<Return_AssignDeliverExecutive/>} />


          <Route path={`${Merchanttoken}/CancelledItems`} element={<CancelOrderItems/>} />
          <Route path={`${Merchanttoken}/cancelRequests`} element={<CancelRequests/>} />




          {/* <Route path="/stocks" element={<Stocks_copy/>} /> */}

          <Route path={`${Merchanttoken}/product/:id`} element={<Single_Product_page/>} />
          <Route path={`${Merchanttoken}/SalesDetails/:id`} element={<SalesDetails/>} />
          <Route path={`${Merchanttoken}/deliverymanagement`} element={<Delivery_management/>} />
          <Route path={`${Merchanttoken}/managewarehouse`} element={<Manage_warehouse/>} />
          <Route path={`${Merchanttoken}/managepincode`} element={<Manage_Pincode/>} />
          <Route path={`${Merchanttoken}/manageBrand`} element={<Managebrand/>} />

          {/* <Route path={`${Merchanttoken}/managePurchase`} element={<dummyAdd/>} /> */}

          {/* <Route path={`${Merchanttoken}/managePurchase`} element={<dummyAdd/>} /> */}

          <Route path={`${Merchanttoken}/AddItems`} element={<AddItems />} />


          <Route path={`${Merchanttoken}/ManageOffer`} element={<Manage_Offers />} />
          <Route path={`${Merchanttoken}/OfferHistory`} element={<Offer_History />} />
          <Route path={`${Merchanttoken}/addOffer`} element={<AddOffers />} />



          <Route path={`${Merchanttoken}/viewLooseVarients`} element={<ViewVarients />} />

          <Route path={`${Merchanttoken}/viewPacketVarients`} element={<ViewPacketVarient/>} />

          <Route path={`${Merchanttoken}/managePurchase`} element={<ManagePurchaseStock />} />
          <Route path={`${Merchanttoken}/purchaseList`} element={<PurchaseList />} />
          <Route path={`${Merchanttoken}/purchaseDetails`} element={<ViewDetails />} />

          <Route path={`${Merchanttoken}/purchaseReturn`} element={<ReturnPurchase />} />
          <Route path={`${Merchanttoken}/payments`} element={<ManagePayment />} />

          <Route path={`${Merchanttoken}/addlooseVarient`} element={<AddLooseVarient />} />
          <Route path={`${Merchanttoken}/addpacketVarient`} element={<AddPacketVarient />} />


          <Route path={`${Merchanttoken}/manageSIUnits`} element={<SIUnit/>} />

          <Route path={`${Merchanttoken}/manageSupplier`} element={<Manage_Supplier/>} />

          <Route path={`${Merchanttoken}/stocks`} element={<Stocks/>} />

          <Route path={`${Merchanttoken}/PacketStock`} element={<PacketStocks/>} />

          <Route path={`${Merchanttoken}/LooseStock`} element={<LooseStocks/>} />

          <Route path={`${Merchanttoken}/looseVarient`} element={<LooseVarient/>} />
          <Route path={`${Merchanttoken}/packetVarient`} element={<PacketVarient/>} />

          <Route path={`${Merchanttoken}/gst`} element={<ManageGST/>} />

          <Route path={`${Merchanttoken}/order/ondelivery`} element={<OnDelivery/>} />

          <Route path={`${Merchanttoken}/order/track/:lat/:long`} element={<Track_order/>} />



          <Route path={`${Merchanttoken}/DeliveryExecutive`} element={<AddDeliveryExecutive/>} />

          {/* ********** Delivery Executive ******** */}

          <Route path={`${Merchanttoken}/DeliveryExecutive/viewAll`} element={<ViewAllExecutives/>} />
          <Route path={`${Merchanttoken}/DeliveryExecutive/assignOrders`} element={<ExecutiveOrderHistory/>} />



{/* **************Home Management*********************** */}

<Route path={`${Merchanttoken}/DesktopHomeManagement`} element={<DesktopHomeManagement/>} />
<Route path={`${Merchanttoken}/MobileHomeManagement`} element={<MobileAppHomeManagement/>} />
<Route path={`${Merchanttoken}/FeaturedOfferzone`} element={<FeaturedBannerZone/>} />




          {/* <Route path={`${Merchanttoken}/manageItem`} element={<Manage_Item/>} /> */}




          <Route path= {`${Merchanttoken}/singupOffers`} element={<SignUpOffers />} />
          <Route path= {`${Merchanttoken}/Add-singupOffers`} element={<AddSignUpOffers />} />






        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
