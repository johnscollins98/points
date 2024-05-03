"use client";

import { Modal } from "@mantine/core";
import { type Person } from '@prisma/client';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { PointForm, type PointSubmit } from './PointForm';

export interface EditPointProps {
  people: Person[];
  defaultPoint: PointSubmit & { id: number } | null;
  clearDefaultPoint: () => void;
}

export const EditPoint = ({ people, defaultPoint, clearDefaultPoint }: EditPointProps) => {
  const router = useRouter();
  const { mutate: updatePointEntry, isPending } = api.point.update.useMutation(
    {
      onSuccess: () => router.refresh(),
    },
  );

  const closeHandler = () => {
    clearDefaultPoint();
  }

  const submitHandler = (v: PointSubmit) => {
    if (defaultPoint) {
      updatePointEntry({ ...v, id: defaultPoint.id });
      closeHandler();
    }
  };

  return (
    <Modal
      opened={defaultPoint !== null}
      onClose={closeHandler}
      centered
      title="Edit Point Entry"
    >
      {defaultPoint && <PointForm onSubmit={submitHandler} onReset={closeHandler} isPending={isPending} people={people} defaultPoint={defaultPoint} />}
    </Modal>
  );
};
