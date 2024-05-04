import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Points",
  description: "Tracking points.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={`${inter.variable} root`}>
        <MantineProvider defaultColorScheme="auto">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
