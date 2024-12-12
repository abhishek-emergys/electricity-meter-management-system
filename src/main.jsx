import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/protected/admin/Dashboard.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import UserInfo from "./pages/protected/admin/UserInfo.jsx";
import MeterReading from "./pages/protected/admin/MeterReading.jsx";
import ForbiddenPage from "./pages/error/ForbiddenPage.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import NotFoundPage from "./pages/error/NotFoundPage.jsx";
import UserDashboard from "./pages/protected/user/UserDashboard.jsx";
import UserReadings from "./pages/protected/user/UserReadings.jsx";
import AddReadings from "./pages/protected/admin/AddReadings.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route
        element={<ProtectedRoutes allowedRoles={["admin", "superadmin"]} />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users-info" element={<UserInfo />} />
        <Route path="/add-reading" element={<AddReadings />} />
        <Route path="/meter-reading" element={<MeterReading />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/reading-info" element={<UserReadings />} />
      </Route>

      <Route element={<PublicRoute restricted={true} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>
);
