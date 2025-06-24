"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import styles from "./page.module.scss";
import useAuthStore from "@/store/authStore";
import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";

// Animation
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

export default function CreateTask() {
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    level: "",
    languages: "",
    designs: [],
    HTML: "",
    CSS: "",
    JS: "",
    React: "",
  });
  console.log("Initial formData:", formData);

  useEffect(() => {
    localStorage.setItem("createTaskFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const savedData = localStorage.getItem("createTaskFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          taskName: parsedData.taskName || "",
          description: parsedData.description || "",
          level: parsedData.level || "",
          languages: parsedData.languages || "",
          // Don't restore designs from localStorage as they can't be serialized properly
          // Don't restore optimal solution from localStorage as they can be large
        }));
      } catch (e) {
        console.error("Error loading saved form data:", e);
      }
    }
  }, []);

  // UI state
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleOptimalSolutionChange = (language, value) => {
    setFormData((prev) => ({
      ...prev,
      [language]: value,
    }));
  };
  // Handle language selection
  const handleLanguageChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      let currentLangs = prev.languages
        ? prev.languages.split(",").filter((lang) => lang)
        : [];

      // Selection rules
      if (checked) {
        if (value === "react") {
          currentLangs = currentLangs.filter(
            (lang) => lang !== "html" && lang !== "javascript"
          );
          currentLangs.push(value);
        } else if (value === "css") {
          // If selecting CSS, also select HTML if not already selected
          if (
            !currentLangs.includes("html") &&
            !currentLangs.includes("react")
          ) {
            currentLangs.push("html");
          }
          currentLangs.push(value);
        } else if (value === "javascript") {
          if (!currentLangs.includes("html")) {
            currentLangs.push("html");
          }
          if (currentLangs.includes("react")) {
            currentLangs = currentLangs.filter((lang) => lang !== "react");
          }

          currentLangs.push(value);
        } else if (value === "html" && currentLangs.includes("react")) {
          currentLangs = currentLangs.filter((lang) => lang !== "react");
          currentLangs.push(value);
        } else {
          currentLangs.push(value);
        }
      } else {
        // Removing a language
        if (value === "html") {
          currentLangs = currentLangs.filter(
            (lang) => lang !== "html" && lang !== "css" && lang !== "javascript"
          );
        } else {
          currentLangs = currentLangs.filter((lang) => lang !== value);
        }
      }

      const orderedLanguages = ["html", "css", "javascript", "react"];

      // Sorting languages based on orderedLanguages
      const sortedLangs = orderedLanguages.filter((lang) =>
        currentLangs.includes(lang)
      );

      return {
        ...prev,
        languages: sortedLangs.join(","),
      };
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        setMessage({ type: "error", text: "File size must be less than 5MB" });
        return;
      }

      const invalidTypes = files.filter(
        (file) => !["image/jpeg", "image/png"].includes(file.type)
      );
      if (invalidTypes.length > 0) {
        setMessage({
          type: "error",
          text: "Only JPG and PNG files are allowed",
        });
        return;
      }

      setFormData((prev) => ({ ...prev, designs: files }));

      const newPreviews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          setPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Reset previews when designs are removed
  useEffect(() => {
    if (formData.designs.length === 0) {
      setPreviews([]);
    }
  }, [formData.designs]);

  // Form validation
  const validateForm = () => {
    if (!formData.taskName || !formData.taskName.trim()) {
      console.log("Task name validation failed");
      setMessage({ type: "error", text: "Task name is required" });
      return false;
    }
    if (formData.taskName.length > 100) {
      setMessage({
        type: "error",
        text: "Task name must be less than 100 characters",
      });
      return false;
    }
    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Description is required" });
      return false;
    }
    if (formData.description.length > 1000) {
      setMessage({
        type: "error",
        text: "Description must be less than 1000 characters",
      });
      return false;
    }
    if (!formData.level) {
      setMessage({ type: "error", text: "Please select a task level" });
      return false;
    }
    if (!formData.languages) {
      setMessage({
        type: "error",
        text: "Please select at least one programming language",
      });
      return false;
    }

    // Language combination validation
    const selectedLanguages = formData.languages.split(",");

    // Valid combinations:
    // 1. React alone or with CSS
    // 2. HTML alone or with CSS and/or JavaScript
    const hasReact = selectedLanguages.includes("react");
    const hasHtml = selectedLanguages.includes("html");
    const hasCss = selectedLanguages.includes("css");
    const hasJs = selectedLanguages.includes("javascript");

    if (hasCss && !hasReact && !hasHtml) {
      setMessage({
        type: "error",
        text: "CSS cannot be selected alone. It must be with React or HTML.",
      });
      return false;
    }

    if (hasJs && !hasHtml) {
      setMessage({
        type: "error",
        text: "JavaScript cannot be selected alone. It must be with HTML.",
      });
      return false;
    }

    if (hasReact && (hasHtml || hasJs)) {
      setMessage({
        type: "error",
        text: "React cannot be combined with HTML or JavaScript.",
      });
      return false;
    }

    if (formData.designs.length === 0) {
      setMessage({
        type: "error",
        text: "Please upload at least one design image",
      });
      return false;
    } // Validate optimal solution
    if (hasHtml && !formData.HTML.trim()) {
      setMessage({
        type: "error",
        text: "HTML optimal solution is required",
      });
      return false;
    }

    if (hasCss && !formData.CSS.trim()) {
      setMessage({
        type: "error",
        text: "CSS optimal solution is required",
      });
      return false;
    }

    if (hasJs && !formData.JS.trim()) {
      setMessage({
        type: "error",
        text: "JavaScript optimal solution is required",
      });
      return false;
    }

    if (hasReact && !formData.React.trim()) {
      setMessage({
        type: "error",
        text: "React optimal solution is required",
      });
      return false;
    }

    return true;
  };

  // Touch navigation variables
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  // Touch handlers for swipe navigation
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Left swipe - go to next step
    if (isLeftSwipe && currentStep < totalSteps - 1 && canProceed()) {
      goToNextStep();
    }

    // Right swipe - go to previous step
    if (isRightSwipe && currentStep > 0) {
      goToPrevStep();
    }

    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      // Validate current step before proceeding
      if (!validateCurrentStep()) return;

      setCurrentStep(currentStep + 1);
      // Clear any error messages when moving to next step
      setMessage({ type: "", text: "" });

      // Set focus to the next input after render
      setTimeout(() => {
        const activeStepEl = document.querySelector(`.${styles.activeStep}`);
        if (activeStepEl) {
          const focusableEl = activeStepEl.querySelector(
            "input, textarea, select, button"
          );
          if (focusableEl) {
            focusableEl.focus();
          }
        }
      }, 50);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Set focus to the previous input after render
      setTimeout(() => {
        const activeStepEl = document.querySelector(`.${styles.activeStep}`);
        if (activeStepEl) {
          const focusableEl = activeStepEl.querySelector(
            "input, textarea, select, button"
          );
          if (focusableEl) {
            focusableEl.focus();
          }
        }
      }, 50);
    }
  };

  // Keyboard navigation handler
  const handleKeyNavigation = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      goToNextStep();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      goToPrevStep();
    }
  };
  // Check if current step is valid before proceeding
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Task Name
        return (
          formData.taskName &&
          formData.taskName.trim() &&
          formData.taskName.length <= 100
        );
      case 1: // Description
        return (
          formData.description &&
          formData.description.trim() &&
          formData.description.length <= 1000
        );
      case 2: // Level
        return formData.level !== "";
      case 3: // Languages
        return formData.languages !== "";
      case 4: // Designs
        return formData.designs.length > 0;
      case 5: // Optimal Solution
        const selectedLanguages = formData.languages.split(",");
        const hasReact = selectedLanguages.includes("react");
        const hasHtml = selectedLanguages.includes("html");
        const hasCss = selectedLanguages.includes("css");
        const hasJs = selectedLanguages.includes("javascript");
        if (hasHtml && !formData.HTML.trim()) return false;
        if (hasCss && !formData.CSS.trim()) return false;
        if (hasJs && !formData.JS.trim()) return false;
        if (hasReact && !formData.React.trim()) return false;
        return true;
      default:
        return true;
    }
  };

  // Validate current step and show specific error messages
  const validateCurrentStep = () => {
    setMessage({ type: "", text: "" });

    switch (currentStep) {
      case 0: // Task Name
        if (!formData.taskName || !formData.taskName.trim()) {
          setMessage({ type: "error", text: "Task name is required" });
          return false;
        }
        if (formData.taskName.length > 100) {
          setMessage({
            type: "error",
            text: "Task name must be less than 100 characters",
          });
          return false;
        }
        return true;

      case 1: // Description
        if (!formData.description.trim()) {
          setMessage({ type: "error", text: "Description is required" });
          return false;
        }
        if (formData.description.length > 1000) {
          setMessage({
            type: "error",
            text: "Description must be less than 1000 characters",
          });
          return false;
        }
        return true;

      case 2: // Level
        if (!formData.level) {
          setMessage({ type: "error", text: "Please select a task level" });
          return false;
        }
        return true;

      case 3: // Languages
        if (!formData.languages) {
          setMessage({
            type: "error",
            text: "Please select at least one programming language",
          });
          return false;
        }

        // Language combination validation
        const selectedLanguages = formData.languages.split(",");
        const hasReact = selectedLanguages.includes("react");
        const hasHtml = selectedLanguages.includes("html");
        const hasCss = selectedLanguages.includes("css");
        const hasJs = selectedLanguages.includes("javascript");

        // Check for invalid combinations
        if (hasCss && !hasReact && !hasHtml) {
          setMessage({
            type: "error",
            text: "CSS cannot be selected alone. It must be with React or HTML.",
          });
          return false;
        }

        if (hasJs && !hasHtml) {
          setMessage({
            type: "error",
            text: "JavaScript cannot be selected alone. It must be with HTML.",
          });
          return false;
        }

        if (hasReact && (hasHtml || hasJs)) {
          setMessage({
            type: "error",
            text: "React cannot be combined with HTML or JavaScript.",
          });
          return false;
        }

        return true;
      case 4: // Designs
        if (formData.designs.length === 0) {
          setMessage({
            type: "error",
            text: "Please upload at least one design image",
          });
          return false;
        }
        return true;

      case 5: // Optimal Solution
        const selectedLangs = formData.languages.split(",");
        const hasReactSolution = selectedLangs.includes("react");
        const hasHtmlSolution = selectedLangs.includes("html");
        const hasCssSolution = selectedLangs.includes("css");
        const hasJsSolution = selectedLangs.includes("javascript");
        if (hasHtmlSolution && !formData.HTML.trim()) {
          setMessage({
            type: "error",
            text: "HTML optimal solution is required",
          });
          return false;
        }

        if (hasCssSolution && !formData.CSS.trim()) {
          setMessage({
            type: "error",
            text: "CSS optimal solution is required",
          });
          return false;
        }

        if (hasJsSolution && !formData.JS.trim()) {
          setMessage({
            type: "error",
            text: "JavaScript optimal solution is required",
          });
          return false;
        }
        if (hasReactSolution && !formData.React.trim()) {
          setMessage({
            type: "error",
            text: "React optimal solution is required",
          });
          return false;
        }

        return true;
      default:
        return true;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) return;

    setLoading(true);
    const submitData = new FormData(); // Append all form data
    submitData.append("Name", formData.taskName.trim());
    submitData.append("Description", formData.description.trim());
    submitData.append("Level", formData.level);
    submitData.append("Programming_Language", formData.languages.trim());
    submitData.append("HTML", formData.HTML || "Pending");
    submitData.append("CSS", formData.CSS || "Pending");
    submitData.append("JS", formData.JS || "Pending");
    submitData.append("React", formData.React || "Pending");
    // Design files
    formData.designs.forEach((file, index) => {
      submitData.append("designs", file);
    });

    try {
      const response = await fetch(
        "http://localhost:5046/api/Design-Task/CreateTask",
        {
          method: "POST",
          body: submitData,
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage =
            errorData.message || errorData.error || "Submission failed";
        } else {
          errorMessage = await response.text();
        }

        throw new Error(
          errorMessage || `HTTP error! status: ${response.status}`
        );
      }

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      setMessage({ type: "success", text: "Task submitted successfully!" });
      localStorage.removeItem("createTaskFormData");
      setFormData({
        taskName: "",
        description: "",
        level: "",
        languages: "",
        designs: [],
        html: "",
        css: "",
        javascript: "",
        react: "",
      });
      setPreviews([]);
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to submit task. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={styles.container}
      onKeyDown={handleKeyNavigation}
      tabIndex="0"
    >
      <Header />

      <motion.div
        className={styles.formContainer}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <form
          onSubmit={handleSubmit}
          className={styles.form}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h1>Create New Task</h1>
          {/* Progress indicator */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>{" "}
            <div className={styles.stepsLabels}>
              {[
                "Task Name",
                "Description",
                "Level",
                "Languages",
                "Design",
                "Solution",
              ].map((label, index) => (
                <div
                  key={index}
                  className={`${styles.stepLabel} ${
                    currentStep >= index ? styles.completed : ""
                  }`}
                  onClick={() =>
                    index <= currentStep ? setCurrentStep(index) : null
                  }
                >
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <span className={styles.stepText}>{label}</span>
                </div>
              ))}
            </div>
            <div className={styles.stepCounter}>
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>

          {/* Form Steps Container */}
          <div className={styles.stepsContainer}>
            {/* Step 1: Task Name */}
            <div
              className={`${styles.formStep} ${
                currentStep === 0 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.formGroup}>
                <label htmlFor="taskName">Task Name *</label>
                <input
                  type="text"
                  id="taskName"
                  name="taskName"
                  value={formData.taskName || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                  placeholder="Enter task name"
                  autoFocus={currentStep === 0}
                  required
                />
                <span className={styles.charCount}>
                  {(formData.taskName || "").length}/100
                </span>
              </div>
            </div>
            {/* Step 2: Description */}
            <div
              className={`${styles.formStep} ${
                currentStep === 1 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.formGroup}>
                <label htmlFor="description">Task Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={1000}
                  placeholder="Enter task description"
                  autoFocus={currentStep === 1}
                  required
                />
                <span className={styles.charCount}>
                  {formData.description.length}/1000
                </span>
              </div>
            </div>
            {/* Step 3: Task Level */}
            <div
              className={`${styles.formStep} ${
                currentStep === 2 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.formGroup}>
                <label>Task Level *</label>
                <div className={styles.radioGroup}>
                  {["Beginner", "Intermediate", "Advanced", "Wizzard"].map(
                    (level) => (
                      <label key={level} className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="level"
                          value={level.toLowerCase()}
                          checked={formData.level === level.toLowerCase()}
                          onChange={handleInputChange}
                          required
                        />
                        {level}
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
            {/* Step 4: Programming Languages */}
            <div
              className={`${styles.formStep} ${
                currentStep === 3 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.formGroup}>
                <label>Programming Languages *</label>
                <div className={styles.checkboxGroup}>
                  {["JavaScript", "HTML", "CSS", "React"].map((lang) => (
                    <label key={lang} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang.toLowerCase()}
                        checked={formData.languages
                          .split(",")
                          .includes(lang.toLowerCase())}
                        onChange={handleLanguageChange}
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>
            </div>{" "}
            {/* Step 5: Design Upload */}
            <div
              className={`${styles.formStep} ${
                currentStep === 4 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.formGroup}>
                <label htmlFor="designs">Design Upload *</label>
                <input
                  type="file"
                  id="designs"
                  name="designs"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageUpload}
                  multiple
                  required
                />
                {previews.length > 0 && (
                  <div className={styles.previewContainer}>
                    {previews.map((preview, index) => (
                      <div key={index} className={styles.preview}>
                        <img
                          src={preview}
                          alt={`Design preview ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Step 6: Optimal Solution */}
            <div
              className={`${styles.formStep} ${
                currentStep === 5 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.formGroup}>
                <label>Optimal Solution *</label>
                <div className={styles.optimalSolutionContainer}>
                  {" "}
                  {formData.languages.split(",").map((language) => {
                    if (!language) return null;

                    const languageMap = {
                      html: { name: "HTML", mode: "html", property: "HTML" },
                      css: { name: "CSS", mode: "css", property: "CSS" },
                      javascript: {
                        name: "JavaScript",
                        mode: "javascript",
                        property: "JS",
                      },
                      react: {
                        name: "React",
                        mode: "javascript",
                        property: "React",
                      },
                    };

                    const langConfig = languageMap[language.trim()];
                    if (!langConfig) return null;

                    return (
                      <div key={language} className={styles.editorSection}>
                        <h4>{langConfig.name} Solution</h4>{" "}
                        <div className={styles.monacoContainer}>
                          <Editor
                            height="300px"
                            language={langConfig.mode}
                            value={formData[langConfig.property] || ""}
                            onChange={(value) =>
                              handleOptimalSolutionChange(
                                langConfig.property,
                                value || ""
                              )
                            }
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              automaticLayout: true,
                              wordWrap: "on",
                              lineNumbers: "on",
                              scrollBeyondLastLine: false,
                              theme: "vs-dark",
                            }}
                            theme="vs-dark"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {/* {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )} */}

          {/* Navigation Controls */}
          <div className={styles.navigationControls}>
            <button
              type="button"
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={goToPrevStep}
              disabled={currentStep === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Previous
            </button>
            {currentStep < totalSteps - 1 ? (
              <button
                type="button"
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={goToNextStep}
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Task"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: "8px" }}
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <Footer />
    </div>
  );
}
