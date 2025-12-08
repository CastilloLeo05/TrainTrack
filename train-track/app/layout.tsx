// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrainTrack – AI Running Coach',
  description: 'AI-powered workout plans and race prep for runners.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <span className="text-lg font-semibold tracking-tight">
              TrainTrack
            </span>
            <nav className="hidden gap-4 text-sm sm:flex">
              <a href="#dashboard" className="hover:text-blue-400">Dashboard</a>
              <a href="#events" className="hover:text-blue-400">Events</a>
              <a href="#coach" className="hover:text-blue-400">Coach</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
