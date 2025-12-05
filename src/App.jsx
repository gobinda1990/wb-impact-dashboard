import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Home from "./pages/Home.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import CustodianPage from "./pages/CustodianPage.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import MyProfilePage from "./pages/MyProfilePage.jsx";
import Signup from "./components/Signup.jsx";
import "./index.css";
import './theme.scss';

function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Signup />} />
        {/* ---------- Protected Routes ---------- */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute roles={["Admin", "Admin_Circle", "Admin_Charge"]}>
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute roles={["Admin", "Admin_Circle", "Admin_Charge", "User"]}>
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/custodian"
          element={
            <PrivateRoute roles={["Custodian"]}>
              <DashboardLayout>
                <CustodianPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <MyProfilePage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <DashboardLayout>
              <Unauthorized />
            </DashboardLayout>
          }
        />

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
