"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";
import useEmailstore from "@/store/emailStore.js";

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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);  const [success, setSuccess] = useState(false);
  const setEmailStore = useEmailstore((state) => state.setEmail);
  const clearEmail = useEmailstore((state) => state.clearEmail);
  
  // Clear any existing email data when component mounts
  useEffect(() => {
    clearEmail();
  }, [clearEmail]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5046/api/auth/send-reset-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: email }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send reset code");
      }

      setEmailStore(email);


      setSuccess(true);

      // Redirect to verification code page after a brief delay
      setTimeout(() => {
        router.push("/reset-password-code");
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
        href="/Login"
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
        Back to Login
      </Link>
      {/* Theme toggle */}
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
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
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--forgot-password-header-text)" }}
          >
            Forgot Password?
          </h1>
          <p style={{ color: "var(--forgot-password-description-text)" }}>
            Enter your email address and we'll send you a code to reset your
            password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--forgot-password-label-text)" }}
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 pl-12 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed forgot-password-input"
                style={{
                  backgroundColor: "var(--forgot-password-input-bg)",
                  color: "var(--forgot-password-input-text)",
                  borderColor: error
                    ? "var(--forgot-password-input-error-border)"
                    : "var(--forgot-password-input-border)",
                  animation: error
                    ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                    : "none",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor =
                    "var(--forgot-password-input-focus-border)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = error
                    ? "var(--forgot-password-input-error-border)"
                    : "var(--forgot-password-input-border)")
                }
              />
              <FaEnvelope
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                style={{ color: "var(--forgot-password-input-icon)" }}
              />
            </div>
          </div>
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
              ✓ Reset code sent! Check your email and redirecting...
            </motion.div>
          )}{" "}
          {/* Submit Button */}
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
              } else if (success) {
                e.target.style.background =
                  "var(--forgot-password-button-success-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !success) {
                e.target.style.background = `linear-gradient(to right, var(--forgot-password-button-bg-from), var(--forgot-password-button-bg-to))`;
              } else if (success) {
                e.target.style.background =
                  "var(--forgot-password-button-success-bg)";
              }
            }}
          >
            {loading
              ? "Sending..."
              : success
              ? "Code Sent!"
              : "Send Reset Code"}
          </button>{" "}
          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <p
              className="text-sm mb-2"
              style={{ color: "var(--forgot-password-description-text)" }}
            >
              Remember your password?
            </p>
            <Link
              href="/Login"
              className="font-medium underline hover:no-underline transition-all duration-300"
              style={{ color: "var(--forgot-password-link-text)" }}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--forgot-password-link-hover)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--forgot-password-link-text)")
              }
            >
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
