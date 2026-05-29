import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F5F0E8] flex-col md:flex-row">
            {/* Mobile Top Bar */}
            <div className="flex md:hidden items-center justify-between px-6 py-4 bg-[#2C1A0E] text-white z-20 shadow-md">
                <div className="flex items-center gap-3">
                    <img src="/brand/logo.jpeg" alt="logo" className="w-8 h-8 rounded-full" />
                    <p className="text-[#E8954A] font-bold text-sm">Admin Panel</p>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-1 hover:text-[#E8954A] transition"
                >
                    <FaBars size={20} />
                </button>
            </div>

            {/* Sidebar container */}
            <div className={`
                fixed inset-y-0 right-0 z-50 md:left-0 md:right-auto md:relative md:z-auto 
                transition-transform duration-300 transform md:transform-none
                ${isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            `}>
                <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in-fast"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;