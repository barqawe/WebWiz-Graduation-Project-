"use client";
import Ide from "@/components/Ide/Ide";
import { useTheme } from "next-themes";

export default function ReactPlayground() {
const { theme } = useTheme();

  return (
    <div>
      <Ide useReact={true} isPlaygroundMode={true} theme={theme} />
    </div>
  );
} 