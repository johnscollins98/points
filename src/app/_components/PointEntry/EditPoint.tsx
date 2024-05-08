"use client";

import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { type Person } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type PointEntryWithPerson } from "~/server/api/routers/points";
import { api } from "~/trpc/react";
import { PointForm, type PointSubmit } from "./PointForm";

export interface EditPointProps {
  people: Person[];
  defaultPoint: PointEntryWithPerson | null;
  clearDefaultPoint: () => void;
}

export const EditPoint = ({
  people,
  defaultPoint,
  clearDefaultPoint,
}: EditPointProps) => {
  const router = useRouter();
  const { mutate: updatePointEntry, isPending } = api.point.update.useMutation({
    onSuccess: () => router.refresh(),
    onError: () =>
      notifications.show({
        title: "Error",
        message: "An error occurred updating the point entry, please try again",
        color: "red",
      }),
  });

  const closeHandler = () => {
    clearDefaultPoint();
  };

  const submitHandler = (v: PointSubmit) => {
    if (defaultPoint) {
      updatePointEntry({ point: v, id: defaultPoint.id });
      closeHandler();
    }
  };

  return (
    <Modal
      opened={defaultPoint !== null}
      onClose={closeHandler}
      centered
      trapFocus={false}
      title="Edit Point Entry"
    >
      {defaultPoint && (
        <PointForm
          onSubmit={submitHandler}
          onReset={closeHandler}
          isPending={isPending}
          people={people}
          defaultPoint={defaultPoint}
        />
      )}
    </Modal>
  );
};
