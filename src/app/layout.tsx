
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const font = Poppins({
  weight: ['300', '400', '500', '600', '800'],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "CBTis1",
  description: "portal oficial del cbtis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
