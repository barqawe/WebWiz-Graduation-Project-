export default function loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border-2 border-purple-500/30 shadow-xl p-8 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <div
            className="text-xl font-semibold text-[var(--text-color)] bg-clip-text"
            style={{
              backgroundImage: "var(--heading-gradient)",
            }}
          >
            Opening Create Task Page ...
          </div>
        </div>
      </div>
    </div>
  );
}
