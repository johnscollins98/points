"use client";

import { Button, Checkbox, Modal, NumberInput, Select, TextInput } from "@mantine/core";
import { type Person } from '@prisma/client';
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

export interface PointFormProps {
  people: Person[];
}

export const PointForm = ({ people }: PointFormProps) => {
  const [open, setOpen] = useState(false);

  const [personId, setPersonId] = useState(0);
  const [points, setPoints] = useState(0);
  const [itemNumber, setItemNumber] = useState(0);
  const [wasDouble, setWasDouble] = useState(false);

  const router = useRouter();
  const { mutate: createPointEntry, isPending } = api.point.create.useMutation(
    {
      onSuccess: () => router.refresh(),
    },
  );

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    createPointEntry({ person: personId, points, itemNumber, wasDouble });

    setOpen(false);
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
          <Select 
            value={personId.toString()} 
            onChange={v => v && setPersonId(parseInt(v))}
            data={people.map((person) => ({ value: person.id.toString(), label: person.name }))} 
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
