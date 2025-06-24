"use client";
import style from "./ProblemsTable.module.scss";
import FuzzyText from "@/components/UI/FuzzyText/FuzzyText";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProblemsTable() {
  const [DATA, setDATA] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.74.72:5000/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch PROBLEMS");
        }

        const result = await response.json();
        setDATA(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    //temporary for testing purposes ! DELETE WHEN DONE
    const timeoutId = setTimeout(fetchData, 5000);
    return () => clearTimeout(timeoutId);
    //fetchData();
  }, []);


  //try not to have more than one return 


  if (loading) return <div className={style.loader}></div>;

  if (error) {
    console.error(`Error: ${error}`);
    return (
      <div className={style.errorContainer}>
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={true}
          fontSize="clamp(2rem, 10vw, 10rem)"
        >
          404
        </FuzzyText>
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={true}
          fontSize="clamp(0.5rem, 5vw, 2rem)"
        >
          FAILED TO FETCH PROBLEMS!
        </FuzzyText>
      </div>
    );
  }

  return (
    <table className={style.table}>
      <thead>
        <tr>
          <td>Status</td>
          <td>Name</td>
          <td>language</td>
          <td>difficulty</td>
        </tr>
      </thead>

      <tbody>
        {DATA.map((data) => {
          return (
            <tr key={data.id}>
              <td>{data.status}</td>
              <td>
                <Link href={`/problems/${data.id}`}>{data.title}</Link>
              </td>
              <td>{data.language}</td>
              <td data-difficulty={data.difficulty}>{data.difficulty}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
