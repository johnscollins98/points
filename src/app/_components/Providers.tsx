"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";

export interface ProvidersProps extends PropsWithChildren {
  session: Session | null;
}

export const Providers = ({ children, session }: ProvidersProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
