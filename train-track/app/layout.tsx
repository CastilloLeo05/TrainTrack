// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrainTrack – AI Running Coach",
  description: "AI-powered workout plans and race prep for runners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07101d] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
