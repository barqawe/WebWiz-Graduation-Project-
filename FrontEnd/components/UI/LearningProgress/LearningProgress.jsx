"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Award } from "lucide-react";
import { getAllProgress } from "@/utils/taskProgress";

const LearningProgress = () => {
  const [progress, setProgress] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const allProgress = getAllProgress();
    setProgress(allProgress);
    setIsVisible(true);
  }, []);

  const pathStats = {
    fundamentals: { name: "Frontend", total: 10 },
    react: { name: "React", total: 10 }
  };

  const getTotalCompleted = () => {
    return Object.values(progress).reduce((total, pathProgress) => {
      return total + Object.values(pathProgress).filter(task => task.completed).length;
    }, 0);
  };

  const getTotalTasks = () => {
    return Object.values(pathStats).reduce((total, stat) => total + stat.total, 0);
  };

  const totalCompleted = getTotalCompleted();
  const totalTasks = getTotalTasks();

  if (totalCompleted === 0) return null;

  return (
    <motion.div
      className="flex items-center space-x-3 text-sm"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
        <BookOpen size={16} />
        <span className="font-medium">{totalCompleted}/{totalTasks}</span>
      </div>
      
      {Object.entries(progress).map(([pathId, pathProgress]) => {
        const completed = Object.values(pathProgress).filter(task => task.completed).length;
        const pathInfo = pathStats[pathId];
        
        if (!pathInfo || completed === 0) return null;
        
        return (
          <div key={pathId} className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 dark:text-green-400">
              {pathInfo.name}: {completed}/{pathInfo.total}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
};

export default LearningProgress;
