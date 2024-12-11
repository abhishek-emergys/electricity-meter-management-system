import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/protected/Dashboard.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import UserInfo from "./pages/protected/UserInfo.jsx";
import MeterReading from "./pages/protected/MeterReading.jsx";
import ForbiddenPage from "./components/ForbiddenPage.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          element={<ProtectedRoutes allowedRoles={["admin", "superadmin"]} />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users-info" element={<UserInfo />} />
          <Route path="/meter-reading" element={<MeterReading />} />
        </Route>

        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
