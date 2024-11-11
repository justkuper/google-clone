import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import React from "react";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"], // Double quotes for consistency
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Double quotes for each weight
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
