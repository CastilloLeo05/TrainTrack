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
      {/* Uses Tailwind theme: background, text, Poppins */}
      <body className="min-h-screen bg-background text-text font-poppins antialiased">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <span className="text-lg font-extrabold tracking-tight">
              TrainTrack
            </span>
            <nav className="hidden gap-4 text-xs font-medium sm:flex">
              <a
                href="#dashboard"
                className="transition-colors hover:text-primary"
              >
                Dashboard
              </a>
              <a
                href="#events"
                className="transition-colors hover:text-primary"
              >
                Events
              </a>
              <a
                href="#coach"
                className="transition-colors hover:text-primary"
              >
                Coach
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-4 md:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
