import Sidebar from "../Sidebar";
import Header from "../../profile/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1">
                <Header bgcolour="bg-gradient-to-r from-[#C1622A] to-[#E49E5F]" tcolour="text-white"/>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;