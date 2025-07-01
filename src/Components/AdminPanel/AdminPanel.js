import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import Sidebar from "./Sidebar";
import LoadingModal from "../LoadingModal";
import RefferalsRouting from "./Refferals/RefferalsRouting";
import ManageCustomerBase from "./ManageCustomers/ManageCustomerBase";
import AddMainGroupModal from "./MainGroup/AddMainGroupModal";
import ViewStock from "./Stocks/ViewStock";
import WarehouseList from "./WareHousePincode/WarehouseList";
import WarehousePincodeForm from "./WareHousePincode/WarehouseForm";

// Lazy load components
const Dashboard = React.lazy(() => import("./Dashboard/Dashboard"));
const CategorySection = React.lazy(() => import("./Categories/MainCategory/CategorySection"));
const SubCategorySection = React.lazy(() => import("./Categories/SubCategorySection"));
const SubsubCategorySection = React.lazy(() => import("./Categories/SubsubCategorySection"));
const Coupon = React.lazy(() => import("./Coupon"));
const DeliveryReports = React.lazy(() => import("./DeliveryReports"));
const CancelReports = React.lazy(() => import("./CancelReports"));
const CustomerMails = React.lazy(() => import("./CustomerMail"));
const RefundReport = React.lazy(() => import("./RefundReport"));
const AdminProfile = React.lazy(() => import("./adminProfile"));
const RatingsAndReviewsTable = React.lazy(() => import("./RatingsAndReviewsTable"));
const AddItemForm = React.lazy(() => import("./Categories/AddItemForm"));
const Single_Product_page = React.lazy(() => import("../Product/Single_Product_page"));
const SalesDetails = React.lazy(() => import("./SalesDetails"));
const Delivery_management = React.lazy(() => import("./Delivery_management"));
const Manage_warehouse = React.lazy(() => import("./Manage_warehouse"));
const Manage_Pincode = React.lazy(() => import("./Manage_Pincode"));
const Manage_Purchase = React.lazy(() => import("./Manage_Purchase"));
const Manage_Supplier = React.lazy(() => import("./Manage_Supplier"));
const Manage_SIUnits = React.lazy(() => import("./Manage_SIUnits"));
const Managebrand = React.lazy(() => import("./Brand/Managebrand"));
// const ManagePurchaseStock = React.lazy(() => import("./Stocks/Purchase/ManagePurchaseStock"));

const PurchaseBasePage = React.lazy(() => import("./Purchase/Purchase_Component/PurchaseBasePage"));



