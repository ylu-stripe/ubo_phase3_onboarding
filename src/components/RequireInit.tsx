import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export const RequireInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isInitialized = useAppStore(state => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      navigate("/", { replace: true });
    }
  }, [isInitialized, navigate]);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default RequireInit;

