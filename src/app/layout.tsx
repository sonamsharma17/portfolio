import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SoundProvider } from "@/context/SoundContext";
import { JourneyProvider } from "@/context/JourneyContext";
import LenisProvider from "@/providers/LenisProvider";
import CustomCursor from "@/components/cursor/CustomCursor";
import MuteButton from "@/components/navigation/MuteButton";

export const metadata: Metadata = {
  title: "Developer Express – Journey Through My Developer Career",
  description: "Hop aboard Developer Express and explore my journey through technology, innovation, and continuous learning.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-theme="dark">
      <body className="min-h-full flex flex-col relative bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <ThemeProvider>
          <SoundProvider>
            <JourneyProvider>
              <LenisProvider>
                <CustomCursor />
                <MuteButton />
                <div className="flex-1 flex flex-col">
                  {children}
                </div>
              </LenisProvider>
            </JourneyProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
