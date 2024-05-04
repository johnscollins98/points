"use client";

import { Button, Modal } from "@mantine/core";
import { type Person } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { PointForm, type PointSubmit } from "./PointForm";

export interface CreatePointProps {
  people: Person[];
}

export const CreatePoint = ({ people }: CreatePointProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { mutate: createPointEntry, isPending } = api.point.create.useMutation({
    onSuccess: () => router.refresh(),
  });

  const closeHandler = () => {
    setOpen(false);
  };

  const submitHandler = (v: PointSubmit) => {
    createPointEntry(v);
    closeHandler();
  };

  return (
    <div className="flex justify-start">
      <Button onClick={() => setOpen(true)}>Add New Point Entry</Button>
      <Modal
        opened={open}
        onClose={closeHandler}
        centered
        trapFocus={false}
        title="Create Point Entry"
      >
        <PointForm
          onSubmit={submitHandler}
          onReset={closeHandler}
          isPending={isPending}
          people={people}
        />
      </Modal>
    </div>
  );
};
