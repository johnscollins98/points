"use client";

import { Button, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { type Person } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { errorToast } from "~/app/_utils/errorToast";
import { api } from "~/trpc/react";
import { PointForm, type PointSubmit } from "./PointForm";

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

  const submitHandler = (v: PointSubmit) => {
    const numVoters = v.numVoters;
    if (numVoters === undefined) {
      // this shouldn't really happen, but just incase
      notifications.show({
        title: "Error",
        message: "Number of voters must be provided.",
        color: "red",
      });
      return;
    }

    if (v.numVoters) {
      createPointEntry({ ...v, numVoters });
    }
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
          autoFocus
          requireNumVoters
        />
      </Modal>
    </div>
  );
};