const SIUnit = React.lazy(() => import("./SI_Units/SIUnit"));
const Stocks = React.lazy(() => import("./Stocks/Stocks"));
const LooseStocks = React.lazy(() => import("./Stocks/Loose/LooseStocks"));
const PacketStocks = React.lazy(() => import("./Stocks/Packet/PacketStocks"));
const PacketVarient = React.lazy(() => import("./Varients/PacketVarients/PacketVarient"));
const AddPacketVarient = React.lazy(() => import("./Varients/PacketVarients/AddPacketVarient"));
const LooseVarient = React.lazy(() => import("./Varients/LooseVarients/LooseVarient"));
const ManageGST = React.lazy(() => import("./GST/ManageGST"));
const PurchaseList = React.lazy(() => import("./Purchase/purchaseList"));
const ViewDetails = React.lazy(() => import("./Purchase/ViewDetails"));
const AddLooseVarient = React.lazy(() => import("./Varients/LooseVarients/AddLooseVarient"));
const AddItems = React.lazy(() => import("./Items/AddItems"));
const ViewVarients = React.lazy(() => import("./Varients/LooseVarients/ViewVarients"));
const ViewPacketVarient = React.lazy(() => import("./Varients/PacketVarients/ViewVariant/ViewPacketVarient"));
const Manage_Offers = React.lazy(() => import("./Offer/Manage_Offers"));
const Offer_History = React.lazy(() => import("./Offer/Offer_History"));
const AddOffers = React.lazy(() => import("./Offer/AddOffers"));
const AddDeliveryExecutive = React.lazy(() => import("./DeliveryExecutive/AddDeliveryExecutive"));
const Merchant_Profile = React.lazy(() => import("./Profile/Merchant_Profile"));
const DeliveryDateDashboard = React.lazy(() => import("./Orders/ManageDeliveryDates/DeliveryDateDashboard"));
const AssignDeliveryExecutive = React.lazy(() => import("./Orders/AssignDeliveryExecutive"));
const Track_order = React.lazy(() => import("./Orders/Track_order"));
const OnDelivery = React.lazy(() => import("./Orders/OnDelivery"));
const ViewAllExecutives = React.lazy(() => import("./DeliveryExecutive/ViewAllExecutives"));
const ExecutiveOrderHistory = React.lazy(() => import("./DeliveryExecutive/ExecutiveOrderHistory/ExecutiveOrderHistory"));
const Warehousestock = React.lazy(() => import("./Manage Warehouse/Warehousestock"));
const ReturnOrders = React.lazy(() => import("./Orders/Manage Returned Order/ReturnOrders"));
const ReturnRequests = React.lazy(() => import("./Orders/Manage Returned Order/ReturnRequests"));
const Return_AssignDeliverExecutive = React.lazy(() => import("./Orders/Manage Returned Order/Return_AssignDeliverExecutive"));
const CancelOrderItems = React.lazy(() => import("./Orders/Manage Cancel Order/CancelOrderItems"));
const CancelRequests = React.lazy(() => import("./Orders/Manage Cancel Order/CancelRequests"));
const MobileAppHomeManagement = React.lazy(() => import("./Home Management/Mobile/MobileAppHomeManagement"));
const DesktopHomeManagement = React.lazy(() => import("./Home Management/Desktop/DesktopHomeManagement"));
const FeaturedBannerZone = React.lazy(() => import("./Home Management/Desktop/FeaturedBannerZone"));
const ReturnPurchase = React.lazy(() => import("./Purchase/ReturnPurchase"));
const ManagePayment = React.lazy(() => import("./Orders/ManagePayment/ManagePayment"));
const UserPaymentDetails = React.lazy(() => import("./Orders/ManagePayment/UserPaymentDetails"));
const ManageOrder = React.lazy(() => import("./Orders/ManageOrder/ManageOrder"));
const SignUpOffers = React.lazy(() => import("./Manage_SingupOffers/SignUpOffers"));
const AddSignUpOffers = React.lazy(() => import("./Manage_SingupOffers/AddSignUpOffers"));
const MainGroup = React.lazy(() => import("./MainGroup/MainGroup"));

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Merchanttoken = localStorage.getItem("Merchanttoken");

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
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
         <Suspense fallback={<LoadingModal/>}>
        <Routes>


