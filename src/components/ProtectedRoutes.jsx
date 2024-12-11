import { Navigate, Outlet } from "react-router-dom";

// const getUserRole = () => {
//   const token = localStorage.getItem("userToken");
//   if (!token) return null;
// };

const ProtectedRoutes = ({ allowedRoles }) => {
  const isAuthenticated = localStorage.getItem("userToken") ? true : false;
  const userRole = localStorage.getItem("roleId");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/forbidden" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
