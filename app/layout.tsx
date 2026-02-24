import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liibra",
  description: "Legal Information Institute of Brazil",
};


import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
	<SpeedInsights />
      </body>
    </html>
  );
}

