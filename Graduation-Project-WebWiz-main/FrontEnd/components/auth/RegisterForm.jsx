"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/authStore.js";

// Create a component that wraps the useSearchParams hook
const SearchParamsProvider = ({ children }) => {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  return children({ redirectPath });
};

const RegisterForm = () => {
  const router = useRouter();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e, redirectPath) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }    setLoading(true);

    try {
      const res = await fetch("http://localhost:5046/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (!res.ok) {
        try {
          const data = await res.json();
          throw new Error(data.message || "Registration failed");
        } catch (jsonError) {
          // If JSON parsing fails, it's likely an invalid response
          throw new Error("Email already in use by another WibWez account");
        }
      }

      const { accessToken, refreshToken } = await res.json();

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      router.replace(redirectPath);
    } catch (err) {
      // Check if it's a JSON parsing error
      if (err.message.includes("Unexpected token") || err.message.includes("not valid JSON")) {
        setError("Email already in use by another WibWez account");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };  const renderForm = ({ redirectPath }) => (
    <form
      onSubmit={(e) => handleRegister(e, redirectPath)}
      style={{ width: "100%" }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="username"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "var(--forgot-password-input-text)",
          }}
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="confirmPassword"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "var(--forgot-password-input-text)",
          }}
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          borderRadius: "8px",
          background: loading
            ? `linear-gradient(135deg, var(--forgot-password-button-disabled-from) 0%, var(--forgot-password-button-disabled-to) 100%)`
            : `linear-gradient(135deg, var(--forgot-password-button-bg-from) 0%, var(--forgot-password-button-bg-to) 100%)`,
          border: "none",
          color: "white",
          fontWeight: "600",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.background = `linear-gradient(135deg, var(--forgot-password-button-hover-from) 0%, var(--forgot-password-button-hover-to) 100%)`;
            e.target.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.background = `linear-gradient(135deg, var(--forgot-password-button-bg-from) 0%, var(--forgot-password-button-bg-to) 100%)`;
            e.target.style.transform = "translateY(0)";
          }
        }}
      >
        {loading ? "Registering..." : "Register"}{" "}
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
    </form>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsProvider>{renderForm}</SearchParamsProvider>
    </Suspense>
  );
};

export default RegisterForm;
