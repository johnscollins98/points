import { type Session } from "next-auth";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";

export interface SessionFormProps {
  session: Session | null;
}

export const SessionForm = async ({ session }: SessionFormProps) => {
  if (session) return <LoggedInView session={session} />;

  if (!session) {
    return <LoggedOutView />;
  }
};
