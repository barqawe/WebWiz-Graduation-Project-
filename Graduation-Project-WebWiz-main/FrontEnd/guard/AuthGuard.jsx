//IMPORTANT NOTE BY THE DEVELOPER:
//login is with an uppercase "L"

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import useAuthStore from "@/store/authStore";

const AuthGuard = ({ children, requireCreateTask = false }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    accessToken,
    getUser,
    logout,
    refreshAccessToken,
    getTokenClaims,
    canUserCreateTask,
    _hasHydrated,
  } = useAuthStore();

  useEffect(() => {
    // Don't run validation until store is hydrated
    if (!_hasHydrated) {
      return;
    }

    const validate = async () => {
      if (!accessToken) {
        router.replace(`/Login?redirect=${pathname}`);
        error.log("Redirecting to login due to missing access token");
        return;
      }

      /* const user = getUser();

      if (!user) {
        logout();
        router.replace(`/Login?redirect=${pathname}`);
        return;
      } */

      // Check if token is expired
      const isExpired = (() => {
        try {
          const decoded = JSON.parse(atob(accessToken.split(".")[1]));
          return decoded.exp * 1000 < Date.now();
        } catch {
          return true;
        }
      })();

      if (isExpired) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          setError("Session expired. Redirecting...");
          setTimeout(() => router.replace(`/Login?redirect=${pathname}`), 2000);
          return;
        }
      } // Task creation permission check
      if (requireCreateTask && !canUserCreateTask()) {
        setError("You don't have permission to create tasks.");
        setTimeout(() => router.replace("/"), 2000);
        return;
      }

      // Validate token claims
      const claims = getTokenClaims();
      if (claims && process.env.NODE_ENV === "production") {
        // Validate issuer and audience in production
        const expectedIssuer = process.env.NEXT_PUBLIC_JWT_ISSUER;
        const expectedAudience = process.env.NEXT_PUBLIC_JWT_AUDIENCE;

        if (
          expectedIssuer &&
          claims.iss &&
          !claims.iss.includes(expectedIssuer)
        ) {
          setError("Invalid token issuer. Redirecting...");
          setTimeout(() => {
            logout();
            router.replace(`/Login?redirect=${pathname}`);
          }, 2000);
          return;
        }

        if (
          expectedAudience &&
          claims.aud &&
          !claims.aud.includes(expectedAudience)
        ) {
          setError("Invalid token audience. Redirecting...");
          setTimeout(() => {
            logout();
            router.replace(`/Login?redirect=${pathname}`);
          }, 2000);
          return;
        }
      }

      setLoading(false);
    };
    validate();
  }, [
    _hasHydrated,
    accessToken,
    pathname,
    refreshAccessToken,
    getUser,
    logout,
    router,
    requireCreateTask,
    canUserCreateTask,
    getTokenClaims,
  ]);

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

  return <>{children}</>;
};

export default AuthGuard;
