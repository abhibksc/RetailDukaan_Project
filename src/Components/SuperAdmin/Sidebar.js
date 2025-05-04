import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import { FaUserGear } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useDispatch } from 'react-redux';
import { updateToken } from '../ReduxStore/Slices/auth';

const Sidebar = ({ onLinkClick }) => {
    const userName = "Super Administrator";
    const superadmintoken = localStorage.getItem("superadmintoken");
    const [openAccordion, setOpenAccordion] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(updateToken("superadmintoken"));
        localStorage.removeItem("superadmintoken");
        navigate("/admin/login");
    };

    const toggleAccordion = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    const sidebarLinks = [


        {
            label: 'Home Management',
            to: `/superadmin/${superadmintoken}/homemanagement`,
            icon: <AdminPanelSettingsIcon />,
        },


        {
            label: 'Role Management',
            to: `/superadmin/${superadmintoken}/adminmanagement`,
            icon: <AdminPanelSettingsIcon />,
        },

    ];

    const renderLinks = (links, depth = 0) => (
        <ul className={`pl-${depth * 4} mt-5`}>
            {links.map((link, index) => (
                <li key={index} className="mb-4">
                    {link.subLinks ? (
                        <>
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="hover:text-gray-400 w-full text-left flex items-center justify-between"
                                aria-expanded={openAccordion === index}
                            >
                                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                                    {link.icon}
                                    <span className="ml-2">{link.label}</span>
                                </motion.div>
                                {openAccordion === index ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            <AnimatePresence>
                                {openAccordion === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
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
                            className="hover:text-gray-400 flex items-center"
                            onClick={onLinkClick}
                        >
                            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                                {link.icon} <span className="ml-2">{link.label}</span>
                            </motion.div>
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="xl:fixed xl:top-0 xl:left-0 xl:w-72 xl:h-screen bg-gray-800 text-white p-4 flex flex-col justify-between">
            
            {/* Header */}
            <div>
                <div className="flex items-center mb-10 border-b pb-2">
                    <FaUserGear className="mr-2 text-xl" />
                    <span className="text-xl font-bold">{userName}</span>
                </div>
                {/* Navigation Links */}
                <nav>{renderLinks(sidebarLinks)}</nav>
            </div>

            {/* Logout Section */}
            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="hover:text-gray-400 flex items-center bg-red-600 p-2 rounded-md w-full"
                >
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                        <FaSignOutAlt /> <span className="ml-2">Logout</span>
                    </motion.div>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
