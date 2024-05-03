"use client";

import { Button, Checkbox, Modal, NumberInput, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

export const PointForm = () => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [itemNumber, setItemNumber] = useState(0);
  const [wasDouble, setWasDouble] = useState(false);

  const router = useRouter();
  const { mutate: createPointEntry, isPending } = api.points.create.useMutation(
    {
      onSuccess: () => router.refresh(),
    },
  );

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    createPointEntry({ person: name, points, itemNumber, wasDouble });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create new</Button>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        centered
        title="Create Point Entry"
      >
        <form
          onSubmit={submitHandler}
          onReset={() => setOpen(false)}
          className="flex flex-col gap-3"
        >
          <TextInput
            label="Name"
            value={name}
            placeholder="Enter the person's name..."
            required
            onChange={(e) => setName(e.target.value)}
          />
          <NumberInput
            label="Points"
            value={points}
            required
            placeholder="Total number of points..."
            onChange={(value) => setPoints(parseInt(value.toString()))}
          />
          <TextInput
            label="Item Number"
            value={itemNumber}
            required
            placeholder="Work item number..."
            onChange={(e) => setItemNumber(parseInt(e.target.value))}
          />
          <Checkbox
            label="Was Double Points?"
            checked={wasDouble}
            onChange={(e) => setWasDouble(e.currentTarget.checked)}
          />
          <div className="flex justify-end gap-3">
            <Button type="reset" variant="default" disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
