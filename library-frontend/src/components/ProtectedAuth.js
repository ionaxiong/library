import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Navigate } from "react-router-dom";

/**
 * @property {React.ReactNode} children
 */

const ProtectedAuth = ({ children }) => {
  const { hasToken } = useContext(AuthContext);
  // const { username } = user;

  if (!hasToken) {
    return <Navigate replace to="/login" />;
  }

  return children;
};

export default ProtectedAuth;
