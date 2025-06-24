"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/authStore.js";
import {
  isGithubConfigured,
  generateGithubAuthUrl,
  generateState,
} from "@/utils/githubAuth";

const GitHubSignIn = ({ onError, onLoading }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      onLoading?.(true);

      // Generate state for security
      const state = generateState();

      // Store state and redirect path in sessionStorage for later verification
      const redirectPath = searchParams.get("redirect") || "/";
      sessionStorage.setItem("github_oauth_state", state);
      sessionStorage.setItem("github_redirect_path", redirectPath);

      // Generate GitHub OAuth URL
      const authUrl = generateGithubAuthUrl(state);

      // Redirect to GitHub
      window.location.href = authUrl;
    } catch (error) {
      console.error("GitHub authentication error:", error);
      onError?.(error.message || "Failed to initiate GitHub authentication");
      setIsLoading(false);
      onLoading?.(false);
    }
  };

  if (!isGithubConfigured()) {
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
        GitHub Client ID not configured. Please check your .env.local file.
      </div>
    );
  }
  return (
    <div style={{ width: "100%" }}>
      {/* GitHub Sign-In Button */}
      <button
        onClick={handleGitHubSignIn}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          marginTop: "1rem",
          borderRadius: "8px",
          backgroundColor: isLoading ? "#6c757d" : "#24292e",
          border: `1px solid ${isLoading ? "#6c757d" : "#24292e"}`,
          color: "#ffffff",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          opacity: isLoading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.target.style.backgroundColor = "#2c3338";
            e.target.style.borderColor = "#2c3338";
            e.target.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.target.style.backgroundColor = "#24292e";
            e.target.style.borderColor = "#24292e";
            e.target.style.transform = "translateY(0)";
          }
        }}
      >
        {/* GitHub Icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ flexShrink: 0 }}
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        {isLoading ? "Redirecting..." : "Continue with GitHub"}
      </button>
    </div>
  );
};

export default GitHubSignIn;
