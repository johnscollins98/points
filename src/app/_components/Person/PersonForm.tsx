"use client";

import { Button, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

export const PersonForm = () => {
  const router = useRouter();

  const { mutate: createPerson, isPending } = api.person.create.useMutation({
    onSuccess: () => router.refresh(),
    onError: () =>
      notifications.show({
        title: "Error",
        message: "An error occurred adding the person, please try again",
        color: "red",
      }),
  });

  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    createPerson(name);
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
        Add Person
      </Button>
    </form>
  );
};
