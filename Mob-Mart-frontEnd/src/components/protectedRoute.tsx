import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly,
  admin,
  redirect = "/",
}: Props) => {
  if (!isAuthenticated) {
    console.table([" User not authenticated", isAuthenticated]);
    return <Navigate to={redirect} />;
  }
  if (adminOnly && !admin) {
    console.table(["Admin-only route", admin, adminOnly]);
    return <Navigate to={redirect} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
