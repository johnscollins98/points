"use client";

import { ActionIcon, Avatar, Button, CloseIcon, Select } from "@mantine/core";
import { type User } from "next-auth";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

interface Props {
  users: User[];
}

export const AdminFormClient = ({ users }: Props) => {
  const router = useRouter();

  const admins = users.filter((u) => u.admin);

  const [admin, setAdmin] = useState<User["id"] | null>(null);

  const { mutate: addAdmin } = api.admin.addAdmin.useMutation({
    onSuccess: () => router.refresh(),
  });
  const { mutate: removeAdmin } = api.admin.removeAdmin.useMutation({
    onSuccess: () => router.refresh(),
  });

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (admin) {
      addAdmin(admin);
      setAdmin(null);
    }
  };

  const onRemoveAdmin = (id: string) => {
    removeAdmin(id);
  };

  return (
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
              <ActionIcon onClick={() => onRemoveAdmin(admin.id)}>
                <CloseIcon />
              </ActionIcon>
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
  );
};
