import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(
    window.innerWidth > 992 ? 240 : 0
  );

  useEffect(() => {
    const handleResize = () => setSidebarWidth(window.innerWidth > 992 ? 240 : 0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-layout d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        className="main-content flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Header />
        <main
          className="p-3 p-md-4"
          style={{
            flexGrow: 1,
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
