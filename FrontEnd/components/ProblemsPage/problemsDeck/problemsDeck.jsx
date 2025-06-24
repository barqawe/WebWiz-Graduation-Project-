"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import style from "./problemsDeck.module.scss";

import FuzzyText from "@/components/UI/FuzzyText/FuzzyText";
import ProblemCard from "@/components/ProblemsPage/ProblemCard/ProblemCard.jsx";
import CustomPagination from "@/components/UI/CustomPagination/CustomPagination.jsx";
import { SiHtml5, SiCss3, SiJavascript, SiReact } from "react-icons/si";
import { color } from "framer-motion";

export default function ProblemsDeck() {
  const { theme } = useTheme();

  //used for fetching data from API
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //these are used for pagination mainly
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  //from wrapper
  const [level, setLevel] = useState(null);
  const [programming_Language, setProgramming_Language] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  //Just realized that I made my custom radio buttons!!!!!!!!
  const handleSelection = (option) => {
    setError(null);
    if (option === null) {
      // Special case for "ALL" - clear all selections
      setProgramming_Language([]);
      setSelectedLanguage(null);
    } else {
      setProgramming_Language((prev) => {
        let updatedLanguages;
        const isSelected = prev.includes(option);

        if (isSelected) {
          // When deselecting an html or react
          if (option === "HTML" || option === "REACT") {
            updatedLanguages = prev.filter(
              (lang) =>
                lang !== "HTML" &&
                lang !== "CSS" &&
                lang !== "javascript" &&
                lang !== "REACT"
            );
          } else {
            // For other languages (CSS, JS), simply remove them
            updatedLanguages = prev.filter((lang) => lang !== option);
          }
        } else {
          // When selecting a language
          if (option === "HTML") {
            // HTML can be selected alone

            updatedLanguages = [
              ...prev.filter((lang) => lang !== "REACT"),
              "HTML",
            ];
          } else if (option === "CSS") {
            // When CSS is selected, HTML is required unless REACT is selected
            updatedLanguages = [...prev, "CSS"];
            if (!prev.includes("HTML") && !prev.includes("REACT")) {
              updatedLanguages.push("HTML");
            }
          } else if (option === "javascript") {
            // When JS is selected, HTML is selected too
            updatedLanguages = [
              ...prev.filter((lang) => lang !== "REACT"),
              "javascript",
            ];
            if (!prev.includes("HTML")) {
              updatedLanguages.push("HTML");
            }
          } else if (option === "REACT") {
            // REACT can exist with CSS but not with HTML/JS
            updatedLanguages = prev.filter((lang) => lang === "CSS");
            updatedLanguages.push("REACT");
          }
        }

        // Create a properly ordered representation of selected languages
        const orderedLanguages = ["HTML", "CSS", "javascript", "REACT"];
        const sortedLangs = orderedLanguages.filter((lang) =>
          updatedLanguages.includes(lang)
        );

        if (sortedLangs.length > 0) {
          setSelectedLanguage(sortedLangs.join(",").toLowerCase());
        } else {
          setSelectedLanguage(null);
        }

        return updatedLanguages;
      });
    }

    setPageNumber(1); // Reset to page 1 when filter is applied
  };
  //data retrieval
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // First fetch problems
        const dataResponse = await fetch(
          "http://localhost:5046/api/Design-Task/GetFilteredTasks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              level: level,
              programming_Language: selectedLanguage,
              pageNumber: pageNumber,
              pageSize: 12,
            }),
          }
        );

        if (!dataResponse.ok) {
          throw new Error("Failed to fetch problems");
        }

        const data = await dataResponse.json();
        setProblems(data);

        // second fetch for page count
        const response = await fetch(
          "http://localhost:5046/api/Design-Task/GetAllTasksCount",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("failed to fetch page count");
        }

        const countData = await response.json();
        setPageCount(countData);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageNumber, level, selectedLanguage]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPageNumber(value);
    // Scroll to top of the page when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <div>
        <nav className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full relative p-4 sm:p-6 lg:p-8 border-b border-white/5 gap-6 lg:gap-4">
          {/* Main decorative border */}
          <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full nav-border-shimmer"></div>
          {/* Language filter buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6 w-full lg:w-auto lg:flex-1 lg:justify-start">
            <button
              onClick={() => handleSelection(null)}
              className={`inline-flex items-center text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-2 rounded-2xl border-none cursor-pointer bg-[#1a2a3a] text-white transition-all duration-600 ${
                programming_Language.length === 0
                  ? "bg-[#7e19ad] text-[#1a2a3a]"
                  : ""
              }`}
              data-type="ALL"
            >
              ALL
            </button>
            <button
              onClick={() => handleSelection("HTML")}
              className={`inline-flex items-center text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-2 rounded-2xl border-none cursor-pointer bg-[#1a2a3a] transition-all duration-600 ${
                programming_Language.includes("HTML")
                  ? "bg-[#ff5733] text-[#1a2a3a]"
                  : "text-white"
              }`}
              data-type="HTML"
            >
              <span className="inline-flex items-center justify-center mr-1 sm:mr-1.5 leading-none">
                <SiHtml5 size={16} className="sm:w-5 sm:h-5" />
              </span>
              <span className=" sm:inline">HTML</span>
            </button>
            <button
              onClick={() => handleSelection("CSS")}
              className={`inline-flex items-center text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-2 rounded-2xl border-none cursor-pointer bg-[#1a2a3a] transition-all duration-600  ${
                programming_Language.includes("CSS")
                  ? "bg-[#264de4] text-[#1a2a3a]"
                  : "text-white"
              }`}
              data-type="CSS"
            >
              <span className="inline-flex items-center justify-center mr-1 sm:mr-1.5 leading-none">
                <SiCss3 size={16} className="sm:w-5 sm:h-5" />
              </span>
              <span className=" sm:inline">CSS</span>
            </button>
            <button
              onClick={() => handleSelection("javascript")}
              className={`inline-flex items-center text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-2 rounded-2xl border-none cursor-pointer bg-[#1a2a3a] transition-all duration-600  ${
                programming_Language.includes("javascript")
                  ? "bg-[#f7df1e] text-[#1a2a3a]"
                  : "text-white"
              }`}
              data-type="JS"
            >
              <span className="inline-flex items-center justify-center mr-1 sm:mr-1.5 leading-none">
                <SiJavascript size={16} className="sm:w-5 sm:h-5" />
              </span>
              <span className=" sm:inline">JS</span>
            </button>
            <button
              onClick={() => handleSelection("REACT")}
              className={`inline-flex items-center text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-2 rounded-2xl border-none cursor-pointer bg-[#1a2a3a]  transition-all duration-600  ${
                programming_Language.includes("REACT")
                  ? "bg-[#61dbfb] text-[#1a2a3a]"
                  : "text-white"
              }`}
              data-type="REACT"
            >
              <span className="inline-flex items-center justify-center mr-1 sm:mr-1.5 leading-none">
                <SiReact size={16} className="sm:w-5 sm:h-5" />
              </span>
              <span className="sm:inline">REACT</span>
            </button>
          </div>
          {/* Level filter dropdown */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end lg:justify-end">
            <div className="custom-dropdown w-full sm:w-auto">
              <select
                value={level || ""}
                onChange={(e) => {
                  setLevel(e.target.value === "" ? null : e.target.value);
                  setPageNumber(1); // Reset to page 1 when filter is applied
                }}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="wizzard">Wizard</option>
              </select>
            </div>
          </div>
        </nav>
        {/*MAIN CONTENT & FALLBACKS */}
        <div className="p-8">
          {isLoading && <div className={style.loader}></div>}
          {error && !isLoading && (
            <div className="mx-auto flex flex-col justify-center items-center gap-4 text-xl w-2/5 p-4 bg-transparent text-[var(--text-color)]">
              <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.5}
                enableHover={true}
                fontSize="clamp(2rem, 10vw, 10rem)"
                color={theme === "dark" ? "#ffffff" : "#000000"}
              >
                404
              </FuzzyText>
              <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.5}
                enableHover={true}
                fontSize="clamp(0.5rem, 5vw, 2rem)"
                color={theme === "dark" ? "#ffffff" : "#000000"}
              >
                NO TASKS FOUND !
              </FuzzyText>
            </div>
          )}
          {/* this is the main grid of cards */}
          {!isLoading && !error && problems && (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
              {problems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  id={problem.id}
                  name={problem.name}
                  description={problem.description}
                  designs={problem.designs}
                  programming_Language={problem.programming_Language}
                  level={problem.level}
                  status={problem.status}
                />
              ))}
            </div>
          )}
          {/* Custom Pagination */}
          {!isLoading && !error && pageCount > 0 && (
            <div className="mt-8 flex justify-center w-full">
              <CustomPagination
                count={pageCount}
                page={pageNumber}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
