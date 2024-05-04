"use client";

import { Button, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

export const UserForm = () => {
  const router = useRouter();

  const { mutate: createUser, isPending } = api.person.create.useMutation({
    onSuccess: () => router.refresh(),
  });

  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    createUser(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-1">
      <TextInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Enter name..."
      />
      <Button disabled={isPending} type="submit">
        Add User
      </Button>
    </form>
  );
};
