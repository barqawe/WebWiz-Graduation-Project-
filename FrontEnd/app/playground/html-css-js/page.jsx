"use client";
import Ide from "@/components/Ide/Ide";
import { useTheme } from "next-themes";

export default function HtmlCssJsPlayground() {
  const { theme } = useTheme();
  return (
    <div>
      <Ide useReact={false} isPlaygroundMode={true} theme={theme} />
    </div>
  );
}