{/* Refferasl */}


        <Route path={`${Merchanttoken}/ManageRefferals/*`} element={<RefferalsRouting />} />


         <Route path={`${Merchanttoken}/manage-customer/*`} element={<ManageCustomerBase />}/>

         
         <Route path={`${Merchanttoken}/warehouseList`} element={<WarehouseList />}/>

           <Route path={`${Merchanttoken}/WarehousePincodeForm/Edit/:warehouse_id`} element={<WarehousePincodeForm />}/>



                  <Route path={`${Merchanttoken}/WarehousePincodeForm`} element={<WarehousePincodeForm />}/>





          <Route path={`${Merchanttoken}/mainGroup`} element={<MainGroup />} />
          <Route path={`${Merchanttoken}/mainGroup/add`} element={<AddMainGroupModal />} />
             <Route path={`${Merchanttoken}/mainGroup/update/:id`} element={<AddMainGroupModal />} />


                          <Route path={`${Merchanttoken}/packetStock/view/:warehouse_unique_id`} element={<ViewStock />} />









          <Route path={`${Merchanttoken}/`} element={<Dashboard />} />
          <Route
            path={`${Merchanttoken}/profile`}
            element={<Merchant_Profile />}
          />
          <Route path={`${Merchanttoken}/dashboard`} element={<Dashboard />} />
          {/* <Route path= {`${Merchanttoken}/totalsales`} element={<TotalSales />} /> */}



          <Route path={`${Merchanttoken}/Orders`} element={<ManageOrder />} />



          <Route
            path={`${Merchanttoken}/maincategory`}
            element={<CategorySection />}
          />
          {/* <Route path="/maincategory/:category_id" element={<CategorySection />} /> */}

          <Route
            path={`${Merchanttoken}/subcategory`}
            element={<SubCategorySection />}
          />
          <Route
            path={`${Merchanttoken}/subsubCategory`}
            element={<SubsubCategorySection />}
          />
          <Route path={`${Merchanttoken}/coupons`} element={<Coupon />} />
          <Route
            path={`${Merchanttoken}/deliveryreport`}
            element={<DeliveryReports />}
          />
          <Route
            path={`${Merchanttoken}/cancelreport`}
            element={<CancelReports />}
          />
          <Route
            path={`${Merchanttoken}/customermail`}
            element={<CustomerMails />}
          />
          <Route
            path={`${Merchanttoken}/refundreport`}
            element={<RefundReport />}
          />
          <Route
            path={`${Merchanttoken}/adminprofile`}
            element={<AdminProfile />}
          />
          <Route
            path={`${Merchanttoken}/rating&reviews`}
            element={<RatingsAndReviewsTable />}
          />
          <Route
            path={`${Merchanttoken}/UserPaymentDetails/:orderId`}
            element={<UserPaymentDetails />}
          />
          {/* <Route path={`${Merchanttoken}/addItems`} element={<AddItemForm/>} /> */}
          <Route path={`${Merchanttoken}/stocks`} element={<Stocks />} />
          <Route
            path={`${Merchanttoken}/warehousestock`}
            element={<Warehousestock />}
          />

          {/* warehousestock */}

          <Route
            path={`${Merchanttoken}/OrderDates`}
            element={<DeliveryDateDashboard />}
          />
          <Route
            path={`${Merchanttoken}/asignDeliveryExecutive`}
            element={<AssignDeliveryExecutive />}
          />

          {/* manageReturnedOrders */}
          <Route
            path={`${Merchanttoken}/returnOrders`}
            element={<ReturnOrders />}
          />

          <Route
            path={`${Merchanttoken}/returnRequests`}
            element={<ReturnRequests />}
          />
          <Route
            path={`${Merchanttoken}/returnAssignDeliveryExecutive`}
            element={<Return_AssignDeliverExecutive />}
          />

          <Route
            path={`${Merchanttoken}/CancelledItems`}
            element={<CancelOrderItems />}
          />
          <Route
            path={`${Merchanttoken}/cancelRequests`}
            element={<CancelRequests />}
          />

          {/* <Route path="/stocks" element={<Stocks_copy/>} /> */}

          <Route
            path={`${Merchanttoken}/product/:id`}
            element={<Single_Product_page />}
          />
          <Route
            path={`${Merchanttoken}/SalesDetails/:id`}
            element={<SalesDetails />}
          />
          <Route
            path={`${Merchanttoken}/deliverymanagement`}
            element={<Delivery_management />}
          />
          <Route
            path={`${Merchanttoken}/managewarehouse`}
            element={<Manage_warehouse />}
          />
          <Route
            path={`${Merchanttoken}/managepincode`}
            element={<Manage_Pincode />}
          />
          <Route
            path={`${Merchanttoken}/manageBrand`}
            element={<Managebrand />}
          />

          {/* <Route path={`${Merchanttoken}/managePurchase`} element={<dummyAdd/>} /> */}

          {/* <Route path={`${Merchanttoken}/managePurchase`} element={<dummyAdd/>} /> */}

          <Route path={`${Merchanttoken}/AddItems`} element={<AddItems />} />

          <Route
            path={`${Merchanttoken}/ManageOffer`}
            element={<Manage_Offers />}
          />
          <Route
            path={`${Merchanttoken}/OfferHistory`}
            element={<Offer_History />}
          />
          <Route path={`${Merchanttoken}/addOffer`} element={<AddOffers />} />

          <Route
            path={`${Merchanttoken}/viewLooseVarients`}
            element={<ViewVarients />}
          />

          <Route
            path={`${Merchanttoken}/viewPacketVarients`}
            element={<ViewPacketVarient />}
          />

          <Route
            path={`${Merchanttoken}/managePurchase`}
            element={<PurchaseBasePage />}
            // element={<ManagePurchaseStock />}

          />
          <Route
            path={`${Merchanttoken}/purchaseList`}
            element={<PurchaseList />}
          />
          <Route
            path={`${Merchanttoken}/purchaseDetails`}
            element={<ViewDetails />}
          />

          <Route
            path={`${Merchanttoken}/purchaseReturn`}
            element={<ReturnPurchase />}
          />
          <Route
            path={`${Merchanttoken}/payments`}
            element={<ManagePayment />}
          />

          <Route
            path={`${Merchanttoken}/addlooseVarient`}
            element={<AddLooseVarient />}
          />
          <Route
            path={`${Merchanttoken}/addpacketVarient`}
            element={<AddPacketVarient />}
          />

          <Route path={`${Merchanttoken}/manageSIUnits`} element={<SIUnit />} />

          <Route
            path={`${Merchanttoken}/manageSupplier`}
            element={<Manage_Supplier />}
          />

          <Route path={`${Merchanttoken}/stocks`} element={<Stocks />} />

          <Route
            path={`${Merchanttoken}/PacketStock`}
            element={<PacketStocks />}
          />

          <Route
            path={`${Merchanttoken}/LooseStock`}
            element={<LooseStocks />}
          />

          <Route
            path={`${Merchanttoken}/looseVarient`}
            element={<LooseVarient />}
          />
          <Route
            path={`${Merchanttoken}/packetVarient`}
            element={<PacketVarient />}
          />

          <Route path={`${Merchanttoken}/gst`} element={<ManageGST />} />

          <Route
            path={`${Merchanttoken}/order/ondelivery`}
            element={<OnDelivery />}
          />

          <Route
            path={`${Merchanttoken}/order/track/:lat/:long`}
            element={<Track_order />}
          />

          <Route
            path={`${Merchanttoken}/DeliveryExecutive`}
            element={<AddDeliveryExecutive />}
          />

          {/* ********** Delivery Executive ******** */}

          <Route
            path={`${Merchanttoken}/DeliveryExecutive/viewAll`}
            element={<ViewAllExecutives />}
          />
          <Route
            path={`${Merchanttoken}/DeliveryExecutive/assignOrders`}
            element={<ExecutiveOrderHistory />}
          />

          {/* **************Home Management*********************** */}

          <Route
            path={`${Merchanttoken}/DesktopHomeManagement`}
            element={<DesktopHomeManagement />}
          />
          <Route
            path={`${Merchanttoken}/MobileHomeManagement`}
            element={<MobileAppHomeManagement />}
          />
          <Route
            path={`${Merchanttoken}/FeaturedOfferzone`}
            element={<FeaturedBannerZone />}
          />

          {/* <Route path={`${Merchanttoken}/manageItem`} element={<Manage_Item/>} /> */}

          <Route
            path={`${Merchanttoken}/singupOffers`}
            element={<SignUpOffers />}
          />
          <Route
            path={`${Merchanttoken}/Add-singupOffers`}
            element={<AddSignUpOffers />}
          />
        </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default AdminPanel;
