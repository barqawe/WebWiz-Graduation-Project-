"use client";

import { Trophy, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ValidationJ({ validationResponse }) {
    if (!validationResponse) return null;

    const router = useRouter();
    const { code = {}, type, issues = [], taskCompletion = {}, overallRecommendation, totalScore, grade } = validationResponse;

    const getGradeColor = (grade) => {
        switch(grade?.toLowerCase()) {
            case 'excellent': return 'text-green-500';
            case 'very good': return 'text-blue-500';
            case 'good': return 'text-blue-400';
            case 'fair': return 'text-yellow-500';
            case 'fail': return 'text-red-500';
            case 'poor': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const formatScore = (score) => {
        return score === "N/A" ? "N/A" : score;
    };

    const formatOutOf = (outOf) => {
        return outOf === "N/A" ? "" : `out of ${outOf}`;
    };

    // Helper to render code analysis commentary
    const renderCodeAnalysis = () => {
        if (!code || Object.keys(code).length === 0) return null;
        return Object.entries(code).map(([section, sectionObj]) => (
            <div key={section} className="mb-6 bg-[var(--validation-box-bg)] rounded-lg p-4 border border-white/10">
                <h2 className="text-xl font-semibold mb-2 text-[var(--text-color)] capitalize">
                    {section}
                </h2>
                {Object.entries(sectionObj).map(([key, value]) => (
                    <div key={key} className="mb-2 ml-4">
                        <h3 className="text-md font-medium text-[var(--text-color)]">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] ml-2">
                            {value.commentary}
                        </p>
                    </div>
                ))}
            </div>
        ));
    };

    // Helper to render task completion scores
    const renderTaskCompletion = () => {
        if (!taskCompletion || Object.keys(taskCompletion).length === 0) return null;
        return (
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-[var(--text-color)]">Task Completion</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(taskCompletion).map(([key, value]) => (
                        <div key={key} className="bg-[var(--validation-box-bg)] rounded-lg p-4 border border-white/10">
                            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="text-xl font-bold text-[var(--text-color)]">
                                    {value.score} <span className="text-[var(--text-muted)]">/ {value.outOf}</span>
                                </div>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">
                                {value.commentary}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 top-4 flex items-center gap-2 text-[var(--text-color)] hover:text-[var(--text-muted)] transition-colors bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 hover:bg-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
                <h1 
                    className="text-4xl md:text-5xl font-bold mb-8 mt-12 bg-clip-text text-transparent text-center"
                    style={{
                        backgroundImage: "var(--heading-gradient)",
                    }}
                >
                    Validation Results
                </h1>
            </div>
            <div className="bg-[var(--validation-box-bg)] backdrop-blur-sm rounded-xl border-2 border-purple-500/30 shadow-xl p-6 w-full max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <div className={`text-2xl font-bold ${getGradeColor(grade)}`}>
                            {grade}
                        </div>
                        <div className="text-xl text-[var(--text-muted)]">
                            Total Score: {totalScore}
                        </div>
                    </div>
                </div>

                {renderCodeAnalysis()}
                {renderTaskCompletion()}

                {issues && issues.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-color)] flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                            Issues Found
                        </h2>
                        <div className="space-y-4">
                            {issues.map((issue, index) => (
                                <div key={index} className="bg-[var(--validation-box-bg)] rounded-lg p-4 border border-white/10">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-[var(--text-color)] mb-1">
                                                {issue.type.toUpperCase()}
                                            </h4>
                                            <p className="text-sm text-[var(--text-muted)] mb-2">
                                                {issue.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-green-500">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>{issue.recommendation}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-[var(--validation-box-bg)] rounded-lg p-4 border border-white/10">
                    <h3 className="text-xl font-semibold mb-2 text-[var(--text-color)] flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        Overall Recommendation
                    </h3>
                    <p className="text-[var(--text-muted)]">
                        {overallRecommendation}
                    </p>
                </div>
            </div>
        </>
    );
}
