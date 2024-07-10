"use client";

import { Button, Modal } from "@mantine/core";
import { type Person } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { errorToast } from "~/app/_utils/errorToast";
import { api } from "~/trpc/react";
import { PointForm } from "./PointForm";

export interface CreatePointProps {
  people: Person[];
}

export const CreatePoint = ({ people }: CreatePointProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { mutate: createPointEntry, isPending } = api.point.create.useMutation({
    onSuccess: () => {
      router.refresh();
      closeHandler();
    },
    onError: (e) => {
      errorToast(e, "An error occurred creating the point entry");
    },
  });

  const closeHandler = () => {
    setOpen(false);
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
          onSubmit={createPointEntry}
          onReset={closeHandler}
          isPending={isPending}
          people={people}
          requireNumVoters
        />
      </Modal>
    </div>
  );
};
