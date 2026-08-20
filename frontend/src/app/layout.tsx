import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoardNotes",
  description:
    "BoardNotes is a structured study platform for board-based notes, exercises, and step-by-step solutions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full bg-slate-50 text-slate-950 flex flex-col">
        {children}
      </body>
    </html>
  );
}
