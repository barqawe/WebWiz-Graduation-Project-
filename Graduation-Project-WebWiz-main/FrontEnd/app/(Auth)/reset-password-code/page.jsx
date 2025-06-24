"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";
import useEmailStore from "@/store/emailStore";
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

export default function ResetPasswordCodePage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [submittedCode, setSubmittedCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;
  const inputRefs = useRef([]);
  const { 
    getEmail, 
    setCodeResult, 
    isTokenValid, 
    extendToken,
    clearResetSession 
  } = useEmailStore();

  const userEmail = getEmail();

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length <= 6) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedData[i] || "";
      }
      setCode(newCode);

      // Focus appropriate input
      const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if token is still valid
    if (!isTokenValid()) {
      setError("Session expired. Please restart the password reset process.");
      setTimeout(() => {
        clearResetSession();
        router.push("/forgot-password");
      }, 2000);
      return;
    }
    
    const fullCodeStr = code.join("");
    if (fullCodeStr.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }

    // Check attempt limits
    if (attempts >= maxAttempts) {
      setError("Too many failed attempts. Please request a new code.");
      return;
    }

    const fullCodeInt = parseInt(fullCodeStr);

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5046/api/auth/validate-reset-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: userEmail, ResetCode: fullCodeInt }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid code");
      }
      const data = await res.json();
      setCodeResult(data);
      console.log("result data", data);
      
      if (data === false) {
        throw new Error("Invalid verification code");
      }

      setSuccess(true); 
      // Redirect to reset password page after a brief delay
      setTimeout(() => {
        router.push("/reset-password");
      }, 1500);
    } catch (err) {
      setAttempts((prev) => prev + 1);
      const remainingAttempts = maxAttempts - (attempts + 1);

      if (remainingAttempts > 0) {
        setError(`${err.message} (${remainingAttempts} attempts remaining)`);
      } else {
        setError("Too many failed attempts. Please request a new code.");
      }
    } finally {
      setLoading(false);
    }
  };const handleResendCode = async () => {
    // Check if token is still valid
    if (!isTokenValid()) {
      setError("Session expired. Please restart the password reset process.");
      setTimeout(() => {
        clearResetSession();
        router.push("/forgot-password");
      }, 2000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API call to resend code - using same parameter name as forgot-password page
      const res = await fetch(
        "http://localhost:5046/api/auth/send-reset-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: userEmail }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.message || "Failed to send reset code to " + userEmail
        );
      }
      console.log("result data", res.data);

      // Reset attempts when a new code is sent successfully
      setAttempts(0);
      setError(null);
      
      // Extend token expiry for new code
      extendToken();

      // Handle success (e.g., show a success message)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  return (
    <ResetPasswordGuard requiredStep="reset-password-code">
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
            Enter Verification Code
          </h1>
          <p style={{ color: "var(--forgot-password-description-text)" }}>
            We've sent a 6-digit code to your email address. Please enter it
            below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code Input Container */}
          <div className="flex gap-3 justify-center my-8 sm:gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading || success || attempts >= maxAttempts}
                className="w-12 h-12 sm:w-10 sm:h-10 border-2 rounded-lg text-center text-2xl sm:text-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--reset-code-input-bg)",
                  color: "var(--reset-code-input-text)",
                  borderColor: error
                    ? "var(--reset-code-input-error-border)"
                    : "var(--reset-code-input-border)",
                  animation: error
                    ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                    : "none",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor =
                    "var(--reset-code-input-focus-border)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = error
                    ? "var(--reset-code-input-error-border)"
                    : "var(--reset-code-input-border)")
                }
              />
            ))}
          </div>{" "}
          {/* Error Message */}
          {error && (
            <motion.div
              className="border px-4 py-3 rounded-lg text-sm text-center"
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
              className="border px-4 py-3 rounded-lg text-sm text-center"
              style={{
                backgroundColor: "var(--forgot-password-success-bg)",
                borderColor: "var(--forgot-password-success-border)",
                color: "var(--forgot-password-success-text)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✓ Code verified! Redirecting...
            </motion.div>
          )}{" "}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success || attempts >= maxAttempts}
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
            {loading ? "Verifying..." : success ? "Verified!" : "Verify Code"}
          </button>{" "}
          {/* Resend Section */}
          <div className="text-center mt-6">
            <p
              className="text-sm mb-2"
              style={{ color: "var(--forgot-password-description-text)" }}
            >
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="font-medium underline hover:no-underline transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ color: "var(--forgot-password-link-text)" }}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--forgot-password-link-hover)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--forgot-password-link-text)")
              }            >
              Resend Code
            </button>
          </div>
        </form>
      </motion.div>
    </div>
    </ResetPasswordGuard>
  );
}
