import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = true;

  return <div>{isAuthenticated ? <Outlet /> : <Navigate to="/login" />}</div>;
};

export default ProtectedRoutes;
  