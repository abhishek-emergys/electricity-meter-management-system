import { Navigate, Outlet } from "react-router-dom";
// import jwt_decode from "jwt-decode";

const isAuthenticated = () => {
  const token = localStorage.getItem("userToken");
  
  return !!token;
};

const PublicRoute = ({ restricted }) => {
  if (isAuthenticated() && restricted) {
    // TODO: ROLE BASED ADMIN || USER
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PublicRoute;
