import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Load Montserrat font (a premium font similar to Proxima Nova)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "TRIOLL",
  description: "Try. Play. Buy. Level Up Your Game Discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`antialiased font-montserrat ${montserrat.className}`}>
        {children}
      </body>
    </html>
  );
}
