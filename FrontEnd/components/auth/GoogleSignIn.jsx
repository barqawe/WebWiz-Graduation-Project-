"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/authStore.js";
import {
  isGoogleConfigured,
  getGoogleClientId,
  GOOGLE_CONFIG,
  loadGoogleScript,
} from "@/utils/googleAuth";

const GoogleSignIn = ({ onError, onLoading }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleButtonRef = useRef(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  // Load Google Identity Services script
  useEffect(() => {
    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();
        setIsGoogleLoaded(true);
      } catch (error) {
        console.error("Error loading Google script:", error);
        onError?.("Failed to load Google Sign-In");
      }
    };

    initializeGoogle();
  }, [onError]);
  // Initialize Google Sign-In
  useEffect(() => {
    if (!isGoogleLoaded || !window.google) return;

    try {
      const clientId = getGoogleClientId();
      if (!clientId) return;

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        ...GOOGLE_CONFIG.initConfig,
      });

      // Render the sign-in button
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          GOOGLE_CONFIG.buttonConfig
        );
      }
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
      onError?.("Failed to initialize Google Sign-In");
    }
  }, [isGoogleLoaded, onError]);

  const handleGoogleResponse = async (response) => {
    try {
      onLoading?.(true);

      if (!response.credential) {
        throw new Error("No credential received from Google");
      }

      // Send the ID token to your backend
      const res = await fetch("http://localhost:5046/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "google",
          idToken: response.credential,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Google authentication failed");
      }

      const { accessToken, refreshToken } = await res.json();

      // Store tokens in your auth store
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      // Redirect to the intended page
      const redirectPath = searchParams.get("redirect") || "/";
      router.replace(redirectPath);
    } catch (error) {
      console.error("Google authentication error:", error);
      onError?.(error.message || "Google authentication failed");
    } finally {
      onLoading?.(false);
    }
  };
  if (!isGoogleConfigured()) {
    return (
      <div
        style={{
          padding: "0.75rem",
          backgroundColor: "var(--forgot-password-error-bg)",
          border: "1px solid var(--forgot-password-error-border)",
          borderRadius: "8px",
          color: "var(--forgot-password-error-text)",
          fontSize: "0.875rem",
          textAlign: "center",
        }}
      >
        Google Client ID not configured. Please check your .env.local file.
      </div>
    );
  }
  const handleCustomGoogleClick = () => {
    if (isGoogleLoaded && window.google && googleButtonRef.current) {
      // Find the Google button and click it
      const googleButton =
        googleButtonRef.current.querySelector('div[role="button"]');
      if (googleButton) {
        googleButton.click();
      }
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "1.5rem 0",
          gap: "1rem",
        }}
      >
        <hr
          style={{
            flex: 1,
            border: "none",
            borderTop: "1px solid var(--forgot-password-input-border)",
            margin: 0,
          }}
        />
        <span
          style={{
            color: "var(--forgot-password-description-text)",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          OR
        </span>
        <hr
          style={{
            flex: 1,
            border: "none",
            borderTop: "1px solid var(--forgot-password-input-border)",
            margin: 0,
          }}
        />
      </div>

      {/* Custom Google Sign-In Button */}
      <button
        type="button"
        onClick={handleCustomGoogleClick}
        disabled={!isGoogleLoaded}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          borderRadius: "8px",
          backgroundColor: "var(--forgot-password-input-bg)",
          border: "1px solid var(--forgot-password-input-border)",
          color: "var(--forgot-password-input-text)",
          fontSize: "1rem",
          fontWeight: "500",
          cursor: isGoogleLoaded ? "pointer" : "not-allowed",
          transition: "all 0.2s ease",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          opacity: isGoogleLoaded ? 1 : 0.6,
        }}
        onFocus={(e) => {
          if (isGoogleLoaded) {
            e.target.style.borderColor =
              "var(--forgot-password-input-focus-border)";
            e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--forgot-password-input-border)";
          e.target.style.boxShadow = "none";
        }}
        onMouseEnter={(e) => {
          if (isGoogleLoaded) {
            e.target.style.backgroundColor =
              "var(--forgot-password-button-bg-from)";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (isGoogleLoaded) {
            e.target.style.backgroundColor = "var(--forgot-password-input-bg)";
            e.target.style.color = "var(--forgot-password-input-text)";
            e.target.style.transform = "translateY(0)";
          }
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          style={{ flexShrink: 0 }}
        >
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isGoogleLoaded ? "Continue with Google" : "Loading Google..."}
      </button>

      {/* Hidden Google Sign-In Button Container */}
      <div
        ref={googleButtonRef}
        style={{
          position: "absolute",
          left: "-9999px",
          visibility: "hidden",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

export default GoogleSignIn;
