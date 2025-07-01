import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaTags,
  FaUserCog,
  FaThLarge,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
  FaTasks,
  FaChartBar,
  FaRegCalendarCheck,
  FaMoneyCheckAlt,
  FaCommentDots,
  FaBookOpen,
  FaHeadset,
  FaUsers,
  FaCalendarAlt,
  FaUndoAlt,
  FaBan,
  FaBoxOpen,
  FaEnvelopeOpenText,
  FaRedoAlt,
  FaReply,
  FaFileAlt,
  FaTruck,
  FaUserCheck,
  FaUserTimes,
  FaBoxes,
  FaCalendarCheck,
  FaDesktop,
  FaMobileAlt,
  FaGift,
  FaShoppingCart,
  FaListAlt,
} from "react-icons/fa";


import {
  FaHome,
  FaTags,
  FaTruck,
  FaDesktop,
  FaGift,
  FaUserCheck,
  FaClipboardList,
  FaBoxes,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaBan,
  FaEnvelopeOpenText,
  FaUserCog,
  FaUsers,
  FaCubes,
  FaCube,
  FaThList,
  FaListAlt,
  FaShoppingCart,
  FaWarehouse,
} from "react-icons/fa";



import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { admin, MerchantLogout, updateToken } from "../ReduxStore/Slices/auth";
import { FaClipboardList, FaUserTie } from "react-icons/fa6";
import { logo } from "../CrudOperations/customURl";

