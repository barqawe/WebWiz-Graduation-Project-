import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ParticleBackground from "@/components/UI/ParticleBackground/ParticleBackground";
import DreamyParticle from "@/components/UI/DreamyParticle/DreamyParticle";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WebWiz | Frontend coding learning platform",
  description: "Master Front-End Development with Interactive Challenges",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/*  <DreamyParticle /> */}
          {/*  <ParticleBackground /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
//am i
