import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { SiHtml5, SiCss3, SiJavascript, SiReact } from "react-icons/si";
import { BookOpen, CheckSquare, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center">
              <h1
                className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent leading-tight"
                style={{
                  backgroundImage: "var(--heading-gradient)",
                }}
              >
                Master FrontEnd Development
              </h1>
              <p className="text-lg text-[var(--muted-foreground)] mb-8 leading-relaxed">
                Learn <span className="text-[#e34f26] font-bold">HTML</span>,{" "}
                <span className="text-[#264de4] font-bold">CSS</span>,{" "}
                <span className="text-[#f7df1e] font-bold">JavaScript</span> and{" "}
                <span className="text-[#61dafb] font-bold">React</span> through
                interactive challenges and hands-on projects
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/learning-paths" className="flex-1">
                  <button className="w-full px-6 py-3 gradient-button rounded-lg text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center">
                    <span className="flex items-center">
                      <span>Start Learning</span>
                      <BookOpen size={18} className="ml-2" />
                    </span>
                  </button>
                </Link>
                <Link href="/tasks" className="flex-1">
                  <button className="w-full px-6 py-3 gradient-button rounded-lg text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center">
                    <span className="flex items-center">
                      <span>View Tasks</span>
                      <CheckSquare size={18} className="ml-2" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full md:w-[500px] flex items-center justify-center">
                <div className="absolute left-[10%] top-[5%] animate-float-1">
                  <SiHtml5
                    size={80}
                    className="sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px] text-[#e34f26] transition-transform duration-300"
                  />
                </div>
                <div className="absolute right-[15%] top-[15%] animate-float-2">
                  <SiCss3
                    size={70}
                    className="sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] text-[#264de4] transition-transform duration-300"
                  />
                </div>
                <div className="absolute left-[15%] bottom-[25%] animate-float-3">
                  <SiJavascript
                    size={90}
                    className="sm:w-[110px] sm:h-[110px] md:w-[130px] md:h-[130px] text-[#f7df1e] transition-transform duration-300"
                  />
                </div>
                <div className="absolute right-[8%] bottom-[12%] animate-float-4">
                  <SiReact
                    size={100}
                    className="sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] text-[#61dafb] transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Project Section */}
      <div className="py-16 px-4 bg-gradient-to-b from-transparent to-[rgba(var(--secondary-bg),0.1)]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-bold mb-12 bg-clip-text text-transparent text-center"
            style={{
              backgroundImage: "var(--heading-gradient)",
            }}
          >
            Learn by Building Real Projects
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 p-3 rounded-xl shadow-lg">
                <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <iframe
                    src="https://player.cloudinary.com/embed/?cloud_name=dvy9iittw&public_id=Screen_Recording_2025-06-12_065737_p8hufp&profile=cld-default&autoplay=true&controls=false&muted=true&loop=true"
                    width="100%"
                    height="100%"
                    className="rounded-lg w-full h-full object-cover"
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-6 text-purple-700 dark:text-purple-400">
                Build as You Learn
              </h3>
              <p className="text-lg mb-8 text-[var(--text-color)] leading-relaxed">
                Our project-based learning approach helps you apply what you've
                learned immediately. Create responsive websites, interactive
                UIs, and dynamic web applications as you progress through the
                curriculum.
              </p>
              <ul className="space-y-4">
                {[
                  "Portfolio websites",
                  "Interactive games",
                  "Web applications",
                  "API integration projects",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Playground Section */}
      <div className="py-16 px-4 bg-gradient-to-b from-[rgba(var(--secondary-bg),0.1)] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: "var(--heading-gradient)",
              }}
            >
              Code Playgrounds
            </h2>
            <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              Experiment with code in a free-form editor. No tasks, no
              submissions—just pure coding fun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/playground/html-css-js" className="group">
              <button className="w-full px-8 py-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-4 justify-center">
                <Globe size={28} />
                <span>Web Playground</span>
              </button>
            </Link>
            <Link href="/playground/react" className="group">
              <button className="w-full px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-4 justify-center">
                <SiReact size={28} />
                <span>React Playground</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
