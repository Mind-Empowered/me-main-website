import Sidebar from "../Sidebar";
import Header from "../../profile/Header";

const AdminLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <Sidebar />
            <p> hiii</p>
            {/* <Outlet /> */}
        </div>
    );
};

export default AdminLayout;