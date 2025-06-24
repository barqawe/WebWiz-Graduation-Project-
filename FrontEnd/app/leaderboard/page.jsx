"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function LeaderBoardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('http://localhost:5046/api/Auth/leader-board');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchLeaderboardData();
  }, []);

  console.log(leaderboardData);


  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--primary-bg)]">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent"
                style={{
                  backgroundImage: "var(--heading-gradient)",
                }}
              >
                Leaderboard
              </h1>
              <p className="text-lg text-[var(--text-muted)]">
                Top wizzards in our community
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border-2 border-red-500/30 shadow-xl p-8 text-center">
              <p className="text-red-500">Error: {error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-bg)]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage: "var(--heading-gradient)",
              }}
            >
              Leaderboard
            </h1>
            <p className="text-lg text-[var(--text-muted)]">
              Top wizzards in our community
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border-2 border-purple-500/30 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-muted)]">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-muted)]">Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-muted)]">Tasks Completed</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-muted)]">Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <tr 
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {index < 3 ? (
                            <Trophy 
                              className={`w-5 h-5 ${
                                index === 0 
                                  ? "text-yellow-400" 
                                  : index === 1 
                                  ? "text-gray-300" 
                                  : "text-amber-600"
                              }`}
                            />
                          ) : null}
                          <span className={`font-medium ${
                            index === 0 
                              ? "text-yellow-400" 
                              : index === 1 
                              ? "text-gray-300" 
                              : index === 2 
                              ? "text-amber-600" 
                              : "text-[var(--text-color)]"
                          }`}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-color)]">{user.userName}</td>
                      <td className="px-6 py-4 text-center text-[var(--text-color)]">{user.completedTask}</td>
                      <td className="px-6 py-4 text-center text-[var(--text-color)]">{user.totalScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
