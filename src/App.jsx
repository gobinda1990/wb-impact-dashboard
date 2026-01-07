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
import "./index.css";
import Signup from './components/Signupuser.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ModuleManager from "./pages/ModuleManager.jsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

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
            <PrivateRoute roles={["Super Admin", "Admin"]}>
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute roles={["Super Admin", "Admin"]}>
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/addmodule"
          element={
            <PrivateRoute roles={["Super Admin"]}>
              <DashboardLayout>
                <ModuleManager />
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
         <Route
          path="/resetPassword"
          element={
            <PrivateRoute roles={["Super Admin"]}>
              <DashboardLayout>
                <ResetPassword />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* ---------- Fallback ---------- */}
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
         <Route path="/forgotPassword" element={<ForgotPassword/>} />
      </Routes>
    </Router>
  );
}

export default App;
