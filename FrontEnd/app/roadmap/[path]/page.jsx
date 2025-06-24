"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Lock, CheckCircle, Circle, Play, ArrowLeft, Code } from "lucide-react";
import { SiHtml5, SiCss3, SiJavascript, SiReact } from "react-icons/si";
import Link from "next/link";
import useAuthStore from "@/store/authStore";

// Helper function to convert icon strings to JSX components
const getIconComponent = (iconString) => {
  if (!iconString) return <Circle className="w-6 h-6" />;

  // Handle JSX-like strings
  if (iconString.includes("SiHtml5")) {
    return <SiHtml5 className="text-[#e34f26]" />;
  }
  if (iconString.includes("SiCss3")) {
    return <SiCss3 className="text-[#264de4]" />;
  }
  if (iconString.includes("SiJavascript")) {
    return <SiJavascript className="text-[#f7df1e]" />;
  }
  if (iconString.includes("SiReact")) {
    return <SiReact className="text-[#61dafb]" />;
  }
  if (iconString.includes("Circle")) {
    return <Circle className="text-purple-500" />;
  }
  if (iconString === "Code") {
    return <Code className="w-8 h-8" />;
  }

  // Default fallback
  return <Circle className="w-6 h-6" />;
};

// Helper function to map roadmap path to backend ID
const getPathMapping = (path) => {
  const mappings = {
    fundamentals: 1,
    react: 2,
  };
  return mappings[path] || null;
};

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const taskVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from auth store
  const { getUserId, isAuthenticated } = useAuthStore();

  const currentPath = params.path;
  // Fetch roadmap data from backend
  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setLoading(true);

        // Check if user is authenticated and get user ID
        if (!isAuthenticated()) {
          throw new Error("User not authenticated");
        }

        const userId = getUserId();
        if (!userId) {
          throw new Error("User ID not found");
        }

        // Get roadmap ID from path
        const pathId = getPathMapping(currentPath);
        if (!pathId) {
          throw new Error("Invalid roadmap path");
        }

        const response = await fetch(
          `http://localhost:5046/api/Roadmaps/${pathId}/progress/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch roadmap data");
        }

        console.log(response);

        const roadmapData = await response.json();
        console.log("Fetched roadmap with progress:", roadmapData); // Transform the data to match the expected format
        const transformedRoadmap = {
          ...roadmapData,
          icon: getIconComponent(roadmapData.icon),
          tasks: roadmapData.tasks.map((task) => {
            // Check if task has any completed progress (status: true means completed)
            const hasCompletedProgress = task.designTaskDto.progresses.some(
              (progress) => progress.status === true
            );

            return {
              id: task.id,
              designTaskId: task.designTaskDto.id,
              title: task.designTaskDto.name,
              description: task.designTaskDto.description,
              icon: getIconComponent(task.icon),
              difficulty: task.designTaskDto.level,
              estimatedTime: "2-4 hours", // Default since not provided by backend
              points: 100,
              unlocked: !task.locked,
              completed: hasCompletedProgress,
            };
          }),
        };

        setRoadmap(transformedRoadmap);
        setTasks(transformedRoadmap.tasks);
        setTimeout(() => setIsVisible(true), 300);
      } catch (err) {
        console.error("Error fetching roadmap data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentPath) {
      fetchRoadmapData();
    }
  }, [currentPath, isAuthenticated, getUserId]);

  const handleTaskClick = (task) => {
    if (task.unlocked) {
      // Navigate to IDE with task context using designTaskId
      router.push(`/tasks/${task.designTaskId}?path=${currentPath}`);
    }
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-[var(--difficulty-easy-bg)] text-[var(--difficulty-easy-text)]";
      case "Intermediate":
        return "bg-[var(--difficulty-medium-bg)] text-[var(--difficulty-medium-text)]";
      case "Advanced":
        return "bg-[var(--difficulty-hard-bg)] text-[var(--difficulty-hard-text)]";
      case "Wizzard":
        return "bg-[var(--roadmap-difficulty-wizard-bg)] text-[var(--roadmap-difficulty-wizard-text)]";
      default:
        return "bg-[var(--difficulty-default-bg)] text-[var(--difficulty-default-text)]";
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--primary-bg)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[var(--text-color)]">
              Loading roadmap...
            </h2>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--primary-bg)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--text-color)] mb-4">
              Error loading roadmap
            </h1>
            <p className="text-[var(--text-muted)] mb-6">{error}</p>
            <Link href="/learning-paths">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium">
                Back to Learning Paths
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Not found state
  if (!roadmap) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--primary-bg)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--text-color)] mb-4">
              Roadmap not found
            </h1>
            <Link href="/learning-paths">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium">
                Back to Learning Paths
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalPoints = tasks
    .filter((t) => t.completed)
    .reduce((sum, task) => sum + task.points, 0);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--primary-bg)] py-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <Link href="/learning-paths">
              <motion.button
                className="inline-flex items-center mb-6 text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Learning Paths
              </motion.button>
            </Link>

            <div className="flex items-center justify-center mb-4">
              {roadmap.icon}
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent"
              style={{
                backgroundImage: "var(--heading-gradient)",
              }}
            >
              {roadmap.title}
            </h1>
            <p className="text-lg text-[var(--text-color)] mb-2">
              {roadmap.subtitle}
            </p>
            <p className="text-[var(--text-muted)] mb-6">
              {roadmap.description}
            </p>

            <div className="flex items-center justify-center space-x-6 text-sm text-[var(--text-muted)]">
              <span>{tasks.length} Tasks</span>
              <span>•</span>
              <span>{completedTasks} Completed</span>
              <span>•</span>
              <span>{totalPoints} Points Earned</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mb-12"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[var(--text-color)]">
                Progress
              </span>
              <span className="text-sm text-[var(--text-muted)]">
                {Math.round((completedTasks / tasks.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[var(--roadmap-progress-bg)] rounded-full h-3">
              <motion.div
                className="h-3 rounded-full"
                style={{ background: `var(--roadmap-progress-fill)` }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              ></motion.div>
            </div>
          </motion.div>

          {/* Task Tree */}
          <motion.div
            className="relative"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {/* Connecting Lines */}
            <div
              className="absolute left-8 top-0 bottom-0 w-0.5"
              style={{ background: `var(--roadmap-connection-line)` }}
            ></div>
            <div className="space-y-6">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  className="relative"
                  variants={taskVariants}
                  custom={index}
                >
                  {/* Connecting Node */}
                  <div
                    className={`absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-[var(--primary-bg)] shadow-lg z-10 ${
                      task.completed
                        ? "bg-[var(--status-completed-bg)]"
                        : task.unlocked
                        ? "bg-[var(--roadmap-connection-node)]"
                        : "bg-[var(--status-locked-bg)]"
                    }`}
                  ></div>
                  {/* Task Card */}
                  <motion.div
                    className={`ml-16 p-6 rounded-xl shadow-lg border transition-all duration-300 cursor-pointer ${
                      task.completed
                        ? "bg-[var(--roadmap-task-completed-bg)] border-[var(--roadmap-task-completed-border)]"
                        : task.unlocked
                        ? "bg-[var(--roadmap-task-available-bg)] border-[var(--roadmap-task-available-border)] hover:shadow-xl"
                        : "bg-[var(--roadmap-task-locked-bg)] border-[var(--roadmap-task-locked-border)] cursor-not-allowed"
                    }`}
                    style={{
                      opacity: task.unlocked
                        ? 1
                        : "var(--roadmap-task-locked-opacity)",
                    }}
                    onClick={() => handleTaskClick(task)}
                    whileHover={task.unlocked ? { scale: 1.02, y: -2 } : {}}
                    whileTap={task.unlocked ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-2xl mt-1">
                          {task.completed ? (
                            <CheckCircle className="text-green-500" size={24} />
                          ) : task.unlocked ? (
                            <div className="w-6 h-6 flex items-center justify-center">
                              {task.icon}
                            </div>
                          ) : (
                            <Lock
                              className="text-[var(--text-muted)]"
                              size={24}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                task.unlocked
                                  ? "text-[var(--text-color)]"
                                  : "text-[var(--text-muted)]"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                task.difficulty
                              )}`}
                            >
                              {task.difficulty}
                            </span>
                          </div>
                          <p
                            className={`text-sm mb-3 ${
                              task.unlocked
                                ? "text-[var(--text-muted)]"
                                : "text-[var(--text-muted)]"
                            }`}
                          >
                            {task.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-[var(--text-muted)]">
                              <span>⏱️ {task.estimatedTime}</span>
                              <span>🏆 {task.points} points</span>
                            </div>
                            {task.unlocked && !task.completed && (
                              <motion.span
                                className="flex items-center text-xs text-[var(--button-primary-bg)] font-medium"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Play size={12} className="mr-1" />
                                Start Task
                              </motion.span>
                            )}
                            {task.completed && (
                              <span className="text-xs text-[var(--status-completed-bg)] font-medium">
                                ✅ Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
