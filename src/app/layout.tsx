import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./_components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Points",
  description: "Tracking points.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={`${inter.variable} root`}>
        <Providers session={session}>
          <MantineProvider defaultColorScheme="auto">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
