// // src/services/menuService.js
import { FaHome, FaUsers, FaUserCheck, FaChartBar, FaKey, FaBoxOpen, FaCog } from "react-icons/fa";

// Export the menu items with **icon references**, not JSX
export const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: FaHome,
    roles: ["Super Admin", "Circle Approver", "Charge Approver", "User", "Office Approver"],
  },
  {
    title: "Common Pool",
    path: "/users",
    icon: FaUsers,
    roles: ["Super Admin", "Circle Approver", "Charge Approver","Office Approver"],
  },
  // {
  //   title: "Assigned Users",
  //   path: "/assigned-users",
  //   icon: FaUserCheck,
  //   roles: ["Super Admin"],
  // },
  {
    title: "Reports",
    path: "/reports",
    icon: FaChartBar,
    roles: ["Super Admin", "Circle Approver", "Charge Approver", "User", "Office Approver"],
  },
  {
    title: "Custodian Panel",
    path: "/custodian",
    icon: FaKey,
    roles: ["Custodian"],
  },
  // {
  //   title: "My Assets",
  //   path: "/custodian-assets",
  //   icon: FaBoxOpen,
  //   roles: ["Custodian", "Super Admin", "Circle Approver", "Charge Approver","Office Approver"],
  // },
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
    // <FontAwesomeIcon icon={faLock} />
    roles: ["Super Admin"],
  },
];
