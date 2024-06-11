"use client";

import { useSession } from "next-auth/react";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";

export const SessionForm = () => {
  const { data: session } = useSession();

  if (session) return <LoggedInView session={session} />;

  if (!session) {
    return <LoggedOutView />;
  }
};
