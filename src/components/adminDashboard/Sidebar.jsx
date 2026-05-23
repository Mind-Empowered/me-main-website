import {  FaThLarge , FaImages, FaCalendarAlt, FaEnvelope, FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const menu = [
        {
            title: "Overview",
            items: [
                {
                    label: "Dashboard",
                    icon: <FaThLarge />,
                    path: "../../pages/admin/Dashboard.jsx",
                },
            ],
        },
        {
            title: "Content",
            items: [
                {
                    label: "Photo Gallery",
                    icon: <FaImages />,
                    path: "../../pages/admin/PhotoGallery.jsx",
                },
                {
                    label: "Events",
                    icon: <FaCalendarAlt />,
                    path: "../../pages/admin/AdminEvents.jsx",
                },
                {
                    label: "News Letter",
                    icon: <FaEnvelope />,
                    path: "../../pages/admin/NewsLetter.jsx",
                },
            ],
        },
        {
            title: "Community",
            items: [
                {
                    label: "Volunteers",
                    icon: <FaUsers />,
                    path: "../../pages/admin/Volunteers.jsx",
                },
            ],
        },
    ];

    return (
        <aside className="w-64 h-screen bg-[#2C1A0E] p-6 flex flex-col gap-8 text-white">
            {/* logo and name */}
            <div className="flex items-center gap-4">
                <div>
                    <img src="/brand/logo.jpeg" alt="logo" className="w-14 rounded-full" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Mind Empowered</h2>
                    <p className="text-[#E8954A]">Admin Panel</p>
                </div>
            </div>
            {/* menu items */}
            <hr></hr>
            <div>
                {menu.map((section, index) => (
                    <div key={index} className="flex flex-col gap-4">
                        <h3 className="text-sm">{section.title}</h3>
                        <ul>
                            {section.items.map((item, itemIndex) => (
                                <NavLink key={itemIndex} to={item.path} className="flex items-center gap-4 p-2 hover:bg-[#C1622A]  rounded-lg">
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;