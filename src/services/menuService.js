// src/services/menuService.js
import { FaHome, FaUsers, FaUserCheck, FaChartBar, FaKey, FaBoxOpen, FaCog } from "react-icons/fa";

// Export the menu items with **icon references**, not JSX
export const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: FaHome,
    roles: ["Super Admin", "Circle Approver", "Charge Approver", "User", "Custodian"],
  },
  {
    title: "CommonPool",
    path: "/users",
    icon: FaUsers,
    roles: ["Super Admin", "Circle Approver", "Charge Approver"], // match DB roles
  }, 
  {
    title: "Reports",
    path: "/reports",
    icon: FaChartBar,
    roles: ["Super Admin", "Circle Approver", "Charge Approver", "User"],
  },
  {
    title: "Custodian Panel",
    path: "/custodian",
    icon: FaKey,
    roles: ["Custodian"],
  },
  {
    title: "My Assets",
    path: "/custodian-assets",
    icon: FaBoxOpen,
    roles: ["Super Admin", "Circle Approver", "Charge Approver"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: FaCog,
    roles:  ["Super Admin", "Circle Approver", "Charge Approver"],
  },
];
