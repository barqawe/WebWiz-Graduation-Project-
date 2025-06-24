"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";

// Animation variants
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

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, var(--forgot-password-bg-from) 0%, var(--forgot-password-bg-via) 50%, var(--forgot-password-bg-to) 100%)`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* Background overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, var(--forgot-password-overlay-from) 0%, var(--forgot-password-overlay-to) 100%)`,
          zIndex: 0,
        }}
      />

      {/* Back link */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.25rem",
          backgroundColor: "var(--forgot-password-back-link-bg)",
          border: `1px solid var(--forgot-password-back-link-border)`,
          borderRadius: "8px",
          color: "var(--forgot-password-back-link-text)",
          textDecoration: "none",
          fontWeight: "500",
          fontSize: "0.875rem",
          transition: "all 0.2s ease",
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            "var(--forgot-password-back-link-hover-bg)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            "var(--forgot-password-back-link-bg)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <FaArrowLeft />
        <span>Back to Home</span>
      </Link>

      {/* Theme toggle */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          zIndex: 10,
        }}
      >
        <ThemeToggle />
      </div>

      {/* Auth card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "var(--forgot-password-card-bg)",
          border: `1px solid var(--forgot-password-card-border)`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card header */}
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            borderBottom: `1px solid var(--forgot-password-card-border)`,
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
              color: "var(--forgot-password-header-text)",
              fontFamily: "var(--unique-font)",
              margin: 0,
            }}
          >
            {isLogin ? "Login" : "Register"}
          </h1>
          <p
            style={{
              color: "var(--forgot-password-description-text)",
              fontSize: "1rem",
              margin: "0.5rem 0 0 0",
            }}
          >
            Welcome to WebWiz, the frontend coding learning platform
          </p>
        </div>

        {/* Forms container */}
        <div
          style={{
            display: "flex",
            width: "200%",
            transform: isLogin ? "translateX(0)" : "translateX(-50%)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {/* Login form */}
          <div
            style={{
              width: "50%",
              padding: "2rem",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LoginForm />
            <button
              onClick={() => setIsLogin(false)}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.25rem",
                width: "100%",
                textAlign: "center",
                borderRadius: "8px",
                backgroundColor: "var(--forgot-password-input-bg)",
                border: `1px solid var(--forgot-password-input-border)`,
                color: "var(--forgot-password-description-text)",
                fontWeight: "500",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--forgot-password-card-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--forgot-password-input-bg)";
              }}
            >
              Don't have an account ?{" "}
              <span
                style={{
                  color: "var(--forgot-password-link-text)",
                  fontWeight: "600",
                }}
              >
                Register
              </span>
            </button>
          </div>

          {/* Register form */}
          <div
            style={{
              width: "50%",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <RegisterForm />
            <button
              onClick={() => setIsLogin(true)}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.25rem",
                width: "100%",
                textAlign: "center",
                borderRadius: "8px",
                backgroundColor: "var(--forgot-password-input-bg)",
                border: `1px solid var(--forgot-password-input-border)`,
                color: "var(--forgot-password-description-text)",
                fontWeight: "500",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--forgot-password-card-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--forgot-password-input-bg)";
              }}
            >
              Already have an account ?{" "}
              <span
                style={{
                  color: "var(--forgot-password-link-text)",
                  fontWeight: "600",
                }}
              >
                Login
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthContainer;
