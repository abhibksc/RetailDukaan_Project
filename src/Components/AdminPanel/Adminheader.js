import React, { useState } from 'react';
import { IoReorderThreeOutline } from 'react-icons/io5';
import Sidebar from './Sidebar';

const AdminHeader = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex">
            <div className="xl:hidden bg-black w-full text-white p-3">
                <button onClick={toggleSidebar}>
                    <IoReorderThreeOutline className="text-2xl" />
                </button>
            </div>
            {sidebarOpen && <Sidebar closeSidebar={toggleSidebar} />}
        </div>
    );
};

export default AdminHeader;
