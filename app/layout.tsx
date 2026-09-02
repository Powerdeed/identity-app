import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Open_Sans } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "@/global-components/icons/icons";
import AppShell from "@/global-components/layout/AppShell";
import { AuthorizationProvider } from "@app/auth";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Powerdeed Identity",
    template: "%s | Powerdeed Identity",
  },
  description:
    "This application is Powerdeed's internal governance workspace for managing staff identity, employment context, application access, Keycloak baseline access, Powerdeed sessions, account lifecycle, access reviews, and identity-security activity.",
  keywords: ["Powerdeed", "identity"],
  other: {
    "app-version": "1.0.0",
  },
  // You can also define specific Open Graph, Twitter, etc. metadata here
  openGraph: {
    title: "Powerdeed Identity",
    description:
      "This application is Powerdeed's internal governance workspace for managing staff identity, employment context, application access, Keycloak baseline access, Powerdeed sessions, account lifecycle, access reviews, and identity-security activity.",
    type: "website",
    url: "https://account.powerdeed.co.ke",
    siteName: "Powerdeed Identity",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light overflow-x-hidden">
      <body
        className={`${plusJakartaSans.variable} ${openSans.variable} flex min-h-screen max-w-full flex-col overflow-x-hidden antialiased`}
      >
        <SpeedInsights />
        <Analytics />

        <AuthorizationProvider>
          <AppShell>{children}</AppShell>
        </AuthorizationProvider>
      </body>
    </html>
  );
}
