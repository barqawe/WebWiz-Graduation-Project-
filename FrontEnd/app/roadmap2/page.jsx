"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { SiHtml5, SiCss3, SiJavascript, SiReact } from "react-icons/si";
import { ArrowRight, Code, Layers, TreePine, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function RoadmapPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  const treeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[var(--primary-bg)] to-[var(--secondary-bg)] py-12">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: "var(--heading-gradient)",
              }}
            >
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto">
              Select your learning journey and master frontend development through our structured roadmaps. 
              Each path is designed to build your skills progressively with hands-on projects.
            </p>
          </motion.div>

          {/* Roadmap Selection Cards */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Web Fundamentals Path */}
            <motion.div
              variants={treeVariants}
              className="group relative"
            >
              <Link href="/roadmap/web-fundamentals">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 cursor-pointer overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-blue-50/50 dark:from-orange-900/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Header */}
                  <div className="relative flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full shadow-lg">
                        <Code className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[var(--text-color)]">Web Fundamentals</h3>
                        <p className="text-[var(--text-muted)]">HTML • CSS • JavaScript</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-[var(--text-muted)] group-hover:text-orange-600 group-hover:translate-x-2 transition-all duration-300" />
                  </div>

                  {/* Tech Stack Icons */}
                  <div className="relative flex justify-center space-x-8 mb-8">
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <SiHtml5 size={52} className="drop-shadow-lg" style={{ color: 'var(--tech-html-color)' }} />
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-orange-400/20"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: -10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <SiCss3 size={52} className="drop-shadow-lg" style={{ color: 'var(--tech-css-color)' }} />
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-blue-400/20"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <SiJavascript size={52} className="drop-shadow-lg" style={{ color: 'var(--tech-js-color)' }} />
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-yellow-400/20"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  </div>

                  {/* Animated Tree Preview */}
                  <div className="relative h-36 mb-6 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                    <TreeVisualization type="fundamentals" />
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <p className="text-center text-[var(--text-muted)] mb-6 leading-relaxed">
                      Master the building blocks of web development. Learn HTML structure, CSS styling, and JavaScript interactivity through progressive challenges.
                    </p>

                    {/* Stats */}                    <div className="flex justify-between text-sm text-[var(--text-muted)] bg-[var(--legend-bg)] backdrop-blur-sm rounded-lg p-4">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        15 Lessons
                      </span>
                      <span>10-15 Hours</span><span className="px-2 py-1 bg-[var(--difficulty-easy-bg)] text-[var(--difficulty-easy-text)] rounded-full text-xs font-medium">
                        Beginner
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* React Fundamentals Path */}
            <motion.div
              variants={treeVariants}
              className="group relative"
            >
              <Link href="/roadmap/react-fundamentals">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 cursor-pointer overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-purple-50/50 dark:from-cyan-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Header */}
                  <div className="relative flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-lg">
                        <Layers className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[var(--text-color)]">React Fundamentals</h3>
                        <p className="text-[var(--text-muted)]">React • Modern CSS</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-[var(--text-muted)] group-hover:text-cyan-600 group-hover:translate-x-2 transition-all duration-300" />
                  </div>

                  {/* Tech Stack Icons */}
                  <div className="relative flex justify-center space-x-8 mb-8">
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <SiReact size={52} className="drop-shadow-lg" style={{ color: 'var(--tech-react-color)' }} />
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-cyan-400/20"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: -10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <SiCss3 size={52} className="drop-shadow-lg" style={{ color: 'var(--tech-css-color)' }} />
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-blue-400/20"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  </div>

                  {/* Animated Tree Preview */}
                  <div className="relative h-36 mb-6 bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                    <TreeVisualization type="react" />
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <p className="text-center text-[var(--text-muted)] mb-6 leading-relaxed">
                      Build modern web applications with React. Learn components, state management, and advanced CSS techniques for interactive UIs.
                    </p>

                    {/* Stats */}                    <div className="flex justify-between text-sm text-[var(--text-muted)] bg-[var(--legend-bg)] backdrop-blur-sm rounded-lg p-4">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        12 Lessons
                      </span>
                      <span>12-18 Hours</span><span className="px-2 py-1 bg-[var(--difficulty-medium-bg)] text-[var(--difficulty-medium-text)] rounded-full text-xs font-medium">
                        Intermediate
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            variants={itemVariants}
          >
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 max-w-2xl mx-auto">
              <TreePine className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-lg text-[var(--text-muted)] mb-6">
                Not sure which path to choose? Start with <strong>Web Fundamentals</strong> if you're new to programming.
              </p>
              <Link href="/">                <button className="px-8 py-3 bg-[var(--button-secondary-bg)] text-[var(--text-color)] rounded-lg font-medium hover:bg-[var(--button-secondary-hover)] transition-all duration-300 hover:shadow-lg">
                  Back to Home
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

