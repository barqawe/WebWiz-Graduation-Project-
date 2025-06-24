"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { use } from "react";
import Ide from "@/components/Ide/Ide";
import useAuthStore from "@/store/authStore";
import { useTheme } from "next-themes";

// Disable caching for this page
export const dynamic = "force-dynamic";

export default function TaskPage({ params }) {
  const [taskData, setTaskData] = useState(null);
  const [programmingLanguage, setProgrammingLanguage] = useState(null);
  const [useReact, setUseReact] = useState(false);
  const unwrappedParams = use(params);
  const { ID: taskId } = unwrappedParams;

  //console.log(taskId);
  const getUser = useAuthStore((state) => state.getUser);
  const userId = getUser(); 
  console.log(userId);
  const { theme, setTheme } = useTheme();

  const accessToken = useAuthStore((state) => state.accessToken);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5046/api/Design-Task/GetTaskById/${taskId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTaskData(data);
        setProgrammingLanguage(data.programming_Language);

        // Check if programming language contains "react"
        if (
          data.programming_Language &&
          data.programming_Language.toLowerCase().includes("react")
        ) {
          setUseReact(true);
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaskData();
  }, [taskId, accessToken]);

  return (
    <div>
      <Ide
        useReact={useReact}
        taskData={taskData} 
        taskId={taskId}
        userId={userId}
        theme={theme}
      />
    </div>
  );
}
