import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "BoardNotes",
  description:
    "BoardNotes is a structured study platform for board-based notes, exercises, and step-by-step solutions.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "BoardNotes",
    statusBarStyle: "default",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = (await cookies()).get("boardnotes_theme")?.value;
  const htmlClass = theme === "dark"
    ? "h-full scroll-smooth antialiased dark"
    : "h-full scroll-smooth antialiased";

  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
