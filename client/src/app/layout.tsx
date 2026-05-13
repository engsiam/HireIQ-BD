import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

export const dynamic = 'force-dynamic';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://hireiq.com.bd'),
  title: {
    default: "HireIQ BD | AI-Powered Job Board Bangladesh",
    template: "%s | HireIQ BD",
  },
  description: "Find your dream job in Bangladesh. AI-powered job matching for the next generation of professionals.",
  keywords: ["jobs in Bangladesh", "AI job matching", "career opportunities", "hiring", "recruitment Bangladesh", "HireIQ"],
  authors: [{ name: "HireIQ BD" }],
  creator: "HireIQ BD",
  publisher: "HireIQ BD",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hireiq.com.bd",
    siteName: "HireIQ BD",
    title: "HireIQ BD | AI-Powered Job Board Bangladesh",
    description: "Find your dream job in Bangladesh with AI-powered job matching.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HireIQ BD" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HireIQ BD | AI-Powered Job Board",
    description: "Find your dream job in Bangladesh with AI-powered job matching.",
    creator: "@hireiqbd",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon-192.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#EB4C4C" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if(typeof window !== 'undefined'){
                    var theme = localStorage.getItem('hireiq-theme');
                    if (!theme) {
                      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    document.documentElement.classList.add(theme);
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
        <body className={`${plusJakarta.className} antialised`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}