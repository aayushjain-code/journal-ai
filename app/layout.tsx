import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import VersionInfo from "@/components/VersionInfo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Personal Journal",
  description:
    "Your AI-enhanced personal journal for life tracking and insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
        <VersionInfo />
      </body>
    </html>
  );
}
