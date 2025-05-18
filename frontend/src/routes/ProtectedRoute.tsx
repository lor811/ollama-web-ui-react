import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@providers/AuthProvider";
import { useEffect } from "react";
import LoadingFallback from "@components/suspense/LoadingFallback";

const ProtectedRoute = () => {
  const { isCheckingToken } = useAuth();

  const navigate = useNavigate();

  const hasToken = !!localStorage.getItem("access_token");

  useEffect(() => {
    if (!hasToken) {
      navigate("/login");
    }
  });

  if (isCheckingToken) {
    return <LoadingFallback />;
  }

  if (!hasToken) {
    return <div>Unauthorized</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
