"use client";

import { Avatar, Button, Tooltip } from "@mantine/core";
import { type Session } from "next-auth";
import Link from "next/link";
import { FaLock, FaUnlock } from "react-icons/fa";

export interface SessionFormProps {
  session: Session | null;
}

export const SessionForm = ({ session }: SessionFormProps) => {
  if (session) {
    return (
      <div className="flex items-center justify-end gap-2">
        {session.user.isAdmin ? (
          <Tooltip position="bottom" label="You have admin permissions.">
            <div>
              <FaUnlock />
            </div>
          </Tooltip>
        ) : (
          <Tooltip position="bottom" label="You do not have admin permissions.">
            <div>
              <FaLock />
            </div>
          </Tooltip>
        )}
        <Link href="/api/auth/signout">
          <Button variant="subtle" className="h-auto">
            <div className="flex items-center gap-4 py-1">
              Sign Out
              <Avatar src={session.user.image} />
            </div>
          </Button>
        </Link>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-end">
        <Link href="/api/auth/signin">
          <Button variant="subtle">Admin Sign In</Button>
        </Link>
      </div>
    );
  }
};
