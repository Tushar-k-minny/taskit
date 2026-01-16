import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Taskit - Modern Task Management",
  description:
    "A beautiful and intuitive task management application for teams and individuals. Organize, prioritize, and accomplish your goals.",
  keywords: [
    "task management",
    "productivity",
    "project management",
    "todo",
    "tasks",
  ],
  authors: [{ name: "Taskit Team" }],
  openGraph: {
    title: "Taskit - Modern Task Management",
    description: "Organize, prioritize, and accomplish your goals with Taskit.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
