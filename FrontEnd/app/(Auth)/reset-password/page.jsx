"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";
import useEmailStore from "@/store/emailStore.js";
import ResetPasswordGuard from "@/guard/ResetPasswordGuard";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { 
    getEmail, 
    clearResetSession, 
    CodeResult, 
    isTokenValid 
  } = useEmailStore();
    const userEmail = getEmail();const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Check if token is still valid
    if (!isTokenValid()) {
      setError("Session expired. Please restart the password reset process.");
      setTimeout(() => {
        clearResetSession();
        router.push("/forgot-password");
      }, 2000);
      return;
    }
    
    // Check if user has valid email
    if (!userEmail) {
      setError("No email found. Please restart the password reset process.");
      router.push("/forgot-password");
      return;
    }

    console.log("User Email:", userEmail);
    console.log("Password:", password);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5046/api/auth/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Email: userEmail, NewPassword: password }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to reset password");
      }

      // Clear the reset session
      clearResetSession();

      setSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen p-8 relative"
      style={{
        background: `linear-gradient(to bottom right, var(--forgot-password-bg-from), var(--forgot-password-bg-via), var(--forgot-password-bg-to))`,
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom right, var(--forgot-password-overlay-from), transparent, var(--forgot-password-overlay-to))`,
        }}
      />
      {/* Back link */}
      <Link
        href="/reset-password-code"
        className="absolute top-8 left-8 flex items-center gap-2 px-5 py-3 rounded-lg font-medium border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--forgot-password-back-link-bg)",
          borderColor: "var(--forgot-password-back-link-border)",
          color: "var(--forgot-password-back-link-text)",
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor =
            "var(--forgot-password-back-link-hover-bg)")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor =
            "var(--forgot-password-back-link-bg)")
        }
      >
        <FaArrowLeft className="text-base" />
        Back
      </Link>
      {/* Theme toggle */}
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>{" "}
      {/* Main content */}
      <motion.div
        className="w-full max-w-md backdrop-blur-sm rounded-2xl shadow-xl border p-8"
        style={{
          backgroundColor: "var(--forgot-password-card-bg)",
          borderColor: "var(--forgot-password-card-border)",
        }}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-white text-2xl" />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--forgot-password-header-text)" }}
          >
            Reset Your Password
          </h1>
          <p style={{ color: "var(--forgot-password-description-text)" }}>
            Enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium"
              style={{ color: "var(--forgot-password-label-text)" }}
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                disabled={loading}
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed forgot-password-input"
                style={{
                  backgroundColor: "var(--forgot-password-input-bg)",
                  color: "var(--forgot-password-input-text)",
                  borderColor: "var(--forgot-password-input-border)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor =
                    "var(--forgot-password-input-focus-border)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    "var(--forgot-password-input-border)")
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--reset-password-toggle-icon)" }}
                onMouseEnter={(e) =>
                  (e.target.style.color =
                    "var(--reset-password-toggle-icon-hover)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--reset-password-toggle-icon)")
                }
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>{" "}
          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
              style={{ color: "var(--forgot-password-label-text)" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
                disabled={loading}
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed forgot-password-input"
                style={{
                  backgroundColor: "var(--forgot-password-input-bg)",
                  color: "var(--forgot-password-input-text)",
                  borderColor: "var(--forgot-password-input-border)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor =
                    "var(--forgot-password-input-focus-border)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    "var(--forgot-password-input-border)")
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--reset-password-toggle-icon)" }}
                onMouseEnter={(e) =>
                  (e.target.style.color =
                    "var(--reset-password-toggle-icon-hover)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--reset-password-toggle-icon)")
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>{" "}
          {/* Error Message */}
          {error && (
            <motion.div
              className="border px-4 py-3 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--forgot-password-error-bg)",
                borderColor: "var(--forgot-password-error-border)",
                color: "var(--forgot-password-error-text)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          {/* Success Message */}
          {success && (
            <motion.div
              className="border px-4 py-3 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--forgot-password-success-bg)",
                borderColor: "var(--forgot-password-success-border)",
                color: "var(--forgot-password-success-text)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✓ Password reset successfully! Redirecting to login...
            </motion.div>
          )}
          {/* Submit Button */}{" "}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-white"
            style={{
              background: success
                ? "var(--forgot-password-button-success-bg)"
                : loading
                ? `linear-gradient(to right, var(--forgot-password-button-disabled-from), var(--forgot-password-button-disabled-to))`
                : `linear-gradient(to right, var(--forgot-password-button-bg-from), var(--forgot-password-button-bg-to))`,
            }}
            onMouseEnter={(e) => {
              if (!loading && !success) {
                e.target.style.background = `linear-gradient(to right, var(--forgot-password-button-hover-from), var(--forgot-password-button-hover-to))`;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !success) {
                e.target.style.background = `linear-gradient(to right, var(--forgot-password-button-bg-from), var(--forgot-password-button-bg-to))`;
              }
            }}
          >
            {loading
              ? "Resetting..."
              : success
              ? "Password Reset!"
              : "Reset Password"}
          </button>
        </form>
      </motion.div>    </div>
  );
}

export default function ResetPasswordPageWithGuard() {
  return (
    <ResetPasswordGuard requiredStep="reset-password">
      <ResetPasswordPage />
    </ResetPasswordGuard>
  );
}
