"use client";
import { motion } from "framer-motion";
import Header from "@/components/Header/Header";
import { SiHtml5, SiCss3, SiJavascript, SiReact } from "react-icons/si";
import { Code, Users, Target, Award } from "lucide-react";
import Link from "next/link";

export default function About() {
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[var(--primary-bg)] to-[var(--secondary-bg)] py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: "var(--heading-gradient)",
              }}
            >
              About WebWiz
            </h1>
            <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto">
              Empowering developers to master frontend development through interactive learning and real-world projects
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            className="grid md:grid-cols-2 gap-12 mb-20"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants} className="space-y-6">
              <h2 className="text-3xl font-bold text-[var(--text-color)]">Our Mission</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                At WebWiz, we believe in learning by doing. Our platform is designed to transform beginners into confident frontend developers through a carefully crafted curriculum that combines theoretical knowledge with hands-on practice.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We're committed to making frontend development accessible to everyone, providing a structured learning path that builds skills progressively while maintaining engagement through interactive challenges and real-world projects.
              </p>
            </motion.div>

            <motion.div variants={cardVariants} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 dark:border-purple-500/30 shadow-lg">
                <div className="flex items-center justify-center space-x-8 mb-8">
                  <SiHtml5 size={48} className="text-[#e34f26]" />
                  <SiCss3 size={48} className="text-[#264de4]" />
                  <SiJavascript size={48} className="text-[#f7df1e]" />
                  <SiReact size={48} className="text-[#61dafb]" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-500 mb-2">100+</div>
                    <div className="text-sm text-[var(--text-muted)]">Interactive Challenges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-2">50+</div>
                    <div className="text-sm text-[var(--text-muted)]">Real Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mb-2">24/7</div>
                    <div className="text-sm text-[var(--text-muted)]">Community Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-500 mb-2">1000+</div>
                    <div className="text-sm text-[var(--text-muted)]">Active Learners</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: <Code className="w-8 h-8 text-purple-600 dark:text-purple-500" />,
                title: "Interactive Learning",
                description: "Learn by solving real coding challenges and building projects that mirror industry scenarios."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600 dark:text-blue-500" />,
                title: "Community Driven",
                description: "Join a vibrant community of learners, share your progress, and get help when needed."
              },
              {
                icon: <Target className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />,
                title: "Structured Path",
                description: "Follow our carefully designed learning paths that take you from basics to advanced concepts."
              },
              {
                icon: <Award className="w-8 h-8 text-cyan-600 dark:text-cyan-500" />,
                title: "Skill Validation",
                description: "Earn certificates and badges as you progress through different levels of expertise."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 dark:border-purple-500/30 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[var(--text-color)] mb-2">{feature.title}</h3>
                <p className="text-[var(--text-muted)]">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-purple-500/20 dark:border-purple-500/30 shadow-lg">
                <h2 className="text-3xl font-bold text-[var(--text-color)] mb-4">Ready to Start Your Journey?</h2>
                <p className="text-[var(--text-muted)] mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who have transformed their careers through our platform. Start your frontend development journey today!
                </p>
                <Link href="/tasks" passHref legacyBehavior>
                  <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Get Started Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
