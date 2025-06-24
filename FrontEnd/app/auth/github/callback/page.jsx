"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/authStore.js";
import { validateState } from "@/utils/githubAuth";

const GitHubCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        // Check for OAuth errors
        if (error) {
          throw new Error(`GitHub OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received from GitHub");
        }

        // Validate state parameter
        const expectedState = sessionStorage.getItem("github_oauth_state");
        if (!expectedState || !validateState(state, expectedState)) {
          throw new Error("Invalid state parameter - possible CSRF attack");
        }

        // Get redirect path
        const redirectPath =
          sessionStorage.getItem("github_redirect_path") || "/";

        // Clean up session storage
        sessionStorage.removeItem("github_oauth_state");
        sessionStorage.removeItem("github_redirect_path");

        // Send code to backend
        const response = await fetch("http://localhost:5046/api/auth/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: "github",
            idToken: code, // Backend expects this field name
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "GitHub authentication failed");
        }

        const { accessToken, refreshToken } = await response.json();

        // Store tokens
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        setStatus("success");

        // Redirect after a brief delay
        setTimeout(() => {
          router.replace(redirectPath);
        }, 1000);
      } catch (err) {
        console.error("GitHub callback error:", err);
        setError(err.message);
        setStatus("error");
      }
    };

    handleCallback();
  }, [searchParams, router, setAccessToken, setRefreshToken]);

  const handleRetry = () => {
    // Clean up session storage
    sessionStorage.removeItem("github_oauth_state");
    sessionStorage.removeItem("github_redirect_path");

    // Redirect to login page
    router.replace("/Login");
  };

  if (status === "processing") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "3rem",
            height: "3rem",
            border: "4px solid var(--forgot-password-input-border)",
            borderTop: "4px solid var(--forgot-password-button-bg-from)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <h2
          style={{
            marginTop: "1rem",
            color: "var(--forgot-password-heading-text)",
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          Completing GitHub Sign-In...
        </h2>
        <p
          style={{
            color: "var(--forgot-password-description-text)",
            marginTop: "0.5rem",
          }}
        >
          Please wait while we verify your account.
        </p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "4rem",
            height: "4rem",
            backgroundColor: "#22c55e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <h2
          style={{
            color: "var(--forgot-password-heading-text)",
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          Sign-In Successful!
        </h2>
        <p
          style={{
            color: "var(--forgot-password-description-text)",
          }}
        >
          Redirecting you to your dashboard...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "4rem",
            height: "4rem",
            backgroundColor: "#ef4444",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </div>
        <h2
          style={{
            color: "var(--forgot-password-heading-text)",
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          GitHub Sign-In Failed
        </h2>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--forgot-password-error-bg)",
            border: "1px solid var(--forgot-password-error-border)",
            borderRadius: "8px",
            color: "var(--forgot-password-error-text)",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
        <button
          onClick={handleRetry}
          style={{
            padding: "0.875rem 1.5rem",
            borderRadius: "8px",
            background:
              "linear-gradient(135deg, var(--forgot-password-button-bg-from) 0%, var(--forgot-password-button-bg-to) 100%)",
            border: "none",
            color: "white",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, var(--forgot-password-button-hover-from) 0%, var(--forgot-password-button-hover-to) 100%)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, var(--forgot-password-button-bg-from) 0%, var(--forgot-password-button-bg-to) 100%)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default GitHubCallback;
