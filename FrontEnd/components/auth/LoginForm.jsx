"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/authStore.js";
import GoogleSignIn from "./GoogleSignIn";
import GitHubSignIn from "./GitHubSignIn";

// Create a component that wraps the useSearchParams hook
const SearchParamsProvider = ({ children }) => {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  return children({ redirectPath });
};

const LoginForm = () => {
  const router = useRouter();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const handleLogin = async (e, redirectPath) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5046/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        try {
          const data = await res.json();
          throw new Error(data.message || "Wrong email or password");
        } catch (jsonError) {
          // If JSON parsing fails, it's likely an invalid response
          throw new Error("Wrong email or password");
        }
      }

      const { accessToken, refreshToken } = await res.json();

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      router.replace(redirectPath);
    } catch (err) {
      // Check if it's a JSON parsing error
      if (
        err.message.includes("Unexpected token") ||
        err.message.includes("not valid JSON")
      ) {
        setError("Wrong email or password");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const renderForm = ({ redirectPath }) => (
    <form
      onSubmit={(e) => handleLogin(e, redirectPath)}
      style={{ width: "100%" }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="email"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "var(--forgot-password-input-text)",
          }}
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            borderRadius: "8px",
            backgroundColor: "var(--forgot-password-input-bg)",
            border: `1px solid var(--forgot-password-input-border)`,
            color: "var(--forgot-password-input-text)",
            fontSize: "1rem",
            transition: "all 0.2s ease",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor =
              "var(--forgot-password-input-focus-border)";
            e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--forgot-password-input-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="password"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "var(--forgot-password-input-text)",
          }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            borderRadius: "8px",
            backgroundColor: "var(--forgot-password-input-bg)",
            border: `1px solid var(--forgot-password-input-border)`,
            color: "var(--forgot-password-input-text)",
            fontSize: "1rem",
            transition: "all 0.2s ease",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor =
              "var(--forgot-password-input-focus-border)";
            e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--forgot-password-input-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading || googleLoading || githubLoading}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          borderRadius: "8px",
          background:
            loading || googleLoading || githubLoading
              ? `linear-gradient(135deg, var(--forgot-password-button-disabled-from) 0%, var(--forgot-password-button-disabled-to) 100%)`
              : `linear-gradient(135deg, var(--forgot-password-button-bg-from) 0%, var(--forgot-password-button-bg-to) 100%)`,
          border: "none",
          color: "white",
          fontWeight: "600",
          fontSize: "1rem",
          cursor:
            loading || googleLoading || githubLoading
              ? "not-allowed"
              : "pointer",
          transition: "all 0.2s ease",
          opacity: loading || googleLoading || githubLoading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!loading && !googleLoading && !githubLoading) {
            e.target.style.background = `linear-gradient(135deg, var(--forgot-password-button-hover-from) 0%, var(--forgot-password-button-hover-to) 100%)`;
            e.target.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && !googleLoading && !githubLoading) {
            e.target.style.background = `linear-gradient(135deg, var(--forgot-password-button-bg-from) 0%, var(--forgot-password-button-bg-to) 100%)`;
            e.target.style.transform = "translateY(0)";
          }
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>{" "}
      <button
        type="button"
        onClick={() => router.push("/forgot-password")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.875rem",
          color: "var(--forgot-password-link-text)",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "0.5rem",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.target.style.color = "var(--forgot-password-link-hover)";
          e.target.style.textDecoration = "underline";
        }}
        onMouseLeave={(e) => {
          e.target.style.color = "var(--forgot-password-link-text)";
          e.target.style.textDecoration = "none";
        }}
      >
        Forgot your password?
      </button>
      {error && (
        <div
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            marginTop: "1rem",
            borderRadius: "8px",
            backgroundColor: "var(--forgot-password-error-bg)",
            border: `1px solid var(--forgot-password-error-border)`,
            color: "var(--forgot-password-error-text)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.875rem",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--forgot-password-error-text)",
              cursor: "pointer",
              fontSize: "1.25rem",
              padding: "0",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}
      {/* Google Sign-In */}
      <GoogleSignIn onError={setError} onLoading={setGoogleLoading} />
      {/* GitHub Sign-In */}
      <GitHubSignIn onError={setError} onLoading={setGithubLoading} />
    </form>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsProvider>{renderForm}</SearchParamsProvider>
    </Suspense>
  );
};

export default LoginForm;
