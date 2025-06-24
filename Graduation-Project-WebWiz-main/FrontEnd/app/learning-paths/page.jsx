"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { SiHtml5, SiCss3, SiJavascript, SiReact } from "react-icons/si";
import { ArrowRight, Code, Palette, Users, Clock } from "lucide-react";
import Link from "next/link";

// Animation variants
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
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function LearningPaths() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--primary-bg)] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <h1
              className="text-5xl md:text-6xl font-bold mb-3 pb-3 bg-clip-text text-transparent"
              style={{
                backgroundImage: "var(--heading-gradient)",
              }}
            >
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto">
              Select the perfect roadmap to start your frontend development
              journey. Each path is carefully designed to build your skills
              progressively.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {/* HTML, CSS & JavaScript Path */}
            <motion.div
              className="relative group"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-blue-500 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div
                className="relative rounded-2xl p-8 shadow-xl border"
                style={{
                  backgroundColor: "var(--card-bg-white)",
                  borderColor: "var(--card-border-gray)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="flex space-x-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <SiHtml5 size={48} className="text-[#e34f26]" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <SiCss3 size={48} className="text-[#264de4]" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <SiJavascript size={48} className="text-[#f7df1e]" />
                    </motion.div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-center mb-4 text-[var(--text-color)]">
                  Frontend Fundamentals
                </h3>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "var(--badge-green-bg)",
                      color: "var(--badge-green-text)",
                    }}
                  >
                    <Code size={16} className="mr-2" />
                    Beginner Friendly
                  </span>
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "var(--badge-blue-bg)",
                      color: "var(--badge-blue-text)",
                    }}
                  >
                    <Clock size={16} className="mr-2" />
                    20+ Hours
                  </span>
                </div>

                <p className="text-[var(--text-muted)] mb-6 text-center">
                  Master the core technologies of web development. Build
                  responsive websites and interactive user interfaces from
                  scratch.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-[#e34f26] rounded-full mr-3"></div>
                    <span>HTML5 Structure & Semantics</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-[#264de4] rounded-full mr-3"></div>
                    <span>CSS3 Styling & Layouts</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-[#f7df1e] rounded-full mr-3"></div>
                    <span>JavaScript Programming</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span>DOM Manipulation & Events</span>
                  </div>
                </div>

                <Link href="/roadmap/fundamentals">
                  <motion.button
                    className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium transition-all transform flex items-center justify-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Fundamentals Path
                    <ArrowRight
                      size={18}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* React & CSS Path */}
            <motion.div
              className="relative group"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div
                className="relative rounded-2xl p-8 shadow-xl border"
                style={{
                  backgroundColor: "var(--card-bg-white)",
                  borderColor: "var(--card-border-gray)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="flex space-x-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <SiReact size={48} className="text-[#61dafb]" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <SiCss3 size={48} className="text-[#264de4]" />
                    </motion.div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-center mb-4 text-[var(--text-color)]">
                  React Development
                </h3>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "var(--badge-red-bg)",
                      color: "var(--badge-red-text)",
                    }}
                  >
                    <Palette size={16} className="mr-2" />
                    Advanced Level
                  </span>
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "var(--badge-purple-bg)",
                      color: "var(--badge-purple-text)",
                    }}
                  >
                    <Users size={16} className="mr-2" />
                    25+ Hours
                  </span>
                </div>

                <p className="text-[var(--text-muted)] mb-6 text-center">
                  Build modern, dynamic web applications with React. Learn
                  component-based architecture and state management.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-[#61dafb] rounded-full mr-3"></div>
                    <span>React Components & JSX</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span>State Management & Hooks</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-[#264de4] rounded-full mr-3"></div>
                    <span>Advanced CSS & Styling</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span>API Integration & Routing</span>
                  </div>
                </div>

                <Link href="/roadmap/react">
                  <motion.button
                    className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium transition-all transform flex items-center justify-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start React Path
                    <ArrowRight
                      size={18}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            transition={{ delay: 0.6 }}
          >
            <p className="text-[var(--text-muted)]">
              Not sure which path to choose? Start with Frontend Fundamentals to
              build a solid foundation.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
