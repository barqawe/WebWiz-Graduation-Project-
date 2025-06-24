//change this protected route wrapper

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { backUrl } from "../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Alert } from "@mui/material";
import useAuthStore from "../context/TokenContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Get auth state from Zustand store
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(backUrl + "validate-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            logout();
            navigate("/login", { state: { from: window.location.pathname } });
          } else {
            throw new Error("Failed to validate token");
          }
        } else {
          const data = await response.json();
          setData(data);
        }
      } catch (err) {
        logout();
        setError("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login", { state: { from: window.location.pathname } });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      validateToken();
    } else {
      setLoading(false);
      
    }
  }, [user, token, logout, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100dvh",
        }}
      >
        <CircularProgress style={{ color: "#3a73c2" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="error fixed bottom-4 right-4 w-80">
        <Alert
          severity="error"
          onClose={() => setError(null)}
          style={{ backgroundColor: "#10060D", color: "white" }}
        >
          {error}
        </Alert>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
