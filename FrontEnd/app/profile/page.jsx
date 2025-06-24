"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import Header from "@/components/Header/Header";
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSignOutAlt,
  FaTrophy,
  FaCode,
  FaTasks,
  FaStar,
  FaCalendarAlt,
  FaCrown,
  FaExclamationTriangle,
  FaSync,
  FaCheckCircle,
  FaCamera,
  FaUpload,
  FaTrash,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isUploadingPfp, setIsUploadingPfp] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  // Instructor tasks state
  const [instructorTasks, setInstructorTasks] = useState([]);
  const [isLoadingInstructorTasks, setIsLoadingInstructorTasks] =
    useState(false);
  const [instructorTasksError, setInstructorTasksError] = useState("");
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const {
    isAuthenticated,
    getUserName,
    getUserId,
    canUserCreateTask,
    getTokenExpiry,
    logout,
  } = useAuthStore();

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

  // Function to fetch instructor tasks
  const fetchInstructorTasks = async () => {
    setIsLoadingInstructorTasks(true);
    setInstructorTasksError("");

    try {
      const response = await fetch(
        "http://localhost:5046/api/Design-Task/GetTasksByInstructorId",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const tasks = await response.json();
        setInstructorTasks(tasks);
        console.log("Fetched instructor tasks:", tasks);
      } else {
        throw new Error("Failed to fetch instructor tasks");
      }
    } catch (error) {
      console.error("Error fetching instructor tasks:", error);
      setInstructorTasksError("Failed to load instructor tasks");
    } finally {
      setIsLoadingInstructorTasks(false);
    }
  };

  // Function to show delete confirmation modal
  const showDeleteConfirmation = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  // Function to cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  // Function to confirm delete
  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteInstructorTask(taskToDelete.id);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  // Function to delete instructor task
  const deleteInstructorTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:5046/api/Design-Task/DeleteTask?id=${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove the deleted task from the local state
        setInstructorTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
        console.log("Task deleted successfully:", taskId);
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setInstructorTasksError("Failed to delete task");
    }
  };

  // Function to handle profile picture upload
  const handleProfilePictureUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setIsUploadingPfp(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:5046/api/Auth/upload-profile-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
        // Refresh profile picture
        await fetchProfilePicture(getUserId());
      } else {
        const errorData = await response.text();
        setUploadError(errorData || "Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setUploadError("Network error. Please try again.");
    } finally {
      setIsUploadingPfp(false);
    }
  };

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleProfilePictureUpload(file);
    }
    // Reset file input
    event.target.value = "";
  };

  // Function to trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!isAuthenticated()) {
        router.push("/Login");
        return;
      }

      const userName = getUserName();
      const userId = getUserId();
      const canCreate = canUserCreateTask();
      const tokenExpiry = getTokenExpiry();

      // Fetch profile picture
      await fetchProfilePicture(userId);

      // Fetch instructor tasks if user can create tasks
      if (canCreate) {
        await fetchInstructorTasks();
      }

      // Fetch user progress from API
      try {
        const response = await fetch(
          "http://localhost:5046/api/Progress/Progress",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user progress");
        }

        const progressData = await response.json();

        // Calculate additional stats
        const currentStreak = Math.floor(Math.random() * 10) + 1; // Mock streak for now
        const joinDate = "January 2025"; // Mock join date for now

        // Determine rank based on total points
        let rank = "Beginner";
        if (progressData.totalPoint >= 1000) rank = "Advanced";
        else if (progressData.totalPoint >= 500) rank = "Intermediate";

        setUserInfo({
          name: userName || "User",
          id: userId,
          email: `${userName || "user"}@webwiz.com`, // Mock email since not in token
          canCreateTask: canCreate,
          tokenExpiry: tokenExpiry,
          joinDate: joinDate,
          completedTasks: progressData.completedTask,
          currentStreak: currentStreak,
          totalPoints: progressData.totalPoint,
          rank: rank,
          designTasks: progressData.designTasks, // Add the tasks array
        });
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setApiError(true);
        // Fallback to basic user info if API fails
        setUserInfo({
          name: userName || "User",
          id: userId,
          email: `${userName || "user"}@webwiz.com`,
          canCreateTask: canCreate,
          tokenExpiry: tokenExpiry,
          joinDate: "January 2025",
          completedTasks: 0,
          currentStreak: 0,
          totalPoints: 0,
          rank: "Beginner",
          designTasks: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [
    isAuthenticated,
    getUserName,
    getUserId,
    canUserCreateTask,
    getTokenExpiry,
    router,
  ]);
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setApiError(false);

    const userName = getUserName();
    const userId = getUserId();
    const canCreate = canUserCreateTask();
    const tokenExpiry = getTokenExpiry();

    try {
      const response = await fetch(
        "http://localhost:5046/api/Progress/Progress",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user progress");
      }

      const progressData = await response.json();

      // Calculate additional stats
      const currentStreak = Math.floor(Math.random() * 10) + 1;
      const joinDate = "January 2025";

      // Determine rank based on total points
      let rank = "Beginner";
      if (progressData.totalPoint >= 1000) rank = "Advanced";
      else if (progressData.totalPoint >= 500) rank = "Intermediate";
      setUserInfo({
        name: userName || "User",
        id: userId,
        email: `${userName || "user"}@webwiz.com`,
        canCreateTask: canCreate,
        tokenExpiry: tokenExpiry,
        joinDate: joinDate,
        completedTasks: progressData.completedTask,
        currentStreak: currentStreak,
        totalPoints: progressData.totalPoint,
        rank: rank,
        designTasks: progressData.designTasks,
      });

      // Show success message
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 3000);

      // Refresh instructor tasks if user can create tasks
      if (canCreate) {
        await fetchInstructorTasks();
      }
    } catch (error) {
      console.error("Error refreshing user progress:", error);
      setApiError(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  if (isLoading) {
    return (
      <>
        <Header />
        <div
          className="flex flex-col items-center justify-center min-h-[70vh] text-center"
          style={{ color: "var(--text-color)" }}
        >
          <div
            className="w-10 h-10 border-4 rounded-full animate-spin mb-4"
            style={{
              borderColor: "var(--dropdown-bg)",
              borderLeftColor: "var(--footer-community-icon)",
            }}
          ></div>
          <p className="text-lg mt-4" style={{ color: "var(--text-muted)" }}>
            Loading your profile data...
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            Fetching your progress and achievements
          </p>
        </div>
      </>
    );
  }
  if (!userInfo) {
    return (
      <>
        <Header />
        <div
          className="flex flex-col items-center justify-center min-h-[70vh] text-center"
          style={{ color: "var(--text-color)" }}
        >
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Unable to load profile information
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <Header />{" "}
      <div
        className="min-h-screen py-8 md:py-16 text-[var(--text-color)]"
        style={{
          background: "var(--primary-bg)",
          color: "var(--text-color)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Upload Error Notice */}
          {uploadError && (
            <motion.div
              className="mb-6 p-4 rounded-xl"
              style={{
                backgroundColor: "var(--auth-error-bg)",
                borderColor: "var(--auth-error-border)",
                color: "var(--auth-error-color)",
                border: "1px solid",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle
                    style={{ color: "var(--auth-error-color)" }}
                  />
                  <span className="text-sm">{uploadError}</span>
                </div>
                <button
                  onClick={() => setUploadError("")}
                  className="transition-colors duration-200 hover:opacity-75"
                  style={{ color: "var(--auth-error-color)" }}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
          {/* Upload Success Notice */}
          {uploadSuccess && (
            <motion.div
              className="mb-6 p-4 rounded-xl"
              style={{
                backgroundColor: "var(--forgot-password-success-bg)",
                borderColor: "var(--forgot-password-success-border)",
                color: "var(--forgot-password-success-text)",
                border: "1px solid",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaCheckCircle
                    style={{ color: "var(--forgot-password-success-text)" }}
                  />
                  <span className="text-sm">
                    Profile picture uploaded successfully!
                  </span>
                </div>
                <button
                  onClick={() => setUploadSuccess(false)}
                  className="transition-colors duration-200 hover:opacity-75"
                  style={{ color: "var(--forgot-password-success-text)" }}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
          {/* Success Message */}
          {refreshSuccess && (
            <motion.div
              className="mb-6 p-4 rounded-xl"
              style={{
                backgroundColor: "var(--forgot-password-success-bg)",
                borderColor: "var(--forgot-password-success-border)",
                color: "var(--forgot-password-success-text)",
                border: "1px solid",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaCheckCircle
                    style={{ color: "var(--forgot-password-success-text)" }}
                  />
                  <span className="text-sm">
                    Profile data refreshed successfully!
                  </span>
                </div>
                <button
                  onClick={() => setRefreshSuccess(false)}
                  className="transition-colors duration-200 hover:opacity-75"
                  style={{ color: "var(--forgot-password-success-text)" }}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
          {/* Profile Header */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {" "}
            <div
              className="rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                border: "1px solid",
              }}
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Profile Picture with Upload Functionality */}
                  <div className="relative group">
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden"
                      style={{
                        background: "var(--heading-gradient)",
                        boxShadow: "0 25px 50px -12px rgba(65, 163, 249, 0.25)",
                      }}
                      onClick={triggerFileInput}
                    >
                      {profilePictureUrl ? (
                        <Image
                          width={128}
                          height={128}
                          src={profilePictureUrl}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <FaUser className="text-5xl text-white" />
                      )}
                    </div>

                    {/* Upload overlay */}
                    <div
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      {isUploadingPfp ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <FaCamera className="text-2xl text-white" />
                      )}
                    </div>

                    {/* Upload button hint */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {isUploadingPfp ? "Uploading..." : "Click to upload"}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1
                      className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent"
                      style={{
                        fontFamily: "var(--unique-font)",
                        backgroundImage: "var(--heading-gradient)",
                      }}
                    >
                      {userInfo.name}
                    </h1>
                    <div
                      className="flex items-center justify-center md:justify-start gap-2 mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <FaEnvelope
                        style={{ color: "var(--footer-community-icon)" }}
                      />
                      <span>{userInfo.email}</span>
                    </div>
                    <div
                      className="flex items-center justify-center md:justify-start gap-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <FaCrown
                        style={{ color: "var(--footer-community-icon)" }}
                      />
                      <span>{userInfo.rank} Developer</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
                  <button
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg border font-semibold transition-all duration-300 hover:-translate-y-1 ${
                      isRefreshing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{
                      fontFamily: "var(--unique-font)",
                      backgroundColor: "var(--auth-switch-bg)",
                      borderColor: "var(--footer-community-icon)",
                      color: "var(--footer-community-icon)",
                      boxShadow: isRefreshing
                        ? "none"
                        : "0 4px 12px rgba(65, 163, 249, 0.15)",
                    }}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    onMouseEnter={(e) => {
                      if (!isRefreshing) {
                        e.target.style.backgroundColor =
                          "var(--dropdown-option-hover)";
                        e.target.style.boxShadow =
                          "0 8px 20px rgba(65, 163, 249, 0.25)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRefreshing) {
                        e.target.style.backgroundColor =
                          "var(--auth-switch-bg)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(65, 163, 249, 0.15)";
                      }
                    }}
                  >
                    <FaSync className={isRefreshing ? "animate-spin" : ""} />
                    <span>
                      {isRefreshing ? "Refreshing..." : "Refresh Data"}
                    </span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-5 py-3 rounded-lg border font-semibold transition-all duration-300 hover:-translate-y-1"
                    style={{
                      fontFamily: "var(--unique-font)",
                      backgroundColor: "var(--auth-error-bg)",
                      borderColor: "var(--auth-error-color)",
                      color: "var(--auth-error-color)",
                      boxShadow: "0 4px 12px rgba(255, 70, 70, 0.15)",
                    }}
                    onClick={handleLogout}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(255, 70, 70, 0.2)";
                      e.target.style.boxShadow =
                        "0 8px 20px rgba(255, 70, 70, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "var(--auth-error-bg)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(255, 70, 70, 0.15)";
                    }}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {" "}
            <motion.div
              className="rounded-xl p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                border: "1px solid",
              }}
              variants={cardVariants}
            >
              <div className="mb-4">
                <FaTasks
                  className="text-4xl mx-auto mb-2"
                  style={{ color: "var(--footer-community-icon)" }}
                />
                <h3
                  className="text-lg font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Completed Tasks
                </h3>
              </div>
              <div
                className="text-4xl font-bold bg-clip-text text-transparent"
                style={{
                  fontFamily: "var(--unique-font)",
                  backgroundImage: "var(--heading-gradient)",
                }}
              >
                {userInfo.completedTasks}
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                border: "1px solid",
              }}
              variants={cardVariants}
            >
              <div className="mb-4">
                <FaTrophy
                  className="text-4xl mx-auto mb-2"
                  style={{ color: "var(--footer-community-icon)" }}
                />
                <h3
                  className="text-lg font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Total Points
                </h3>
              </div>
              <div
                className="text-4xl font-bold bg-clip-text text-transparent"
                style={{
                  fontFamily: "var(--unique-font)",
                  backgroundImage: "var(--heading-gradient)",
                }}
              >
                {userInfo.totalPoints.toLocaleString()}
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                border: "1px solid",
              }}
              variants={cardVariants}
            >
              <div className="mb-4">
                <FaCode
                  className="text-4xl mx-auto mb-2"
                  style={{ color: "var(--footer-community-icon)" }}
                />
                <h3
                  className="text-lg font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Instructor ?
                </h3>
              </div>
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-full inline-block border ${
                  userInfo.canCreateTask ? "" : ""
                }`}
                style={{
                  fontFamily: "var(--unique-font)",
                  backgroundColor: userInfo.canCreateTask
                    ? "var(--forgot-password-success-bg)"
                    : "var(--dropdown-bg)",
                  color: userInfo.canCreateTask
                    ? "var(--forgot-password-success-text)"
                    : "var(--text-muted)",
                  borderColor: userInfo.canCreateTask
                    ? "var(--forgot-password-success-border)"
                    : "var(--card-border)",
                }}
              >
                {userInfo.canCreateTask ? "Yes" : "No"}
              </div>
            </motion.div>
          </motion.div>
          {/* Additional Information */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {" "}
            <motion.div
              className="rounded-xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                border: "1px solid",
              }}
              variants={cardVariants}
            >
              <h3
                className="text-2xl font-semibold mb-6 bg-clip-text text-transparent"
                style={{
                  fontFamily: "var(--unique-font)",
                  backgroundImage: "var(--heading-gradient)",
                }}
              >
                Account Information
              </h3>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-4 p-3 rounded-lg border"
                  style={{
                    backgroundColor: "var(--auth-input-bg)",
                    borderColor: "var(--auth-input-border)",
                  }}
                >
                  <FaUser
                    className="text-xl min-w-[20px]"
                    style={{ color: "var(--footer-community-icon)" }}
                  />
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Rank
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--text-color)" }}
                    >
                      {userInfo.rank}
                    </span>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 p-3 rounded-lg border"
                  style={{
                    backgroundColor: "var(--auth-input-bg)",
                    borderColor: "var(--auth-input-border)",
                  }}
                >
                  <FaCalendarAlt
                    className="text-xl min-w-[20px]"
                    style={{ color: "var(--footer-community-icon)" }}
                  />
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Member Since
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--text-color)" }}
                    >
                      {userInfo.joinDate}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                border: "1px solid",
              }}
              variants={cardVariants}
            >
              <h3
                className="text-2xl font-semibold mb-6 bg-clip-text text-transparent"
                style={{
                  fontFamily: "var(--unique-font)",
                  backgroundImage: "var(--heading-gradient)",
                }}
              >
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  className="flex items-center justify-center gap-3 p-4 rounded-lg border font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--auth-input-bg)",
                    borderColor: "var(--auth-input-border)",
                    color: "var(--text-color)",
                    fontFamily: "var(--unique-font)",
                  }}
                  onClick={() => router.push("/tasks")}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor =
                      "var(--dropdown-option-hover)";
                    e.target.style.borderColor = "var(--footer-community-icon)";
                    e.target.style.boxShadow =
                      "0 8px 20px rgba(65, 163, 249, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "var(--auth-input-bg)";
                    e.target.style.borderColor = "var(--auth-input-border)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <FaTasks
                    className="text-lg"
                    style={{ color: "var(--footer-community-icon)" }}
                  />
                  <span>Browse Tasks</span>
                </button>
                <button
                  className="flex items-center justify-center gap-3 p-4 rounded-lg border font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--auth-input-bg)",
                    borderColor: "var(--auth-input-border)",
                    color: "var(--text-color)",
                    fontFamily: "var(--unique-font)",
                  }}
                  onClick={() => router.push("/leaderboard")}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor =
                      "var(--dropdown-option-hover)";
                    e.target.style.borderColor = "var(--footer-community-icon)";
                    e.target.style.boxShadow =
                      "0 8px 20px rgba(65, 163, 249, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "var(--auth-input-bg)";
                    e.target.style.borderColor = "var(--auth-input-border)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <FaTrophy
                    className="text-lg"
                    style={{ color: "var(--footer-community-icon)" }}
                  />
                  <span>Leaderboard</span>
                </button>
                {userInfo.canCreateTask && (
                  <button
                    className="flex items-center justify-center gap-3 p-4 rounded-lg border font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2"
                    style={{
                      backgroundColor: "var(--auth-input-bg)",
                      borderColor: "var(--auth-input-border)",
                      color: "var(--text-color)",
                      fontFamily: "var(--unique-font)",
                    }}
                    onClick={() => router.push("/create")}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        "var(--dropdown-option-hover)";
                      e.target.style.borderColor =
                        "var(--footer-community-icon)";
                      e.target.style.boxShadow =
                        "0 8px 20px rgba(65, 163, 249, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "var(--auth-input-bg)";
                      e.target.style.borderColor = "var(--auth-input-border)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <FaCode
                      className="text-lg"
                      style={{ color: "var(--footer-community-icon)" }}
                    />
                    <span>Create Task</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
          {/* Completed Tasks Section */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {" "}
            <motion.div
              className="rounded-xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                border: "1px solid",
              }}
              variants={cardVariants}
            >
              <h3
                className="text-2xl font-semibold mb-6 bg-clip-text text-transparent"
                style={{
                  fontFamily: "var(--unique-font)",
                  backgroundImage: "var(--heading-gradient)",
                }}
              >
                Completed Tasks
              </h3>
              {userInfo.designTasks && userInfo.designTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userInfo.designTasks.map((task, index) => (
                    <motion.div
                      key={index}
                      className="rounded-lg p-4 border transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundColor: "var(--auth-input-bg)",
                        borderColor: "var(--auth-input-border)",
                      }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "var(--dropdown-option-hover)",
                        borderColor: "var(--footer-community-icon)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4
                          className="font-semibold text-sm leading-tight"
                          style={{ color: "var(--text-color)" }}
                        >
                          {task.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 border`}
                          style={{
                            backgroundColor:
                              task.level.toLowerCase() === "beginner"
                                ? "var(--difficulty-easy-bg)"
                                : task.level.toLowerCase() === "intermediate"
                                ? "var(--difficulty-medium-bg)"
                                : "var(--difficulty-hard-bg)",
                            color:
                              task.level.toLowerCase() === "beginner"
                                ? "var(--difficulty-easy-text)"
                                : task.level.toLowerCase() === "intermediate"
                                ? "var(--difficulty-medium-text)"
                                : "var(--difficulty-hard-text)",
                            borderColor:
                              task.level.toLowerCase() === "beginner"
                                ? "var(--difficulty-easy-text)"
                                : task.level.toLowerCase() === "intermediate"
                                ? "var(--difficulty-medium-text)"
                                : "var(--difficulty-hard-text)",
                          }}
                        >
                          {task.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCode
                          className="text-sm"
                          style={{ color: "var(--footer-community-icon)" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {task.programmingLanguage.toUpperCase()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaTasks
                    className="text-4xl mx-auto mb-4 opacity-50"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <p
                    className="text-lg mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No completed tasks yet
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Start solving tasks to see your progress here!
                  </p>
                  <button
                    className="mt-4 px-6 py-2 rounded-lg border font-semibold transition-all duration-300 hover:shadow-lg"
                    style={{
                      backgroundColor: "var(--auth-switch-bg)",
                      borderColor: "var(--footer-community-icon)",
                      color: "var(--footer-community-icon)",
                      fontFamily: "var(--unique-font)",
                    }}
                    onClick={() => router.push("/tasks")}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        "var(--dropdown-option-hover)";
                      e.target.style.boxShadow =
                        "0 8px 20px rgba(65, 163, 249, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "var(--auth-switch-bg)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Browse Tasks
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
          {/* Instructor Tasks Section - Only visible to instructors */}
          {userInfo.canCreateTask && (
            <motion.div
              className="mb-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {" "}
              <motion.div
                className="rounded-xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                  border: "1px solid",
                }}
                variants={cardVariants}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-2xl font-semibold bg-clip-text text-transparent"
                    style={{
                      fontFamily: "var(--unique-font)",
                      backgroundImage: "var(--heading-gradient)",
                    }}
                  >
                    Your Created Tasks
                  </h3>
                  <div className="flex items-center gap-2">
                    <FaCrown
                      style={{ color: "var(--footer-community-icon)" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Instructor Dashboard
                    </span>
                  </div>
                </div>

                {isLoadingInstructorTasks ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div
                      className="w-8 h-8 border-4 border-l-4 rounded-full animate-spin mb-4"
                      style={{
                        borderColor: "var(--dropdown-bg)",
                        borderLeftColor: "var(--footer-community-icon)",
                      }}
                    ></div>
                    <p style={{ color: "var(--text-muted)" }}>
                      Loading your tasks...
                    </p>
                  </div>
                ) : instructorTasksError ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FaExclamationTriangle
                      className="text-4xl mb-4"
                      style={{ color: "var(--auth-error-color)" }}
                    />
                    <p
                      className="text-lg mb-2"
                      style={{ color: "var(--auth-error-color)" }}
                    >
                      {instructorTasksError}
                    </p>
                    <button
                      onClick={fetchInstructorTasks}
                      className="px-4 py-2 rounded-lg border font-semibold transition-all duration-300"
                      style={{
                        backgroundColor: "var(--auth-switch-bg)",
                        borderColor: "var(--footer-community-icon)",
                        color: "var(--footer-community-icon)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor =
                          "var(--dropdown-option-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor =
                          "var(--auth-switch-bg)";
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : instructorTasks && instructorTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {instructorTasks.map((task, index) => (
                      <motion.div
                        key={task.id || index}
                        className="rounded-lg p-4 border transition-all duration-300 hover:shadow-lg"
                        style={{
                          backgroundColor: "var(--auth-input-bg)",
                          borderColor: "var(--auth-input-border)",
                        }}
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: "var(--dropdown-option-hover)",
                          borderColor: "var(--footer-community-icon)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4
                            className="font-semibold text-sm leading-tight"
                            style={{ color: "var(--text-color)" }}
                          >
                            {task.name || task.title || "Untitled Task"}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 border`}
                            style={{
                              backgroundColor:
                                (
                                  task.level ||
                                  task.difficulty ||
                                  "beginner"
                                ).toLowerCase() === "beginner"
                                  ? "var(--difficulty-easy-bg)"
                                  : (
                                      task.level ||
                                      task.difficulty ||
                                      "intermediate"
                                    ).toLowerCase() === "intermediate"
                                  ? "var(--difficulty-medium-bg)"
                                  : "var(--difficulty-hard-bg)",
                              color:
                                (
                                  task.level ||
                                  task.difficulty ||
                                  "beginner"
                                ).toLowerCase() === "beginner"
                                  ? "var(--difficulty-easy-text)"
                                  : (
                                      task.level ||
                                      task.difficulty ||
                                      "intermediate"
                                    ).toLowerCase() === "intermediate"
                                  ? "var(--difficulty-medium-text)"
                                  : "var(--difficulty-hard-text)",
                              borderColor:
                                (
                                  task.level ||
                                  task.difficulty ||
                                  "beginner"
                                ).toLowerCase() === "beginner"
                                  ? "var(--difficulty-easy-text)"
                                  : (
                                      task.level ||
                                      task.difficulty ||
                                      "intermediate"
                                    ).toLowerCase() === "intermediate"
                                  ? "var(--difficulty-medium-text)"
                                  : "var(--difficulty-hard-text)",
                            }}
                          >
                            {task.level || "Beginner"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaCode
                            className="text-sm"
                            style={{ color: "var(--footer-community-icon)" }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {(
                              task.programming_Language ||
                              task.language ||
                              "JavaScript"
                            ).toUpperCase()}
                          </span>
                        </div>
                        {task.description && (
                          <p
                            className="text-xs leading-relaxed line-clamp-2"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {task.description}
                          </p>
                        )}
                        {/* Delete button - only visible to instructors */}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => showDeleteConfirmation(task)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                            style={{
                              backgroundColor: "var(--auth-error-bg)",
                              color: "var(--auth-error-color)",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor =
                                "rgba(255, 70, 70, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor =
                                "var(--auth-error-bg)";
                            }}
                          >
                            <FaTrash
                              style={{ color: "var(--auth-error-color)" }}
                            />
                            <span className="text-sm">Delete Task</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaCode
                      className="text-4xl mx-auto mb-4 opacity-50"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <p
                      className="text-lg mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No tasks created yet
                    </p>
                    <p
                      className="text-sm mb-4"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Start creating tasks to help other developers learn!
                    </p>
                    <button
                      className="px-6 py-2 rounded-lg border font-semibold transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundColor: "var(--auth-switch-bg)",
                        borderColor: "var(--footer-community-icon)",
                        color: "var(--footer-community-icon)",
                        fontFamily: "var(--unique-font)",
                      }}
                      onClick={() => router.push("/create")}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor =
                          "var(--dropdown-option-hover)";
                        e.target.style.boxShadow =
                          "0 8px 20px rgba(65, 163, 249, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor =
                          "var(--auth-switch-bg)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      Create Your First Task
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}{" "}
        </div>
      </div>{" "}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "var(--dropdown-backdrop)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-xl p-6 max-w-md w-full mx-4 border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="text-center">
              <div className="mb-4">
                <FaExclamationTriangle
                  className="text-4xl mx-auto mb-3"
                  style={{ color: "var(--auth-error-color)" }}
                />
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--text-color)" }}
                >
                  Delete Task
                </h3>
                <p style={{ color: "var(--text-muted)" }}>
                  Are you sure you want to delete "{taskToDelete?.title}"? This
                  action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg border font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                    color: "var(--text-color)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "var(--auth-input-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "var(--card-bg)";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: "var(--auth-error-color)",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                  }}
                >
                  Delete Task
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
