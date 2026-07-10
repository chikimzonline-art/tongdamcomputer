import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProviderWrapper } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tongdam Computers | Computer Training, Services & Restaurant in Manipur",
    template: "%s · Tongdam Computers",
  },
  description:
    "Tongdam Computers — a multi-department hub in Churachandpur, Manipur offering computer training (DCA, ADCA, Tally, Web Dev), tailoring & fashion design, hotel management with 100% placement, Aadhaar/PAN/CSP services, mobile repairs, and a full-service restaurant. Affiliated to E-Max India.",
  keywords: [
    "Tongdam Computers",
    "computer training Manipur",
    "DCA ADCA course Churachandpur",
    "Tally Prime training",
    "web development course Manipur",
    "tailoring and fashion design course",
    "hotel management diploma placement",
    "Aadhaar enrolment centre",
    "PAN card services",
    "CSP banking services",
    "mobile repair shop",
    "restaurant Churachandpur",
    "E-Max India institute",
    "vocational training Mizoram Manipur",
  ],
  authors: [{ name: "Tongdam Computers" }],
  creator: "Tongdam Computers",
  publisher: "Tongdam Computers",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Tongdam Computers | Computer Training, Services & Restaurant in Manipur",
    description:
      "Multi-department hub offering computer training, tailoring, hotel management, Aadhaar/PAN/CSP services, mobile repairs, and dining — all under one trusted roof since 2020.",
    siteName: "Tongdam Computers",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tongdam Computers | Computer Training, Services & Restaurant in Manipur",
    description:
      "Computer training, tailoring, hotel management, Aadhaar/PAN/CSP services, mobile repairs, and dining — all under one trusted roof since 2020.",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}
