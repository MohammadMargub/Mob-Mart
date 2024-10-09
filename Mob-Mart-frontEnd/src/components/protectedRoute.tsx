import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  adminOnly?: boolean;
  admin?: boolean;
  isAuthenticated: boolean;
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
    return <Navigate to={redirect} />;
  }

  if (adminOnly && !admin) {
    return <Navigate to={redirect} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
