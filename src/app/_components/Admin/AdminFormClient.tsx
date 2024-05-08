"use client";

import {
  ActionIcon,
  Avatar,
  Button,
  CloseIcon,
  Modal,
  Select,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { type User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

interface Props {
  users: User[];
}

export const AdminFormClient = ({ users }: Props) => {
  const router = useRouter();

  const { data: session } = useSession();

  const admins = users.filter((u) => u.admin);

  const [admin, setAdmin] = useState<User["id"] | null>(null);

  const { mutate: addAdmin } = api.admin.addAdmin.useMutation({
    onSuccess: () => router.refresh(),
    onError: () =>
      notifications.show({
        message: "An error occurred adding the admin, please try again",
        title: "Error",
        color: "red",
      }),
  });

  const { mutate: removeAdmin } = api.admin.removeAdmin.useMutation({
    onSuccess: () => router.refresh(),
    onError: () =>
      notifications.show({
        message: "An error occurred removing the admin, please try again",
        title: "Error",
        color: "red",
      }),
  });

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (admin) {
      addAdmin(admin);
      setAdmin(null);
    }
  };

  const [toRemove, setToRemove] = useState<User | null>(null);

  const onRemoveAdmin = (e: FormEvent<HTMLFormElement>, user: User | null) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      removeAdmin(user.id);
      setToRemove(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Admins</h2>
        <div className="flex flex-col gap-1">
          {admins.map((admin) => (
            <div key={admin.id} className="flex justify-between">
              <div className="flex items-center gap-1">
                <Avatar src={admin.image} size="sm" />
                {admin.name}
              </div>
              <div>
                {session?.user.email !== admin.email && (
                  <ActionIcon onClick={() => setToRemove(admin)}>
                    <CloseIcon />
                  </ActionIcon>
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddSubmit} className="flex items-center gap-1">
          <Select
            searchable
            value={admin}
            data={users
              .filter((u) => !u.admin && (u.name ?? u.email))
              .map((u) => ({ label: (u.name ?? u.email)!, value: u.id }))}
            onChange={(v) => setAdmin(v)}
            clearable
            placeholder="Add new admin..."
            required
          />
          <Button type="submit">Add Admin</Button>
        </form>
      </div>
      <Modal
        opened={toRemove !== null}
        onClose={() => setToRemove(null)}
        title="Remove Admin"
        centered
      >
        <form
          onSubmit={(e) => onRemoveAdmin(e, toRemove)}
          onReset={() => setToRemove(null)}
          className="flex flex-col gap-2"
        >
          Are you sure you want to remove {toRemove?.name ?? toRemove?.email} as
          an admin?
          <div className="flex justify-end gap-1">
            <Button variant="default" type="reset">
              No
            </Button>
            <Button color="red" type="submit">
              Yes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