const Sidebar = ({ onLinkClick }) => {
  const Merchanttoken = localStorage.getItem("Merchanttoken");
  const userName = "Merchant";
  const adminLogo = "https://via.placeholder.com/150"; // Replace with actual logo URL

  const [openAccordion, setOpenAccordion] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleLogout = () => {
    console.log("Chala logout");

    dispatch(MerchantLogout());
    localStorage.removeItem("Merchanttoken");

    navigate("/superadmin/login");
  };

  // {`/admin/${Merchanttoken}/`}

  const sidebarLinks = [
    {
      to: `/admin/${Merchanttoken}/dashboard`,
      label: "Dashboard",
      icon: <FaHome />,
    },

     {
      label: "Manage Warehouse",
      icon: <FaUserCog />,
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/managewarehouse`,
          label: "Warehouse",
          icon: <FaUserCog />,
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },

        {
          to: `/admin/${Merchanttoken}/warehouseList`,
          label: "Warehouse'Pincodes",
          icon: <FaUserCog />,
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },

        // {
        //   to: `/admin/${Merchanttoken}/warehousestock`,
        //   label: "Warehouse Stock",
        //   icon: <FaUserCog />,
        //   textClass: "text-[14px]",
        //   textcolour: "text-gray-300",
        // },
      ],
    },

    //     {
    //   to: `/admin/${Merchanttoken}/managepincode`,
    //   label: "Manage Pin Code",
    //   icon: <FaUserCog />,
    // },




      {
      label: "Wallet & Txn",
      icon: <FaThLarge />,
      subLinks: [
          {
          to: `/admin/${Merchanttoken}/manage-customer`,
          label: "User's Wallet",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },

              {
          to: `/admin/${Merchanttoken}/ManageRefferals/all-refferals`,
          label: "User's Refferals Wallet",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },


     
      ],
    },






  {
      label: "Users & Refferals",
      icon: <FaThLarge />,
      subLinks: [
          {
          to: `/admin/${Merchanttoken}/manage-customer`,
          label: "Users",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },

              {
          to: `/admin/${Merchanttoken}/ManageRefferals/all-refferals`,
          label: "User's Refferals",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },


                    {
          to: `/admin/${Merchanttoken}/ManageRefferals/all-refferals`,
          label: "User's MileStone",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },


                          


        {
          to: `/admin/${Merchanttoken}/ManageRefferals`,
          label: "Refferal Configuration",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          // icon: <FaUserCog />,
        },
      ],
    },





















    {
      label: "Manage Offers",
      icon: <FaThLarge />,
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/ManageOffer`,
          label: "Product Offers",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          // icon: <FaUserCog />,
        },
        {
          to: `/admin/${Merchanttoken}/singupOffers`,
          label: "Signup Offers",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
      ],
    },

    {
      label: "Home Management",
      icon: <FaTruck />, // Icon for Home Management (Delivery Truck)
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/DesktopHomeManagement`,
          label: "Desktop App",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaDesktop />, // Icon for Desktop App
        },
        // {
        //   to: `/admin/${Merchanttoken}/MobileHomeManagement`,
        //   label: "Mobile App",
        //   textClass: "text-[14px]",
        //   textcolour: "text-gray-300",
        //   icon: <FaMobileAlt />, // Icon for Mobile App
        // },
        {
          to: `/admin/${Merchanttoken}/FeaturedOfferzone`,
          label: "Offer Zone",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaGift />, // Icon for Offer Zone (Gifts/Deals)
        },
      ],
    },

    {
      label: "Manage Order",
      icon: <FaClipboardList />, // Icon for "Manage Order" (Checklist)
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/orders`,
          label: "Orders",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaBoxes />, // Icon for "Orders" (Multiple Boxes)
        },

        {
          to: `/admin/${Merchanttoken}/OrderDates`,
          label: "Scheduled Orders (date)",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaCalendarCheck />, // Icon for "Scheduled Orders" (Calendar with Checkmark)
        },
      ],
    },



    {
      label: "Assign Delivery Executive",
      icon: <FaTruck />, // Icon for "Assign Delivery Executive" (Delivery Truck)
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/asignDeliveryExecutive`,
          label: "To Delivery",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaUserCheck />, // Icon for "Assign Delivery Executive for Delivery" (User Assigned)
        },
        // {
        //   to: `/admin/${Merchanttoken}/returnAssignDeliveryExecutive`,
        //   label: "To Return",
        //   textClass: "text-[14px]",
        //   textcolour: "text-gray-300",
        //   icon: <FaUserTimes />, // Icon for "Assign Delivery Executive for Returns" (User and Return)
        // }
      ],
    },


    {
      label: "Manage Payment",
      icon: <FaClipboardList />, // Icon for "Manage Order" (Checklist)
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/payments`,
          label: "Payment",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaBoxes />, // Icon for "Orders" (Multiple Boxes)
        },
      ],
    },

    {
      label: "Manage Cancel Order",
      icon: <FaBan />, // Icon for "Manage Cancel Order" (Ban/Cancellation)
      subLinks: [
        // {
        //   to: `/admin/${Merchanttoken}/CancelledItems`,
        //   label: "Cancel Items",
        //   textClass: "text-[14px]",
        //   textcolour: "text-gray-300",
        //   icon: <FaBoxOpen />, // Icon for "Cancel Items" (Open Box)
        // },
        {
          to: `/admin/${Merchanttoken}/cancelRequests`,
          label: "Cancel Requests",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaEnvelopeOpenText />, // Icon for "Cancel Requests" (Request)
        },
      ],
    },

    // {
    //   label: "Manage Return Order",
    //   icon: <FaRedoAlt />, // Icon for "Manage Return Order" (Redo/Return)
    //   subLinks: [
    //     {
    //       to: `/admin/${Merchanttoken}/returnOrders`,
    //       label: "Return Items",
    //       textClass: "text-[14px]",
    //       textcolour: "text-gray-300",
    //       icon: <FaReply />, // Icon for "Return Items" (Return/Reply)
    //     },
    //     {
    //       to: `/admin/${Merchanttoken}/returnRequests`,
    //       label: "Return Requests",
    //       textClass: "text-[14px]",
    //       textcolour: "text-gray-300",
    //       icon: <FaFileAlt />, // Icon for "Return Requests" (Document/Request)
    //     }
    //   ],
    // },

    {
      label: "Manage Delivery Exe.",
      icon: <FaThLarge />,
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/DeliveryExecutive`,
          label: "Recruit Executive",
          icon: <FaUserCog />,
        },
        {
          to: `/admin/${Merchanttoken}/DeliveryExecutive/viewAll`,
          label: "View All Executives",
          icon: <FaUsers />,
        },
        // {
        //   to: `/admin/${Merchanttoken}/DeliveryExecutive/assignOrders`,
        //   label: "Executive Od. History",
        //   icon: <FaTasks />,
        // },
        // {
        //   to: `/admin/${Merchanttoken}/DeliveryExecutive/performanceReports`,
        //   label: "Performance Reports",
        //   icon: <FaChartBar />,
        // },
        // {
        //   to: `/admin/${Merchanttoken}/DeliveryExecutive/attendance`,
        //   label: "Available Executives",
        //   icon: <FaRegCalendarCheck />,
        // },
        // {
        //   to: `/admin/${Merchanttoken}/DeliveryExecutive/salaryPayments`,
        //   label: "Salary & Payments",
        //   icon: <FaMoneyCheckAlt />,
        // },
        // {
        //   to: `/admin/${Merchanttoken}/DeliveryExecutive/feedback`,
        //   label: "Executive Feedback",
        //   icon: <FaCommentDots />,
        // },
      ],
    },

    {
      to: `/admin/${Merchanttoken}/manageBrand`,
      label: "Brand",
      icon: <FaUserCog />,
    },

    {
      to: `/admin/${Merchanttoken}/gst`,
      label: "Manage gst",
      icon: <FaUserCog />,
    },

    {
      label: "Manage Group",
      icon: <FaThLarge />,
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/mainGroup`,
          label: "Main Group",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
      ],
    },
    ,
    {
      label: "Manage Category",
      icon: <FaThLarge />,
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/maincategory`,
          label: "Main Category",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
        {
          to: `/admin/${Merchanttoken}/subcategory`,
          label: "Sub Category",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
        {
          to: `/admin/${Merchanttoken}/subsubcategory`,
          label: "Sub-Sub Category",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
      ],
    },

    {
      label: "Manage Items",
      icon: <FaThLarge />,
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/AddItems`,
          label: "Items",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
      ],
    },

    {
      label: "Manage Varients",
      icon: <FaThLarge />,
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/looseVarient`,
          label: "Loose",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
        {
          to: `/admin/${Merchanttoken}/packetVarient`,
          label: "Packet",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
      ],
    },

    {
      label: "Manage Purchase",
      icon: <FaThLarge />, // General Purchase Management Icon
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/managePurchase`,
          label: "Purchase",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaShoppingCart />, // Represents purchasing
        },
        {
          to: `/admin/${Merchanttoken}/purchaseList`,
          label: "Purchase List",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
          icon: <FaListAlt />, // Represents a list view
        },
        // {
        //   to: `/admin/${Merchanttoken}/purchaseReturn`,
        //   label: "Purchase Return",
        //   textClass: "text-[14px]",
        //   textcolour: "text-gray-300",
        //   icon: <FaUndoAlt />, // Represents returning purchases
        // },
      ],
    },

    {
      label: "Manage Stocks",
      icon: <FaThLarge />,
      subLinks: [
        {
          to: `/admin/${Merchanttoken}/stocks`,
          label: "Total Stock",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
        {
          to: `/admin/${Merchanttoken}/LooseStock`,
          label: "Loose Stock",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
        {
          to: `/admin/${Merchanttoken}/PacketStock`,
          label: "Packet Stock",
          textClass: "text-[11px]",
          textcolour: "text-gray-300",
        },
      ],
    },


    {
      to: `/admin/${Merchanttoken}/deliverymanagement`,
      label: "Delivery Management",
      icon: <FaTags />,
    },

    {
      to: `/admin/${Merchanttoken}/manageSIUnits`,
      label: "Manage SI Units",
      icon: <FaUserCog />,
    },

    {
      to: `/admin/${Merchanttoken}/manageSupplier`,
      label: "Manage Supplier",
      icon: <FaUserCog />,
    },
  ];

  const renderLinks = (links, depth = 0) => {
    return (
      <ul className={`pl-${depth * 4}   `}>
        {links.map((link, index) => (
          <li key={index} className="mt-5">
            {link.subLinks ? (
              <>
                <button
                  onClick={() => toggleAccordion(index)}
                  className="hover:text-gray-400 w-full text-left flex items-center justify-between"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center"
                  >
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                  </motion.div>
                  {openAccordion === index ? (
                    <FaChevronUp className="size-3" />
                  ) : (
                    <FaChevronDown className="size-3" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderLinks(link.subLinks, depth + 1)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to={link.to}
                className={`hover:text-gray-400 flex items-center ${
                  link.textClass || ""
                } ${link.textcolour}`}
                onClick={onLinkClick} // Close sidebar on link click
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  {link.icon} <span className="ml-2">{link.label}</span>
                </motion.div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const handleprofileClick = () => {
    navigate(`/admin/${Merchanttoken}/profile`);
  };

  return (
    <div className="xl:fixed xl:top-0 xl:left-0 xl:w-72 xl:h-screen bg-gray-800 text-white  flex flex-col justify-between overflow-y-scroll scrollbar-hide">
      <div>
        <div
          className="flex  items-center mb-5 border-b p-4 cursor-pointer bg-green-500 "
          onClick={handleprofileClick}
        >
          <img src={logo} alt="logo" className="w-9 h-7 mr-3 ml-3" />
          <span className="text-xl font-bold">{userName}</span>
        </div>
        <nav className="px-3 mb-6">{renderLinks(sidebarLinks)}</nav>
      </div>
      <div className="mt-auto cursor-pointer mb-3">
        <div
          className="hover:text-gray-400 flex items-center bg-red-600 p-2 my-auto rounded-md"
          onClick={handleLogout}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <FaSignOutAlt /> <span className="ml-2">Logout</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
