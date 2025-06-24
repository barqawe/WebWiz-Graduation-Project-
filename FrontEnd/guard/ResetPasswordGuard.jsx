"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import useEmailStore from "@/store/emailStore";

const ResetPasswordGuard = ({ children, requiredStep }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  const { 
    getEmail, 
    CodeResult, 
    getResetToken, 
    getTokenExpiry, 
    clearResetSession,
    resetFlowStep 
  } = useEmailStore();

  useEffect(() => {
    const validateAccess = () => {
      const email = getEmail();
      const resetToken = getResetToken();
      const tokenExpiry = getTokenExpiry();
      const currentStep = resetFlowStep;

      // Check if user is trying to access a step they haven't reached
      const stepOrder = {
        'forgot-password': 1,
        'reset-password-code': 2,
        'reset-password': 3
      };

      const currentStepNumber = stepOrder[requiredStep];
      const userStepNumber = stepOrder[currentStep];

      // Block access if user hasn't completed previous steps
      if (currentStepNumber > userStepNumber) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      // For reset-password-code page
      if (requiredStep === 'reset-password-code') {
        if (!email || !resetToken || !tokenExpiry) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Check if token has expired (15 minutes)
        if (Date.now() > tokenExpiry) {
          clearResetSession();
          setAuthorized(false);
          setLoading(false);
          return;
        }
      }

      // For reset-password page
      if (requiredStep === 'reset-password') {
        if (!email || !resetToken || CodeResult !== true) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Check if token has expired
        if (Date.now() > tokenExpiry) {
          clearResetSession();
          setAuthorized(false);
          setLoading(false);
          return;
        }
      }

      setAuthorized(true);
      setLoading(false);
    };

    // Add a small delay to prevent flash
    const timer = setTimeout(validateAccess, 100);
    return () => clearTimeout(timer);
  }, [
    requiredStep, 
    getEmail, 
    CodeResult, 
    getResetToken, 
    getTokenExpiry, 
    clearResetSession,
    resetFlowStep
  ]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-8 relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authorized) {
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

        <motion.div
          className="w-full max-w-md backdrop-blur-sm rounded-2xl shadow-xl border p-8 text-center"
          style={{
            backgroundColor: "var(--forgot-password-card-bg)",
            borderColor: "var(--forgot-password-card-border)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-white text-2xl" />
          </div>
          
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--forgot-password-header-text)" }}
          >
            Access Denied
          </h1>
          
          <p
            className="mb-6"
            style={{ color: "var(--forgot-password-description-text)" }}
          >
            You don't have permission to access this page. Please start the password reset process from the beginning.
          </p>

          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-white"
              style={{
                background: `linear-gradient(to right, var(--forgot-password-button-bg-from), var(--forgot-password-button-bg-to))`,
                border: "none",
              }}
            >
              Start Password Reset
            </Link>
            
            <Link
              href="/Login"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--forgot-password-input-bg)",
                borderColor: "var(--forgot-password-input-border)",
                color: "var(--forgot-password-description-text)",
              }}
            >
              <FaArrowLeft className="text-sm" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ResetPasswordGuard;
