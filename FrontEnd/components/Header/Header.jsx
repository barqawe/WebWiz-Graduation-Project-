"use client";

import style from "./Header.module.scss";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { RiMenu4Line, RiCloseLine } from "react-icons/ri";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";
import { Trophy } from "lucide-react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticatedFunction = useAuthStore(
    (state) => state.isAuthenticated
  );
  const { canUserCreateTask, getUserId } = useAuthStore();
  const canCreateTask = canUserCreateTask();

  // Function to fetch profile picture
  const fetchProfilePicture = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5046/api/Auth/profile-picture/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
        }
      );

      if (response.ok) {
        const { imageUrl } = await response.json();
        setProfilePictureUrl(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = isAuthenticatedFunction();
      setIsAuthenticated(authStatus);

      if (authStatus) {
        const userId = getUserId();
        if (userId) {
          await fetchProfilePicture(userId);
        }
      } else {
        setProfilePictureUrl(null);
      }
    };

    if (isMounted) {
      checkAuth();
    }
  }, [isAuthenticatedFunction, getUserId, isMounted]);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md shadow-sm w-full py-3 px-4 md:px-8 lg:px-16 xl:px-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className={style.logo}>
          <Image
            src={logo}
            alt="wizard hat"
            priority
            className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
          />
          <span className="text-xl md:text-2xl lg:text-3xl">WebWiz</span>
        </Link>
        {/* Mobile menu button */}
        <button
          className="md:hidden z-50 text-[var(--text-color)] p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <RiCloseLine className="h-10 w-10 text-white " />
          ) : (
            <RiMenu4Line className="h-6 w-6" />
          )}
        </button>
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-1 lg:space-x-4">
            <li>
              <Link
                href="/about"
                className="px-3 py-2 lg:px-4 lg:py-2 text-[var(--text-color)] font-medium rounded-md hover:bg-white/10 transition-all duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/tasks"
                className="px-3 py-2 lg:px-4 lg:py-2 text-[var(--text-color)] font-medium rounded-md hover:bg-white/10 transition-all duration-200"
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link
                href="/learning-paths"
                className="px-3 py-2 lg:px-4 lg:py-2 text-[var(--text-color)] font-medium rounded-md hover:bg-white/10 transition-all duration-200"
              >
                Roadmaps
              </Link>
            </li>
            {isMounted && canCreateTask && (
              <li>
                <Link
                  href="/create"
                  className="px-3 py-2 lg:px-4 lg:py-2 text-[var(--text-color)] font-medium rounded-md hover:bg-white/10 transition-all duration-200"
                >
                  Create
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/leaderboard"
                className="px-3 py-2 lg:px-4 lg:py-2 text-[var(--text-color)] font-medium rounded-md hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
              >
                <Trophy className="w-5 h-5 text-yellow-400" />
              </Link>
            </li>
            <li className="flex items-center ml-2">
              <ThemeToggle />
            </li>
            <li>
              {!isMounted ? (
                // Show loading state during hydration
                <div className="ml-2 px-4 py-2 bg-white/10 rounded-md">
                  <div className="w-12 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
              ) : !isAuthenticated ? (
                <Link
                  href="/Login"
                  className="ml-2 px-4 py-2 text-[var(--text-color)] font-medium bg-white/10 rounded-md hover:bg-white/20 transition-all duration-200"
                >
                  Login
                </Link>
              ) : (
                <Link
                  href="/profile"
                  className="flex items-center ml-2 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  {profilePictureUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--text-color)]/20">
                      <Image
                        src={profilePictureUrl}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <FaUser className="text-lg text-[var(--text-color)]" />
                  )}
                </Link>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-lg transition-opacity duration-500"
            onClick={handleOverlayClick}
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transition: "opacity 500ms ease-in-out",
            }}
          />

          {/* Menu Panel - slide from top with bounce effect */}
          <div
            className="absolute inset-x-0 top-0 h-[100dvh] bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isMenuOpen ? "translateY(0)" : "translateY(-100%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Menu Content with staggered animation */}
            <div className="flex flex-col h-full pt-24 pb-8 px-6">
              {/* Navigation Links */}
              <nav className="flex-1">
                <ul className="space-y-5">
                  {[
                    { href: "/about", label: "About" },
                    { href: "/learning-paths", label: "Roadmaps" },
                    { href: "/tasks", label: "Tasks" },
                    ...(isMounted && canCreateTask
                      ? [{ href: "/create", label: "Create" }]
                      : []),
                    {
                      href: "/leaderboard",
                      label: "Leaderboard",
                      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
                    },
                  ].map((link, index) => (
                    <li
                      key={link.href}
                      className="transform transition-all duration-300 hover:translate-x-2"
                      style={{
                        opacity: isMenuOpen ? 1 : 0,
                        transform: isMenuOpen
                          ? "translateX(0)"
                          : "translateX(-20px)",
                        transition: `all 400ms ease ${150 + index * 100}ms`,
                      }}
                    >
                      <Link
                        href={link.href}
                        className="group flex items-center text-2xl font-medium text-white py-3 border-b border-white/10 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="relative overflow-hidden flex items-center gap-3">
                          {link.icon && link.icon}
                          {link.label}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              {/* Bottom Section with delayed animation */}
              <div
                className="space-y-6 pt-8 border-t border-white/10"
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? "translateY(0)" : "translateY(20px)",
                  transition: "all 400ms ease 450ms",
                }}
              >
                {/* Auth Section */}
                <div className="space-y-4">
                  {!isMounted ? (
                    // Loading state during hydration
                    <div className="block w-full text-center py-4 px-6 bg-gradient-to-r from-gray-600/40 to-gray-500/40 text-white font-semibold rounded-xl border border-white/20">
                      <div className="w-16 h-4 bg-white/20 rounded animate-pulse mx-auto"></div>
                    </div>
                  ) : !isAuthenticated ? (
                    <Link
                      href="/Login"
                      className="block w-full text-center py-4 px-6 bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white font-semibold rounded-xl border border-white/20 hover:from-purple-600/60 hover:to-blue-600/60 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      className="flex items-center justify-center space-x-3 w-full text-center py-4 px-6 bg-gradient-to-r from-white/15 to-white/5 text-white font-semibold rounded-xl border border-white/10 hover:from-white/25 hover:to-white/15 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {profilePictureUrl ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--text-color)]/20">
                          <Image
                            src={profilePictureUrl}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <FaUser className="text-xl" />
                      )}
                      <span>Profile</span>
                    </Link>
                  )}
                </div>
                {/* Theme Toggle with subtle animation */}
                <div className="flex justify-center pt-4">
                  <div className="p-3 bg-white/10 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-md hover:shadow-white/5">
                    <ThemeToggle />
                  </div>
                </div>
                {/* Footer Text */}
                <div className="text-center text-sm text-white/50 pt-4">
                  WebWiz © 2025
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
