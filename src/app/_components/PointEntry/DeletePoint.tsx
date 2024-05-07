"use client";

import { Button, Modal } from "@mantine/core";
import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import { type PointEntryWithPerson } from "~/server/api/routers/points";
import { api } from "~/trpc/react";

export interface DeletePointProps {
  pointToDelete: PointEntryWithPerson | null;
  onCancel: () => void;
}

export const DeletePoint = ({ pointToDelete, onCancel }: DeletePointProps) => {
  const router = useRouter();

  const { mutate: deletePointEntry } = api.point.deleteById.useMutation({
    onSuccess: () => router.refresh(),
  });

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (pointToDelete) {
      deletePointEntry(pointToDelete.id);
      onCancel();
    }
  };

  return (
    <Modal
      opened={pointToDelete !== null}
      onClose={onCancel}
      centered
      title="Delete Point Entry"
      trapFocus={false}
    >
      <form
        onSubmit={submitHandler}
        onReset={onCancel}
        className="flex flex-col gap-3"
        autoFocus
      >
        <div>Are you sure you want to delete the point?</div>
        <div className="flex justify-end gap-2">
          <Button variant="default" type="reset">
            No
          </Button>
          <Button color="red" type="submit" autoFocus>
            Yes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
