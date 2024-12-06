import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Utility function to check if the user is authenticated
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token"); // Replace with your token storage method
  return !!token; // Returns true if a token exists, false otherwise
};

// Functional Component for protecting routes
const ProtectedRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;