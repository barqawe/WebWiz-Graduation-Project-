"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiHtml5, SiCss3, SiJavascript } from "react-icons/si";
import { ArrowLeft, Lock, CheckCircle, Play, Code, Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function WebFundamentalsRoadmap() {
  const [completedTasks, setCompletedTasks] = useState(new Set([1])); // First task is unlocked by default
  const [progress, setProgress] = useState(0);  
  
  // Helper function to get tech colors from CSS variables
  const getTechColor = (tech) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      const style = getComputedStyle(root);      switch(tech) {
        case 'html': return style.getPropertyValue('--tech-html-color').trim();
        case 'css': return style.getPropertyValue('--tech-css-color').trim();
        case 'js': return style.getPropertyValue('--tech-js-color').trim();
        case 'star': return style.getPropertyValue('--tech-star-color').trim();
        default: return style.getPropertyValue('--tech-star-color').trim();
      }
    }
    // Fallback for SSR
    switch(tech) {
      case 'html': return 'var(--tech-html-color)';
      case 'css': return 'var(--tech-css-color)';
      case 'js': return 'var(--tech-js-color)';
      case 'star': return 'var(--tech-star-color)';
      default: return 'var(--tech-star-color)';
    }
  };

  // Sample task data for Web Fundamentals - replace with real data from your API
  const roadmapData = {
    1: [
      { id: 1, title: "HTML Basics", description: "Structure and semantic elements", icon: SiHtml5, color: getTechColor('html'), x: 50, y: 5, difficulty: "Easy" }
    ],
    2: [
      { id: 2, title: "HTML Forms", description: "Input fields and form handling", icon: SiHtml5, color: getTechColor('html'), x: 20, y: 15, difficulty: "Easy" },
      { id: 3, title: "HTML Tables", description: "Tabular data organization", icon: SiHtml5, color: getTechColor('html'), x: 80, y: 15, difficulty: "Easy" }
    ],
    3: [
      { id: 4, title: "CSS Fundamentals", description: "Styling and selectors", icon: SiCss3, color: getTechColor('css'), x: 50, y: 25, difficulty: "Easy" }
    ],
    4: [
      { id: 5, title: "CSS Flexbox", description: "Flexible layout system", icon: SiCss3, color: getTechColor('css'), x: 15, y: 35, difficulty: "Medium" },
      { id: 6, title: "CSS Grid", description: "Two-dimensional layouts", icon: SiCss3, color: getTechColor('css'), x: 85, y: 35, difficulty: "Medium" }
    ],
    5: [
      { id: 7, title: "Responsive Design", description: "Mobile-first approach", icon: SiCss3, color: getTechColor('css'), x: 30, y: 45, difficulty: "Medium" },
      { id: 8, title: "CSS Animations", description: "Keyframes and transitions", icon: SiCss3, color: getTechColor('css'), x: 70, y: 45, difficulty: "Medium" }
    ],
    6: [
      { id: 9, title: "JavaScript Basics", description: "Variables and functions", icon: SiJavascript, color: getTechColor('js'), x: 50, y: 55, difficulty: "Medium" }
    ],
    7: [
      { id: 10, title: "DOM Manipulation", description: "Interactive web elements", icon: SiJavascript, color: getTechColor('js'), x: 25, y: 65, difficulty: "Medium" },
      { id: 11, title: "Event Handling", description: "User interaction responses", icon: SiJavascript, color: getTechColor('js'), x: 75, y: 65, difficulty: "Hard" }
    ],
    8: [
      { id: 12, title: "Final Project", description: "Complete web application", icon: Star, color: getTechColor('star'), x: 50, y: 75, difficulty: "Hard" }
    ]
  };  // Create connections between tasks
  const connections = [
    // Level 1 to 2
    { from: { x: 50, y: 5 }, to: { x: 20, y: 15 } },
    { from: { x: 50, y: 5 }, to: { x: 80, y: 15 } },
    // Level 2 to 3
    { from: { x: 20, y: 15 }, to: { x: 50, y: 25 } },
    { from: { x: 80, y: 15 }, to: { x: 50, y: 25 } },
    // Level 3 to 4
    { from: { x: 50, y: 25 }, to: { x: 15, y: 35 } },
    { from: { x: 50, y: 25 }, to: { x: 85, y: 35 } },
    // Level 4 to 5
    { from: { x: 15, y: 35 }, to: { x: 30, y: 45 } },
    { from: { x: 85, y: 35 }, to: { x: 70, y: 45 } },
    // Level 5 to 6
    { from: { x: 30, y: 45 }, to: { x: 50, y: 55 } },
    { from: { x: 70, y: 45 }, to: { x: 50, y: 55 } },
    // Level 6 to 7
    { from: { x: 50, y: 55 }, to: { x: 25, y: 65 } },
    { from: { x: 50, y: 55 }, to: { x: 75, y: 65 } },
    // Level 7 to 8
    { from: { x: 25, y: 65 }, to: { x: 50, y: 75 } },
    { from: { x: 75, y: 65 }, to: { x: 50, y: 75 } }
  ];

  // Get all tasks in order
  const allTasks = Object.values(roadmapData).flat();

  const isTaskUnlocked = (taskId) => {
    // First task is always unlocked
    if (taskId === 1) return true;
    
    // Find the task and check prerequisites
    const taskIndex = allTasks.findIndex(task => task.id === taskId);
    if (taskIndex === 0) return true;
    
    // For this demo, we'll check if the previous task is completed
    // In a real app, you'd implement more complex prerequisite logic
    const previousTaskId = allTasks[taskIndex - 1]?.id;
    return completedTasks.has(previousTaskId);
  };

  const handleTaskClick = (taskId) => {
    if (isTaskUnlocked(taskId)) {
      // Navigate to task page using existing task system
      window.location.href = `/tasks/${taskId}`;
    }
  };

  const getTaskStatus = (taskId) => {
    if (completedTasks.has(taskId)) return 'completed';
    if (isTaskUnlocked(taskId)) return 'available';
    return 'locked';
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-[var(--difficulty-easy-bg)] text-[var(--difficulty-easy-text)]';
      case 'Medium': return 'bg-[var(--difficulty-medium-bg)] text-[var(--difficulty-medium-text)]';
      case 'Hard': return 'bg-[var(--difficulty-hard-bg)] text-[var(--difficulty-hard-text)]';
      default: return 'bg-[var(--difficulty-default-bg)] text-[var(--difficulty-default-text)]';
    }
  };

  useEffect(() => {
    setProgress((completedTasks.size / allTasks.length) * 100);
  }, [completedTasks, allTasks.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[var(--primary-bg)] to-[var(--secondary-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/roadmap"
              className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Roadmaps</span>
            </Link>
            
            <div className="text-center">
              <h1
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: "var(--heading-gradient)",
                }}
              >
                Web Fundamentals
              </h1>
              <p className="text-[var(--text-muted)] mt-2">Master HTML, CSS, and JavaScript</p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-[var(--text-muted)]">
                Progress: {completedTasks.size}/{allTasks.length}
              </div>              <div className="w-32 bg-[var(--progress-bg)] rounded-full h-2 mt-1">
                <div
                  className="bg-gradient-to-r from-[var(--progress-fill-from)] to-[var(--progress-fill-to)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>          {/* Roadmap Visualization */}
          <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-[var(--card-border)]">
            <motion.div
              className="relative w-full overflow-hidden"
              style={{ height: "1800px" }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* SVG for connections */}
              <svg
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: 1 }}
              >
                {connections.map((connection, index) => (
                  <motion.line
                    key={index}
                    x1={`${connection.from.x}%`}
                    y1={`${connection.from.y}%`}
                    x2={`${connection.to.x}%`}
                    y2={`${connection.to.y}%`}
                    stroke="var(--connection-stroke)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                ))}
              </svg>

              {/* Task Nodes */}
              {Object.entries(roadmapData).map(([level, tasks]) =>
                tasks.map((task, taskIndex) => {
                  const status = getTaskStatus(task.id);
                  const IconComponent = task.icon;
                  
                  return (
                    <motion.div
                      key={task.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                        status === 'available' ? 'cursor-pointer' : status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      style={{
                        left: `${task.x}%`,
                        top: `${task.y}%`,
                        zIndex: 2
                      }}
                      variants={nodeVariants}
                      whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
                      whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      {/* Task Circle */}
                      <div                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-300 ${
                          status === 'completed'
                            ? 'bg-[var(--status-completed-bg)] border-[var(--status-completed-border)] text-[var(--status-completed-text)]'
                            : status === 'available'
                            ? 'bg-[var(--status-available-bg)] border-[var(--status-available-border)] text-[var(--status-available-text)] hover:border-[var(--status-available-hover-border)]'
                            : 'bg-[var(--status-locked-bg)] border-[var(--status-locked-border)] text-[var(--status-locked-text)]'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : status === 'locked' ? (
                          <Lock className="w-6 h-6" />
                        ) : (
                          <IconComponent size={24} style={{ color: task.color }} />
                        )}
                      </div>

                      {/* Task Info Card */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-56 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[var(--text-color)]">{task.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                            {task.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mb-3">{task.description}</p>
                          {status === 'available' && (
                          <button className="w-full px-3 py-2 bg-[var(--button-primary-bg)] text-white rounded-md text-sm font-medium hover:bg-[var(--button-primary-hover)] transition-colors flex items-center justify-center space-x-2">
                            <Play className="w-4 h-4" />
                            <span>Start Task</span>
                          </button>
                        )}
                        
                        {status === 'completed' && (
                          <div className="w-full px-3 py-2 bg-[var(--button-success-bg)] text-white rounded-md text-sm font-medium flex items-center justify-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                        
                        {status === 'locked' && (
                          <div className="w-full px-3 py-2 bg-[var(--button-disabled-bg)] text-white rounded-md text-sm font-medium flex items-center justify-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>

          {/* Learning Path Overview */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">            <div className="bg-[var(--level-html-bg)] border border-[var(--level-html-border)] rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <SiHtml5 className="w-8 h-8" style={{ color: 'var(--tech-html-color)' }} />
                <h3 className="text-lg font-semibold text-[var(--level-html-heading)]">HTML Fundamentals</h3>
              </div>
              <p className="text-[var(--level-html-text)] text-sm mb-3">
                Learn the structure and semantic elements that form the backbone of web pages.
              </p>
              <ul className="text-sm text-[var(--level-html-list)] space-y-1">
                <li>• Document structure and semantics</li>
                <li>• Forms and input validation</li>
                <li>• Tables and data organization</li>
              </ul>
            </div>

            <div className="bg-[var(--level-css-bg)] border border-[var(--level-css-border)] rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <SiCss3 className="w-8 h-8" style={{ color: 'var(--tech-css-color)' }} />
                <h3 className="text-lg font-semibold text-[var(--level-css-heading)]">CSS Styling</h3>
              </div>
              <p className="text-[var(--level-css-text)] text-sm mb-3">
                Master styling, layouts, and responsive design for beautiful web interfaces.
              </p>
              <ul className="text-sm text-[var(--level-css-list)] space-y-1">
                <li>• Flexbox and Grid layouts</li>
                <li>• Responsive design patterns</li>
                <li>• Animations and transitions</li>
              </ul>
            </div>            <div className="bg-[var(--level-js-bg)] border border-[var(--level-js-border)] rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <SiJavascript className="w-8 h-8" style={{ color: 'var(--tech-js-color)' }} />
                <h3 className="text-lg font-semibold text-[var(--level-js-heading)]">JavaScript Interactivity</h3>
              </div>
              <p className="text-[var(--level-js-text)] text-sm mb-3">
                Add dynamic behavior and interactivity to your web applications.
              </p>
              <ul className="text-sm text-[var(--level-js-list)] space-y-1">
                <li>• Variables, functions, and logic</li>
                <li>• DOM manipulation</li>
                <li>• Event handling and user interaction</li>
              </ul>
            </div>
          </div>

          {/* Legend */}          <div className="mt-8 bg-[var(--legend-bg)] backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[var(--card-border)]">
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">Legend</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[var(--status-completed-bg)] rounded-full"></div>
                <span className="text-sm text-[var(--text-muted)]">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[var(--status-available-border)] rounded-full"></div>
                <span className="text-sm text-[var(--text-muted)]">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[var(--status-locked-bg)] rounded-full"></div>
                <span className="text-sm text-[var(--text-muted)]">Locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}