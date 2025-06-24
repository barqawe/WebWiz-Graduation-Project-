import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ProblemCard = ({
  id,
  name,
  description,
  programming_Language,
  designs,
  level,
  status,
}) => {
  // Split programming_Language string into array
  const technologies = programming_Language
    ? programming_Language.split(",")
    : [];
  // Get the first image from designs array
  const image = designs && designs.length > 0 ? designs[0] : null;
  // Calculate level number based on level
  let levelNumber = 1;
  if (level === "intermediate") levelNumber = 2;
  if (level === "advanced" || level === "wizzard") levelNumber = 3;

  // Get dynamic background color based on level
  const getLevelBgColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "#21de00";
      case "intermediate":
        return "#dfce00";
      case "advanced":
        return "#dd0000";
      case "wizzard":
        return "#cd00ff";
      default:
        return "#4ecca3";
    }
  };
  return (
    <Link
      href={`/tasks/${id}`}
      className="block rounded-2xl overflow-hidden card-bg-gradient shadow-[0_4px_20px_rgba(0,0,0,0.1)] min-w-[360px] w-full h-full transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] border-2 border-purple-500"
      style={{
        background: `var(--primary-bg-3)`,
      }}
    >
      <div className="relative w-full pt-[56.25%] overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        )}
        {status && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
            COMPLETED
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h2 className="text-[var(--card-text)] text-xl font-bold mb-3 max-[480px]:text-[20px]">
          {name}
        </h2>
        <div className="mt-auto mb-4 flex flex-wrap gap-2 max-[420px]:gap-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className={`font-semibold text-[17px] uppercase max-[420px]:text-xs ${
                index === 0
                  ? "text-[#4ecca3]"
                  : index === 1
                  ? "text-[#a6b1e1]"
                  : index === 2
                  ? "text-[#f9a826]"
                  : index === 3
                  ? "text-[#5da0f7]"
                  : index === 4
                  ? "text-[#fc5c65]"
                  : "text-[#4ecca3]"
              }`}
            >
              {tech.trim()}
            </span>
          ))}
          <div
            className="ml-auto flex items-center gap-2 px-3 py-0.5 rounded-[20px]"
            style={{ backgroundColor: getLevelBgColor(level) }}
          >
            <span className="text-white uppercase text-xs tracking-wide  max-[420px]:text-[10px] font-bold">
              {level}
            </span>
          </div>
        </div>
        <div className=" text-[var(--card-text)] flex-grow mb-4 leading-6 opacity-90 overflow-hidden text-ellipsis line-clamp-3 max-[480px]:text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <span>{children}</span>,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => (
                <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">
                  {children}
                </code>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>
    </Link>
  );
};

export default ProblemCard;
