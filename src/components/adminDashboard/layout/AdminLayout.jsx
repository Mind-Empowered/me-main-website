import Sidebar from "../Sidebar";
import Header from "../../profile/Header";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Header bgcolour="bg-gradient-to-r from-[#C1622A] to-[#E49E5F]" tcolour="text-white"/>
                {children}
            </div>
            {/* <Outlet /> */}
        </div>
    );
};

export default AdminLayout;