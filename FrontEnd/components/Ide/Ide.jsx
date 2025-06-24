"use client";
import { useState, useEffect, useRef } from "react";
import * as Babel from "@babel/standalone";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import style from "./ide.module.scss";
import Image from "next/image";
import useAuthStore from "@/store/authStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2canvas from "html2canvas";
import ResizeHandle from "@/components/UI/ResizeHandle/ResizeHandle";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaTasks,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdOpenInNew,
  MdLogout,
  MdArrowBackIos,
  MdArrowForwardIos,
} from "react-icons/md";

//lets change this to somthing more meaningful wessam !!!!!!!
const defaultState = {
  files: {
    normal: {
      html: {
        name: "index.html",
        content:
          "<div><h1>Welcome to HTML Editor</h1><p>Start editing!</p></div>",
        language: "html",
      },
      css: {
        name: "styles.css",
        content: "/* Your CSS here */",
        language: "css",
      },
      js: {
        name: "script.js",
        content: "// Your JavaScript here",
        language: "javascript",
      },
    },
    react: {
      jsx: {
        name: "App.jsx",
        content:
          "function App() { return <div><h1>Welcome to React</h1><p>Edit this component</p></div>; } ",
        language: "javascript",
      },
      css: {
        name: "styles.css",
        content: "/* Your React CSS here */",
        language: "css",
      },
    },
  },
  activeFile: "html",
  leftPanelWidth: 250,
  rightPanelWidth: 400,
  showOutput: true,
  isLeftPanelCollapsed: false,
  initialLeftPanelWidth: null,
  initialRightPanelWidth: null,
};

