import "@/styles/globals.css";

import type { Metadata } from "next";
import { MaxWidthWrapper } from "@/components/max-with-wrapper";
import { FontWrapper } from "@/components/font-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Background } from "@/components/background";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Expenses Tracker",
  description:
    "Track your expenses, manage your budget, and gain insights into your spending habits with our user-friendly expense tracker.",

  // metadataBase: new URL("https://attendance.sahilkumardev.com"),
  // keywords: [
  //   "Attendance Calculator",
  //   "College Attendance",
  //   "Percentage Calculator",
  //   "Attendance Planner",
  //   "Student Tools",
  //   "Next.js",
  //   "React",
  //   "TypeScript",
  //   "javascript",
  //   "tailwindcss",
  // ],
  // authors: [
  //   {
  //     name: "Sahilkumardev",
  //     url: "https://sahilkumardev.com",
  //   },
  // ],
  // openGraph: {
  //   type: "website",
  //   locale: "en_US",
  //   url: "https://attendance.sahilkumardev.com",
  //   title: "Attendance Calculator",
  //   description:
  //     "Calculate your attendance percentage, plan your future attendance, and stay on track with your academic goals.",
  //   siteName: "Attendance Calculator",
  //   images: [{ url: "/og-image.png" }],
  // },

  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     "max-video-preview": -1,
  //     "max-image-preview": "large",
  //     "max-snippet": -1,
  //   },
  // },
  // creator: "Sahilkumardev",
  // twitter: {
  //   card: "summary",
  //   title: "Attendance Calculator",
  //   description:
  //     "Calculate your attendance percentage, plan your future attendance, and stay on track with your academic goals.",
  //   creator: "@sahilkumardev",
  // },
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
  // manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <FontWrapper>
              <MaxWidthWrapper>
                <Background />
                {children}
                <Toaster richColors />
              </MaxWidthWrapper>
            </FontWrapper>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
