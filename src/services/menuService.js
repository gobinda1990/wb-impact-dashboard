// // src/services/menuService.js
import { FaHome, FaUsers, FaUserCheck, FaChartBar, FaKey, FaBoxOpen, FaCog, FaPlus } from "react-icons/fa";

// Export the menu items with **icon references**, not JSX
export const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: FaHome,
    roles: ["Super Admin", "Admin",  "User"],
  },
  {
    title: "Common Pool",
    path: "/users",
    icon: FaUsers,
    roles: ["Super Admin", "Admin"],
  },  
  {
    title: "Reports",
    path: "/reports",
    icon: FaChartBar,
    roles: ["Super Admin", "Admin", "User"],
  },
  {
      title: "Add New Modules",
      path: "/addmodule",
      icon: FaPlus,
      roles: ["Super Admin"],
    },
  {
    title: "Custodian Panel",
    path: "/custodian",
    icon: FaKey,
    roles: ["Custodian"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: FaCog,
    roles: ["Super Admin"],
  },
  {
    title: "Change Password",
    path: "/resetPassword",
    icon: FaKey,    
    roles: ["Super Admin"],
  },
];