export default function Ide({
  useReact = false,
  taskData = null,
  taskId = null,
  userId = null,
  theme = "dark",
  isPlaygroundMode = false,
}) {
  const [state, setState] = useState({
    ...defaultState,
    activeFile: useReact ? "jsx" : "html",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [resizePreview, setResizePreview] = useState(null);  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);

  useEffect(() => {
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);
  const iframeRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const latestStateRef = useRef(state);
  const outputContainerRef = useRef(null);
  const router = useRouter();
  const [editorTheme, setEditorTheme] = useState("vs-dark");

  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);

  const getStorageKey = () =>
    userId && taskId ? `editorState_${userId}_${taskId}` : null;

  useEffect(() => {
    setIsMounted(true);
    const storageKey = getStorageKey();
    if (storageKey) {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setState((prev) => ({
            ...prev,
            files: parsedState.files,
            activeFile: useReact ? "jsx" : "html",
          }));
        } catch (error) {
          console.error("Error loading saved state:", error);
        }
      }
    }
  }, [userId, taskId, useReact]);

  useEffect(() => {
    if (!isMounted) return;

    const storageKey = getStorageKey();
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.error("Error saving state:", error);
      }
    }
  }, [isMounted, state, userId, taskId]);

  useEffect(() => {
    if (state.showOutput && isMounted) {
      updateOutput(state);
    }
  }, [state.showOutput, isMounted]);

  useEffect(() => {
    if (isFullScreenPreview && isMounted) {
      updateFullScreenOutput(state);
    }
  }, [isFullScreenPreview, isMounted, state]);

  const getFileIcon = (fileName) => {
    const icons = {
      html: <FaHtml5 className={style.fileIcon} color="#e34f26" />,
      css: <FaCss3Alt className={style.fileIcon} color="#264de4" />,
      js: <FaJs className={style.fileIcon} color="#f7df1e" />,
      jsx: <FaReact className={style.fileIcon} color="#61dafb" />,
    };
    return icons[fileName.split(".").pop().toLowerCase()] || icons.js;
  };

  const updateOutput = (currentState) => {
    if (!currentState || !currentState.files) return;

    const outputContainer = document.getElementById("output-container");
    if (!outputContainer) return;

    try {
      let iframe = iframeRef.current;
      if (!iframe) {
        iframe = document.createElement("iframe");
        Object.assign(iframe.style, {
          width: "100%",
          height: "100%",
          border: "none",
          // Add pointer-events control for resizing
          pointerEvents: isResizing ? "none" : "auto",
        });
        outputContainer.appendChild(iframe);
        iframeRef.current = iframe;
      } else {
        // Update pointer events based on resizing state
        iframe.style.pointerEvents = isResizing ? "none" : "auto";
      }

      const mode = useReact ? "react" : "normal";
      const content =
        currentState.files[mode][currentState.activeFile]?.content || "";

      if (useReact) {
        if (currentState.activeFile === "css") {
          try {
            const jsxContent = currentState.files.react.jsx.content;
            const transformedCode = Babel.transform(jsxContent, {
              presets: ["react"],
              plugins: ["transform-modules-commonjs"],
            }).code;

            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; } ${content}</style>
              </head>
              <body>
                <div id="root"></div>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script>
                  const { 
                    useState, 
                    useEffect, 
                    useContext, 
                    useReducer, 
                    useCallback, 
                    useMemo, 
                    useRef, 
                    useImperativeHandle, 
                    useLayoutEffect, 
                    useDebugValue 
                  } = React;
                  try {
                    ${transformedCode}
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(React.createElement(App));
                  } catch(err) {
                    document.getElementById('root').innerHTML = 
                      '<div style="color:red;padding:20px;background:white;border:1px solid #eee">' +
                      '<h2>Error</h2><pre>' + err.message + '</pre></div>';
                  }
                </script>
              </body>
              </html>
            `;

            if (iframe.srcdoc !== htmlContent) {
              iframe.srcdoc = htmlContent;
            }
          } catch (error) {
            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; } ${content}</style>
              </head>
              <body>
                <div style="padding: 20px;">
                  <h2>CSS Preview</h2>
                  <p>This is a preview of your CSS styles. The actual React component will use these styles.</p>
                </div>
              </body>
              </html>
            `;
            if (iframe.srcdoc !== htmlContent) {
              iframe.srcdoc = htmlContent;
            }
          }
        } else {
          try {
            const transformedCode = Babel.transform(content, {
              presets: ["react"],
              plugins: ["transform-modules-commonjs"],
            }).code;

            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; } ${currentState.files.react.css.content}</style>
              </head>
              <body>
                <div id="root"></div>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script>
                  const { 
                    useState, 
                    useEffect, 
                    useContext, 
                    useReducer, 
                    useCallback, 
                    useMemo, 
                    useRef, 
                    useImperativeHandle, 
                    useLayoutEffect, 
                    useDebugValue 
                  } = React;
                  try {
                    ${transformedCode}
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(React.createElement(App));
                  } catch(err) {
                    document.getElementById('root').innerHTML = 
                      '<div style="color:red;padding:20px;background:white;border:1px solid #eee">' +
                      '<h2>Error</h2><pre>' + err.message + '</pre></div>';
                  }
                </script>
              </body>
              </html>
            `;
            if (iframe.srcdoc !== htmlContent) {
              iframe.srcdoc = htmlContent;
            }
          } catch (error) {
            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; }</style>
              </head>
              <body>
                <div style="color:red;padding:20px;background:white;border:1px solid #eee">
                  <h2>Compilation Error</h2>
                  <pre>${error.message}</pre>
                </div>
              </body>
              </html>
            `;
            if (iframe.srcdoc !== htmlContent) {
              iframe.srcdoc = htmlContent;
            }
          }
        }
      } else {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; } ${currentState.files.normal.css.content}</style>
          </head>
          <body>
            ${currentState.files.normal.html.content}
            <script>${currentState.files.normal.js.content}</script>
          </body>
          </html>
        `;
        if (iframe.srcdoc !== htmlContent) {
          iframe.srcdoc = htmlContent;
        }
      }    } finally {
      setTimeout(() => {
        updateOutput.isUpdating = false;
      }, 0);
    }
    
    // Also update full screen if it's open
    updateFullScreenOutput(currentState);
  };

  const handleContentChange = (value) => {
    const mode = useReact ? "react" : "normal";

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    //for the delay in the output
    setState((prev) => {
      const newState = {
        ...prev,
        files: {
          ...prev.files,
          [mode]: {
            ...prev.files[mode],
            [prev.activeFile]: {
              ...prev.files[mode][prev.activeFile],
              content: value || "",
            },
          },
        },
      };

      if (prev.showOutput) {
        debounceTimeoutRef.current = setTimeout(() => {
          if (latestStateRef.current.showOutput) {
            updateOutput(latestStateRef.current);
          }
          debounceTimeoutRef.current = null;
        }, 1500);
      }

      return newState;
    });
  };

  useEffect(() => {
    if (state.showOutput) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      updateOutput(state);
    }
  }, [state.showOutput]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, []);

  //getTask by ID

  const handleFileClick = (fileKey) => {
    const mode = useReact ? "react" : "normal";
    if (state.files[mode][fileKey]) {
      setState((prev) => ({ ...prev, activeFile: fileKey }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("Submitting...");

    try {
      const mode = useReact ? "react" : "normal";
      const formData = new FormData();
      
      if (useReact) {
        formData.append('JSX', state.files.react.jsx.content);
        formData.append('CSS', state.files.react.css.content);
      } else {
        formData.append('HTML', state.files.normal.html.content);
        formData.append('CSS', state.files.normal.css.content);
        formData.append('JS', state.files.normal.js.content);
      }
      
      formData.append('ID', taskId);

      // Wait for the output to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capture screenshot of the iframe content
      const outputContainer = document.getElementById('output-container');
      const iframe = outputContainer?.querySelector('iframe');
      
      if (iframe) {
        try {
          // Wait for iframe to load if it hasn't already
          if (!iframe.contentDocument.body) {
            await new Promise(resolve => {
              iframe.onload = resolve;
            });
          }

          // Additional wait to ensure content is fully rendered
          await new Promise(resolve => setTimeout(resolve, 500));

          // Create a temporary div to hold the iframe content
          const tempDiv = document.createElement('div');
          tempDiv.style.width = iframe.contentDocument.body.scrollWidth + 'px';
          tempDiv.style.height = iframe.contentDocument.body.scrollHeight + 'px';
          tempDiv.style.position = 'absolute';
          tempDiv.style.left = '-9999px';
          tempDiv.style.top = '-9999px';
          document.body.appendChild(tempDiv);

          // Clone the iframe content to our temporary div
          const clonedContent = iframe.contentDocument.body.cloneNode(true);
          
          // Get all stylesheets from the iframe
          const stylesheets = Array.from(iframe.contentDocument.styleSheets);
          const styleElement = document.createElement('style');
          
          // Process each stylesheet
          for (const sheet of stylesheets) {
            try {
              const rules = Array.from(sheet.cssRules);
              const cssText = rules.map(rule => rule.cssText).join('\n');
              styleElement.textContent += cssText + '\n';
            } catch (e) {
              console.warn('Could not access stylesheet rules:', e);
            }
          }

          // Add the styles to the cloned content
          clonedContent.insertBefore(styleElement, clonedContent.firstChild);
          
          // Add inline styles from the original body
          const originalStyles = iframe.contentDocument.body.getAttribute('style');
          if (originalStyles) {
            clonedContent.setAttribute('style', originalStyles);
          }

          // Get computed background color from the iframe body
          const computedStyle = window.getComputedStyle(iframe.contentDocument.body);
          const backgroundColor = computedStyle.backgroundColor;
          
          // Set background color on both the temp div and cloned content
          tempDiv.style.backgroundColor = backgroundColor;
          clonedContent.style.backgroundColor = backgroundColor;
          
          tempDiv.appendChild(clonedContent);

          // Capture the screenshot with a slight delay to ensure styles are applied
          await new Promise(resolve => setTimeout(resolve, 100));

          const canvas = await html2canvas(tempDiv, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: backgroundColor, // Use the computed background color
            scale: 2, // Higher quality
            width: tempDiv.offsetWidth,
            height: tempDiv.offsetHeight,
            logging: true, // Enable logging for debugging
            onclone: (clonedDoc) => {
              // Ensure styles are properly applied in the cloned document
              const clonedElement = clonedDoc.querySelector('div');
              if (clonedElement) {
                clonedElement.style.backgroundColor = backgroundColor;
              }
            }
          });

          // Clean up the temporary div
          document.body.removeChild(tempDiv);

          // Convert canvas to blob
          const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', 1.0);
          });

          if (blob) {
            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result;
              formData.append('SubmittedImage', base64data);
              
              // Store the form data in localStorage
              const formDataObj = {};
              for (let pair of formData.entries()) {
                formDataObj[pair[0]] = pair[1];
              }
              
              localStorage.setItem(
                `codeToSubmit_${userId}_${taskId}`,
                JSON.stringify(formDataObj)
              );

              router.push(`/tasks/${taskId}/validation`);
            };
          } else {
            console.error('Failed to create blob from canvas');
            setIsSubmitting(false);
          }
        } catch (error) {
          console.error('Error capturing iframe screenshot:', error);
          setIsSubmitting(false);
        }
      } else {
        console.error('No iframe found in output container');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setSubmitStatus("Error submitting code");
      setIsSubmitting(false);
    }
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  const handleBack = () => {
      router.push("/");
    
  };

  const openImagePreview = (imageUrl, index) => {
    setPreviewImage(imageUrl);
    setCurrentImageIndex(index);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const navigateImage = (direction) => {
    if (!taskData || !taskData.designs) return;

    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = taskData.designs.length - 1;
    if (newIndex >= taskData.designs.length) newIndex = 0;

    setCurrentImageIndex(newIndex);
    setPreviewImage(taskData.designs[newIndex]);
  };
  useEffect(() => {
    if (theme === "dark") setEditorTheme("vs-dark");
    else setEditorTheme("vs");
  }, [theme]);

  useEffect(() => {
    // Update iframe pointer events when resizing state changes
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = isResizing ? "none" : "auto";
    }
  }, [isResizing]);
  const handleVerticalResize = (delta, { minSize, maxSize, isResizing }) => {
    if (isResizing !== undefined) {
      setIsResizing(isResizing);
      if (!isResizing) return; // If resizing ended, don't update size
    }

    // Store initial width when resizing starts
    if (isResizing && !state.initialLeftPanelWidth) {
      setState((prev) => ({
        ...prev,
        initialLeftPanelWidth: prev.leftPanelWidth,
      }));
      return;
    }

    const initialWidth = state.leftPanelWidth;
    const newWidth = initialWidth + delta;

    if (newWidth >= minSize && newWidth <= maxSize) {
      setState((prev) => ({
        ...prev,
        leftPanelWidth: newWidth,
        // Clear initial width when resizing ends
        ...(isResizing === false && { initialLeftPanelWidth: null }),
      }));
    }
  };
  const handleRightPanelResize = (delta, { minSize, maxSize, isResizing }) => {
    if (isResizing !== undefined) {
      setIsResizing(isResizing);
      if (!isResizing) return; // If resizing ended, don't update size
    }

    // Store initial width when resizing starts
    if (isResizing && !state.initialRightPanelWidth) {
      setState((prev) => ({
        ...prev,
        initialRightPanelWidth: prev.rightPanelWidth,
      }));
      return;
    }

    const initialWidth = state.rightPanelWidth;
    const newWidth = initialWidth - delta; // Subtract because we're resizing from the left

    if (newWidth >= minSize && newWidth <= maxSize) {
      setState((prev) => ({
        ...prev,
        rightPanelWidth: newWidth,
        // Clear initial width when resizing ends
        ...(isResizing === false && { initialRightPanelWidth: null }),
      }));
    }
  };

  const updateFullScreenOutput = (currentState) => {
    if (!currentState || !currentState.files || !isFullScreenPreview) return;

    const fullScreenContainer = document.getElementById("fullscreen-output-container");
    if (!fullScreenContainer) return;

    try {
      let iframe = fullScreenContainer.querySelector('iframe');
      if (!iframe) {
        iframe = document.createElement("iframe");
        Object.assign(iframe.style, {
          width: "100%",
          height: "100%",
          border: "none",
        });
        fullScreenContainer.appendChild(iframe);
      }

      const mode = useReact ? "react" : "normal";
      const content =
        currentState.files[mode][currentState.activeFile]?.content || "";

      if (useReact) {
        if (currentState.activeFile === "css") {
          try {
            const jsxContent = currentState.files.react.jsx.content;
            const transformedCode = Babel.transform(jsxContent, {
              presets: ["react"],
              plugins: ["transform-modules-commonjs"],
            }).code;

            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; } ${content}</style>
              </head>
              <body>
                <div id="root"></div>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script>
                  const { 
                    useState, 
                    useEffect, 
                    useContext, 
                    useReducer, 
                    useCallback, 
                    useMemo, 
                    useRef, 
                    useImperativeHandle, 
                    useLayoutEffect, 
                    useDebugValue 
                  } = React;
                  try {
                    ${transformedCode}
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(React.createElement(App));
                  } catch(err) {
                    document.getElementById('root').innerHTML = 
                      '<div style="color:red;padding:20px;background:white;border:1px solid #eee">' +
                      '<h2>Error</h2><pre>' + err.message + '</pre></div>';
                  }
                </script>
              </body>
              </html>
            `;

            if (iframe.srcdoc !== htmlContent) {
              iframe.srcdoc = htmlContent;
            }
          } catch (error) {
            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; } ${content}</style>
              </head>
              <body>
                <div style="padding: 20px;">
                  <h2>CSS Preview</h2>
                  <p>This is a preview of your CSS styles. The actual React component will use these styles.</p>
                </div>
              </body>
              </html>
            `;
            if (iframe.srcdoc !== htmlContent) {
              iframe.srcdoc = htmlContent;
            }
          }
        } else {
          try {
            const transformedCode = Babel.transform(content, {
              presets: ["react"],
              plugins: ["transform-modules-commonjs"],
            }).code;

            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; } ${currentState.files.react.css.content}</style>
              </head>
              <body>
                <div id="root"></div>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script>
                  const { 
                    useState, 
                    useEffect, 
                    useContext, 
                    useReducer, 
                    useCallback, 
                    useMemo, 
                    useRef, 
                    useImperativeHandle, 
                    useLayoutEffect, 
                    useDebugValue 
                  } = React;
                  try {
                    ${transformedCode}
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(React.createElement(App));
                  } catch(err) {
                    document.getElementById('root').innerHTML = 
                      '<div style="color:red;padding:20px;background:white;border:1px solid #eee">' +
                      '<h2>Error</h2><pre>' + err.message + '</pre></div>';
                  }
                </script>
              </body>
              </html>
            `;
            if (iframe.srcdoc !== htmlContent) {
              iframe.srcdoc = htmlContent;
            }
          } catch (error) {
            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; }</style>
              </head>
              <body>
                <div style="color:red;padding:20px;background:white;border:1px solid #eee">
                  <h2>Compilation Error</h2>
                  <pre>${error.message}</pre>
                </div>
              </body>
              </html>
            `;
            if (iframe.srcdoc !== htmlContent) {
              iframe.srcdoc = htmlContent;
            }
          }
        }
      } else {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>body { background-color: #f9f9f9; margin: 0; padding: 16px; } ${currentState.files.normal.css.content}</style>
          </head>
          <body>
            ${currentState.files.normal.html.content}
            <script>${currentState.files.normal.js.content}</script>
          </body>
          </html>
        `;
        if (iframe.srcdoc !== htmlContent) {
          iframe.srcdoc = htmlContent;
        }
      }
    } catch (error) {
      console.error("Error updating full screen output:", error);
    }
  };

  if (!isMounted) {
    return <div className={style.container} />;
  }

  const currentModeFiles = state.files[useReact ? "react" : "normal"];
  return (
    <div className={style.container}>
      <div style={{ height: "100%" }}>
        {" "}
        <div className={`${style.editorLayout} flex h-full`}>
          {!state.isLeftPanelCollapsed && (
            <>
              <div
                className={`${
                  style.leftPanel
                } bg-[var(--background-color)] border-r border-purple-500/30 flex-shrink-0 transition-all duration-200 ${
                  isResizing ? "shadow-lg shadow-purple-500/20" : ""
                }`}
                style={{ width: state.leftPanelWidth }}
              >
                <div
                  className={`${style.filesHeader} border-b border-purple-500/30`}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      className={style.exitButton}
                      onClick={handleBack}
                      title="Exit Editor"
                    >
                      <MdLogout size={18} style={{ transform: "scaleX(-1)" }} />
                      <span style={{ fontSize: "13px" }}>Exit</span>
                    </button>
                    <h3
                      className={`${style.filesTitle} text-[var(--text-color)]`}
                    >
                      Files
                    </h3>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className={`${style.button} hover:bg-purple-500/10`}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          isLeftPanelCollapsed: true,
                        }))
                      }
                      title="Collapse Files"
                    >
                      <MdChevronLeft
                        size={20}
                        className="text-[var(--text-color)]"
                      />
                    </button>
                  </div>
                </div>
                <div className={style.fileList}>
                  {Object.entries(currentModeFiles).map(([key, file]) => (
                    <div
                      key={key}
                      className={`${style.fileItem} ${
                        state.activeFile === key ? style.fileItemActive : ""
                      } hover:bg-purple-500/10`}
                      onClick={() => handleFileClick(key)}
                    >
                      {getFileIcon(file.name)}
                      <span
                        className={`${style.fileName} text-[var(--text-color)]`}
                      >
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>{" "}
              {/* Vertical resize handle */}
              <ResizeHandle
                direction="vertical"
                onResize={handleVerticalResize}
                minSize={200}
                // maxSize={windowWidth * 0.5}
                title="Drag to resize file explorer"
                className="z-10"
              />
            </>
          )}

          {state.isLeftPanelCollapsed && (
            <div
              style={{
                position: "fixed",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1000,
              }}
            >
              <button
                className={`${style.button} bg-[var(--background-color)] border border-purple-500/30 hover:bg-purple-500/10`}
                onClick={() =>
                  setState((prev) => ({ ...prev, isLeftPanelCollapsed: false }))
                }
                title="Expand Files"
              >
                <MdChevronRight
                  size={20}
                  className="text-[var(--text-color)]"
                />
              </button>{" "}
            </div>
          )}

          {/* Main content area */}
          <div className="flex flex-1 min-w-0">
            {" "}
            <div
              className={`${
                style.editorContainer
              } flex-1 transition-all duration-200 ${
                isResizing ? "opacity-95" : ""
              }`}
              style={{
                width: `calc(100% - ${state.rightPanelWidth}px)`,
              }}
            >
              <Editor
                height="100%"
                language={
                  currentModeFiles[state.activeFile]?.language || "javascript"
                }
                value={currentModeFiles[state.activeFile]?.content || ""}
                onChange={handleContentChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  theme: editorTheme,
                }}
                theme={editorTheme}
              />{" "}
            </div>
            <div className="flex">
              {" "}
              <ResizeHandle
                direction="vertical"
                onResize={handleRightPanelResize}
                minSize={400}
                // maxSize={windowWidth * 0.7}
                title="Drag to resize output panel"
                className="z-10"
              />
              <div
                className={`${
                  style.outputPanel
                } bg-[var(--background-color)] border-l border-purple-500/30 transition-all duration-200 ${
                  state.showOutput ? "" : style.outputPanelHidden
                } ${isResizing ? "shadow-lg shadow-purple-500/20" : ""}`}
                style={{ width: state.rightPanelWidth }}
              >
                <div
                  className={`${style.outputHeader} border-b border-purple-500/30`}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <h3
                      className={`${style.outputTitle} text-[var(--text-color)]`}
                    >
                      Output
                    </h3>
                    <p
                      className={`${style.submitStatus} text-[var(--text-muted)]`}
                    >
                      {submitStatus}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {!isPlaygroundMode && taskData && (
                      <button
                        className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-102 flex items-center justify-center"
                        onClick={() => setShowTaskModal(true)}
                      >
                        <span style={{ fontWeight: "bold" }}>Task</span>
                      </button>
                    )}
                    {!isPlaygroundMode && (
                      <button
                        className={`w-full px-2 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-102 flex items-center justify-center ${
                          isSubmitting ? style.submitButtonDisabled : ""
                        }`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>                    )}
                    <button
                      className={`${style.button} hover:bg-purple-500/10`}
                      onClick={() => setIsFullScreenPreview(true)}
                      title="Full Screen Preview"
                    >
                      <MdOpenInNew size={20} className="text-[var(--text-color)]" />
                    </button>
                    <button
                      className={`${style.button} hover:bg-purple-500/10`}
                      onClick={() =>
                        setState((prev) => ({ ...prev, showOutput: false }))
                      }
                      title="Hide Output"
                    >
                      <MdClose size={20} className="text-[var(--text-color)]" />
                    </button>
                  </div>
                </div>
                <div
                  id="output-container"
                  ref={outputContainerRef}
                  className={`${style.outputContainer} ${
                    isResizing ? style.resizing : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
        {!state.showOutput && (
          <div
            style={{
              position: "fixed",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1000,
            }}
          >
            <button
              className={`${style.button} bg-[var(--background-color)] border border-purple-500/30 hover:bg-purple-500/10`}
              onClick={() =>
                setState((prev) => ({ ...prev, showOutput: true }))
              }
              title="Show Output"
            >
              <MdOpenInNew size={20} className="text-[var(--text-color)]" />
            </button>
          </div>
        )}
        {showTaskModal && taskData && (
          <div className={`${style.modalOverlay} bg-black/50 backdrop-blur-sm`}>
            <div
              className={`${style.modalContent} bg-[var(--background-color)] border-2 border-purple-500/30`}
            >
              <div
                className={`${style.modalHeader} border-b border-purple-500/30`}
              >
                <h2 className={`${style.modalTitle} text-[var(--text-color)]`}>
                  {taskData.name || taskData.title}
                </h2>
                <button
                  className={`${style.modalClose} hover:bg-purple-500/10`}
                  onClick={() => setShowTaskModal(false)}
                >
                  <MdClose size={27} className="text-[var(--text-color)]" />
                </button>
              </div>
              <div className={style.taskContent}>
                <p className="text-[var(--text-color)]">
                  <strong>Difficulty:</strong>{" "}
                  {taskData.level || taskData.difficulty}
                </p>
                {taskData.designs && taskData.designs.length > 0 && (
                  <>
                    <h3 className="text-[var(--text-color)]">Examples</h3>
                    <div className={style.imageGrid}>
                      {taskData.designs.map((imageUrl, index) => (
                        <div
                          key={index}
                          className={style.imageItem}
                          onClick={() => openImagePreview(imageUrl, index)}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Design example ${index + 1}`}
                            width={400}
                            height={400}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {taskData.images &&
                  taskData.images.length > 0 &&
                  !taskData.designs && (
                    <>
                      <h3 className="text-[var(--text-color)]">Examples</h3>
                      <div className={style.imageGrid}>
                        {taskData.images.map((image, index) => (
                          <div
                            key={image.id}
                            className={style.imageItem}
                            onClick={() => openImagePreview(image.url, index)}
                          >
                            <Image
                              src={image.url}
                              alt={image.alt}
                              width={400}
                              height={400}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                <br />
                <hr className="border-purple-500/30" />
                <br />
                <h3 className="text-[var(--text-color)]">Description</h3>
                <div className="text-[var(--text-color)] prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-[var(--text-color)] text-2xl font-bold mb-4">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-[var(--text-color)] text-xl font-bold mb-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-[var(--text-color)] text-lg font-bold mb-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-[var(--text-color)] mb-3">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="text-[var(--text-color)] list-disc ml-6 mb-3">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="text-[var(--text-color)] list-decimal ml-6 mb-3">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-[var(--text-color)] mb-1">
                          {children}
                        </li>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="text-purple-400 bg-gray-800 px-1 py-0.5 rounded text-sm">
                            {children}
                          </code>
                        ) : (
                          <code className="text-purple-400 bg-gray-800 p-3 rounded block overflow-x-auto">
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="bg-gray-800 p-3 rounded mb-3 overflow-x-auto">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-purple-500 pl-4 italic text-[var(--text-muted)] mb-3">
                          {children}
                        </blockquote>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-[var(--text-color)] font-bold">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="text-[var(--text-color)] italic">
                          {children}
                        </em>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          className="text-purple-400 hover:text-purple-300 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {taskData.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
        {previewImage && (
          <div
            className={`${style.imagePreviewOverlay} bg-black/50 backdrop-blur-sm`}
            onClick={closeImagePreview}
          >
            <div
              className={style.imagePreviewContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`${style.closePreview} hover:bg-purple-500/10`}
                onClick={closeImagePreview}
              >
                <MdClose size={30} className="text-[var(--text-color)]" />
              </button>
              <Image
                src={previewImage}
                alt="Preview"
                className={style.previewImage}
                width={1200}
                height={800}
              />
              {taskData &&
                ((taskData.images && taskData.images.length > 1) ||
                  (taskData.designs && taskData.designs.length > 1)) && (
                  <div
                    className={`${style.previewNavigation} bg-black/50 backdrop-blur-sm`}
                  >
                    <button
                      className={`${style.navButton} hover:bg-purple-500/10`}
                      onClick={() => navigateImage(-1)}
                    >
                      <MdArrowBackIos
                        size={20}
                        className="text-[var(--text-color)]"
                      />
                    </button>
                    <div
                      className={`${style.imageCount} text-[var(--text-color)]`}
                    >
                      {currentImageIndex + 1} /{" "}
                      {taskData.designs
                        ? taskData.designs.length
                        : taskData.images.length}
                    </div>
                    <button
                      className={`${style.navButton} hover:bg-purple-500/10`}
                      onClick={() => navigateImage(1)}
                    >
                      <MdArrowForwardIos
                        size={20}
                        className="text-[var(--text-color)]"
                      />
                    </button>
                  </div>
                )}            </div>
          </div>
        )}
        {/* Full Screen Preview Modal */}
        {isFullScreenPreview && (
          <div
            className={`${style.fullScreenPreviewOverlay} bg-black/90 backdrop-blur-sm`}
            onClick={() => setIsFullScreenPreview(false)}
          >
            <div
              className={style.fullScreenPreviewContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`${style.closePreview} hover:bg-purple-500/10`}
                onClick={() => setIsFullScreenPreview(false)}
              >
                <MdClose size={30} className="text-white" />
              </button>
              <div
                id="fullscreen-output-container"
                className={style.fullScreenOutputContainer}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
