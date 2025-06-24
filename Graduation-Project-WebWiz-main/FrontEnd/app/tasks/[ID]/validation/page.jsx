"use client";
import { useParams, useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import ValidationH from "@/components/ValidationH/ValidationH";
import ValidationHC from "@/components/ValidationHC/ValidationHC";
import ValidationHCJ from "@/components/ValidationHCJ/ValidationHCJ";
import ValidationHJ from "@/components/ValidationHJ/ValidationHJ";
import ValidationJ from "@/components/ValidationJ/ValidationJ";
import ValidationJC from "@/components/ValidationJC/ValidationJC";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

export default function ValidationPage() {
  const params = useParams();
  const router = useRouter();
  const [validationResponse, setValidationResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchValidationResults = async () => {
      // Prevent double fetching in development mode
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        setIsLoading(true);
        setError(null);

        const getUser = useAuthStore.getState().getUser;
        const userId = getUser();
        const taskId = params.ID;
        const accessToken = useAuthStore.getState().accessToken;

        if (!userId || !taskId || !accessToken) {
          throw new Error('Missing required data for validation');
        }

        const codeToSubmit = localStorage.getItem(`codeToSubmit_${userId}_${taskId}`);
        if (!codeToSubmit) {
          throw new Error('No code submission found');
        }

        // Parse the stored code submission
        let parsedCode;
        try {
          parsedCode = JSON.parse(codeToSubmit);
        } catch (e) {
          throw new Error('Invalid code submission format');
        }
        console.log('Parsed code:', parsedCode);

        // Create a new FormData instance
        const formData = new FormData();
        
        // Add all the code content to FormData
        if (parsedCode.HTML) formData.append('HTML', parsedCode.HTML);
        if (parsedCode.CSS) formData.append('CSS', parsedCode.CSS);
        if (parsedCode.JS) formData.append('JS', parsedCode.JS);
        if (parsedCode.JSX) formData.append('JSX', parsedCode.JSX);
        if (parsedCode.ID) formData.append('ID', parsedCode.ID);
        if (parsedCode.SubmittedImage) {
          try {
            // Convert base64 to blob
            const base64Response = await fetch(parsedCode.SubmittedImage);
            const blob = await base64Response.blob();
            formData.append('SubmittedImage', blob, 'screenshot.png');
          } catch (error) {
            console.error('Error processing image:', error);
            // Continue without the image if there's an error
          }
        }

        // Log FormData contents for debugging
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }

        const response = await fetch(
          "http://localhost:5046/api/Design-Task/GetExternalEvaluationAsync",
          {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Validation response error:', errorText);
          throw new Error(`Validation failed: ${errorText || response.statusText}`);
        }

        const data = await response.json();
        setValidationResponse(data);
      } catch (err) {
        console.error('Error fetching validation results:', err);
        setError(err.message || 'Failed to fetch validation results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValidationResults();
  }, [params.ID]);

  const handleDone = () => {
    router.push('/tasks');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">

        <div className="bg-black/10 backdrop-blur-sm rounded-xl border-2 border-purple-500/30 shadow-xl p-8 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-xl font-semibold text-[var(--text-color)]">
              Loading Validation Results...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <button
          onClick={handleDone}
          className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105"
        >
          Done
        </button>
        <button
          onClick={handleDone}
          className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105"
        >
          Done
        </button>
        <div className="bg-black/10 backdrop-blur-sm rounded-xl border-2 border-red-500/30 shadow-xl p-8 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="text-red-500 text-4xl">⚠️</div>
            <div className="text-xl font-semibold text-[var(--text-color)]">
              Error Loading Results
            </div>
            <p className="text-[var(--text-muted)] text-center">
              {error}
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!validationResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <button
          onClick={handleDone}
          className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105"
        >
          Done
        </button>
        <div className="bg-black/10 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 shadow-xl p-8 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="text-yellow-500 text-4xl">ℹ️</div>
            <div className="text-xl font-semibold text-[var(--text-color)]">
              No Validation Results
            </div>
            <p className="text-[var(--text-muted)] text-center">
              No validation results were found for this task.
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  console.log(JSON.stringify(validationResponse))

  const renderValidationComponent = () => {
    switch (validationResponse.type) {
      case "HTML":
        return (
          <div className="relative">
            <button
              onClick={handleDone}
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105 z-50"
            >
              Done
            </button>
            <ValidationH validationResponse={validationResponse} />
          </div>
        );
      case "HTML,CSS":
        return (
          <div className="relative">
            <button
              onClick={handleDone}
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105 z-50"
            >
              Done
            </button>
            <ValidationHC validationResponse={validationResponse} />
          </div>
        );
      case "HTML,JS":
        return (
          <div className="relative">
            <button
              onClick={handleDone}
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105 z-50"
            >
              Done
            </button>
            <ValidationHJ validationResponse={validationResponse} />
          </div>
        );
      case "HTML,CSS,JS":
        return (
          <div className="relative">
            <button
              onClick={handleDone}
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105 z-50"
            >
              Done
            </button>
            <ValidationHCJ validationResponse={validationResponse} />
          </div>
        );
      case "JSX":
        return (
          <div className="relative">
            <button
              onClick={handleDone}
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105 z-50"
            >
              Done
            </button>
            <ValidationJ validationResponse={validationResponse} />
          </div>
        );
      case "JSX,CSS":
        return (
          <div className="relative">
            <button
              onClick={handleDone}
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105 z-50"
            >
              Done
            </button>
            <ValidationJC validationResponse={validationResponse} />
          </div>
        );
      default:
        return (
          <div className="min-h-screen flex items-center justify-center relative">
            <button
              onClick={handleDone}
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all transform hover:scale-105"
            >
              Done
            </button>
            <div className="bg-black/10 backdrop-blur-sm rounded-xl border-2 border-red-500/30 shadow-xl p-8 w-full max-w-md mx-auto">
              <div className="flex flex-col items-center gap-4">
                <div className="text-red-500 text-4xl">❌</div>
                <div className="text-xl font-semibold text-[var(--text-color)]">
                  Invalid Validation Type
                </div>
                <p className="text-[var(--text-muted)] text-center">
                  The validation type "{validationResponse.type}" is not supported.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="mt-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderValidationComponent();
}
