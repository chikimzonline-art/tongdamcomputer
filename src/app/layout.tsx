import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProviderWrapper } from "@/components/providers/session-provider";
import { db } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_TITLE = "Tongdam Computers | Computer Training, Services & Restaurant in Manipur";
const BASE_DESCRIPTION =
  "Tongdam Computers — a multi-department hub in Churachandpur, Manipur offering computer training (DCA, ADCA, Tally, Web Dev), tailoring & fashion design, hotel management with 100% placement, Aadhaar/PAN/CSP services, mobile repairs, and a full-service restaurant. Affiliated to E-Max India.";

/**
 * Dynamically generate metadata so the favicon reflects whatever the admin
 * uploaded via the Site Assets editor. Falls back to the local /logo.svg.
 */
export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = "/logo.svg";
  try {
    const row = await db.siteContent.findUnique({
      where: { key: "site.faviconUrl" },
    });
    if (row?.value) faviconUrl = row.value;
  } catch {
    /* DB not ready during build — keep default */
  }

  return {
    title: {
      default: BASE_TITLE,
      template: "%s · Tongdam Computers",
    },
    description: BASE_DESCRIPTION,
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
      icon: faviconUrl,
    },
    openGraph: {
      title: BASE_TITLE,
      description:
        "Multi-department hub offering computer training, tailoring, hotel management, Aadhaar/PAN/CSP services, mobile repairs, and dining — all under one trusted roof since 2020.",
      siteName: "Tongdam Computers",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: BASE_TITLE,
      description:
        "Computer training, tailoring, hotel management, Aadhaar/PAN/CSP services, mobile repairs, and dining — all under one trusted roof since 2020.",
    },
    category: "education",
  };
}

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

