"use client";

import { Avatar, Button, Modal, Tooltip } from "@mantine/core";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";

export interface LoggedInViewProps {
  session: Session;
}

export const LoggedInView = ({ session }: LoggedInViewProps) => {
  const [openLogout, setOpenLogout] = useState(false);

  return (
    <>
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
        <Button
          variant="subtle"
          onClick={() => setOpenLogout(true)}
          className="h-auto"
        >
          <div className="flex items-center gap-4 py-1">
            Sign Out
            <Avatar src={session.user.image} />
          </div>
        </Button>
      </div>
      <Modal
        opened={openLogout}
        onClose={() => setOpenLogout(false)}
        title="Sign out"
        centered
      >
        <div className="flex flex-col gap-3">
          Are you sure you want to sign out?
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={() => setOpenLogout(false)}>
              No
            </Button>
            <Button onClick={() => signOut()}>Yes</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