// Animated tree visualization component
function TreeVisualization({ type }) {
  // Helper function to get CSS variable values
  const getTechColor = (tech) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;      switch(tech) {
        case 'html': return getComputedStyle(root).getPropertyValue('--tech-html-color').trim();
        case 'css': return getComputedStyle(root).getPropertyValue('--tech-css-color').trim();
        case 'js': return getComputedStyle(root).getPropertyValue('--tech-js-color').trim();
        case 'react': return getComputedStyle(root).getPropertyValue('--tech-react-color').trim();
        default: return getComputedStyle(root).getPropertyValue('--tech-star-color').trim();
      }
    }
    // Fallback colors for SSR
    switch(tech) {
      case 'html': return 'var(--tech-html-color)';
      case 'css': return 'var(--tech-css-color)';
      case 'js': return 'var(--tech-js-color)';
      case 'react': return 'var(--tech-react-color)';
      default: return 'var(--tech-star-color)';
    }
  };

  const fundamentalsNodes = [
    { id: 1, x: 50, y: 10, color: getTechColor('html'), size: 5 },
    { id: 2, x: 20, y: 30, color: getTechColor('css'), size: 4 },
    { id: 3, x: 80, y: 30, color: getTechColor('js'), size: 4 },
    { id: 4, x: 10, y: 55, color: getTechColor('html'), size: 3 },
    { id: 5, x: 30, y: 55, color: getTechColor('css'), size: 3 },
    { id: 6, x: 70, y: 55, color: getTechColor('js'), size: 3 },
    { id: 7, x: 90, y: 55, color: getTechColor('html'), size: 3 },
    { id: 8, x: 25, y: 80, color: getTechColor('css'), size: 2 },
    { id: 9, x: 75, y: 80, color: getTechColor('js'), size: 2 }
  ];

  const reactNodes = [
    { id: 1, x: 50, y: 10, color: getTechColor('react'), size: 5 },
    { id: 2, x: 25, y: 30, color: getTechColor('react'), size: 4 },
    { id: 3, x: 75, y: 30, color: getTechColor('css'), size: 4 },
    { id: 4, x: 15, y: 50, color: getTechColor('react'), size: 3 },
    { id: 5, x: 35, y: 50, color: getTechColor('react'), size: 3 },
    { id: 6, x: 65, y: 50, color: getTechColor('css'), size: 3 },
    { id: 7, x: 85, y: 50, color: getTechColor('react'), size: 3 },
    { id: 8, x: 20, y: 70, color: getTechColor('react'), size: 2 },
    { id: 9, x: 50, y: 70, color: getTechColor('css'), size: 2 },
    { id: 10, x: 80, y: 70, color: getTechColor('react'), size: 2 }
  ];

  const nodes = type === "fundamentals" ? fundamentalsNodes : reactNodes;
  const connections = type === "fundamentals" 
    ? [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7], [5, 8], [6, 9]]
    : [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7], [4, 8], [5, 9], [6, 10]];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Connections */}
        {connections.map(([from, to], index) => {
          const fromNode = nodes.find(n => n.id === from);
          const toNode = nodes.find(n => n.id === to);
          return (
            <motion.line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="var(--connection-stroke)"
              strokeWidth="1.5"
              opacity="0.7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill={node.color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
              className="drop-shadow-sm"
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size + 2}
              fill="none"
              stroke={node.color}
              strokeWidth="1"
              opacity="0.3"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}