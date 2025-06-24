"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Clock, Target } from "lucide-react";
import { SiHtml5, SiCss3, SiJavascript, SiReact } from "react-icons/si";
import { getAllProgress, getCompletedTasksCount } from "@/utils/taskProgress";
import Link from "next/link";

const LearningPathsCard = () => {
  const [progress, setProgress] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const allProgress = getAllProgress();
    setProgress(allProgress);
    setIsLoaded(true);
  }, []);

  const pathsConfig = {
    fundamentals: {
      title: "Frontend Fundamentals",
      subtitle: "HTML, CSS & JavaScript",
      totalTasks: 10,
      color: "from-orange-500 to-yellow-500",
      icon: <SiHtml5 className="w-6 h-6 text-[#e34f26]" />,
      estimatedHours: 20
    },
    react: {
      title: "React Development", 
      subtitle: "Modern JavaScript Framework",
      totalTasks: 10,
      color: "from-cyan-500 to-blue-500",
      icon: <SiReact className="w-6 h-6 text-[#61dafb]" />,
      estimatedHours: 25
    }
  };

  const getPathProgress = (pathId) => {
    const pathProgress = progress[pathId] || {};
    const completed = Object.values(pathProgress).filter(task => task.completed).length;
    const config = pathsConfig[pathId];
    return {
      completed,
      total: config.totalTasks,
      percentage: Math.round((completed / config.totalTasks) * 100)
    };
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalCompleted = Object.keys(pathsConfig).reduce((sum, pathId) => {
    return sum + getPathProgress(pathId).completed;
  }, 0);

  const totalTasks = Object.values(pathsConfig).reduce((sum, config) => {
    return sum + config.totalTasks;
  }, 0);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-[var(--text-color)]">
            Learning Progress
          </h3>
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          {totalCompleted}/{totalTasks} tasks
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(pathsConfig).map(([pathId, config]) => {
          const pathProgress = getPathProgress(pathId);
          const hasStarted = pathProgress.completed > 0;

          return (
            <Link key={pathId} href={`/roadmap/${pathId}`}>
              <motion.div
                className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {config.icon}
                    <div>
                      <h4 className="font-medium text-[var(--text-color)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {config.title}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        {config.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-[var(--text-color)]">
                      {pathProgress.completed}/{pathProgress.total}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {pathProgress.percentage}%
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${config.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pathProgress.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      ~{config.estimatedHours}h
                    </span>
                    {hasStarted && (
                      <span className="flex items-center text-green-600 dark:text-green-400">
                        <Target className="w-3 h-3 mr-1" />
                        In Progress
                      </span>
                    )}
                  </div>
                  
                  {pathProgress.percentage === 100 && (
                    <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                      <Trophy className="w-3 h-3 mr-1" />
                      Complete
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {totalCompleted === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-[var(--text-muted)] mb-4">
            Start your learning journey today!
          </p>
          <Link href="/learning-paths">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Choose Learning Path
            </button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default LearningPathsCard;
