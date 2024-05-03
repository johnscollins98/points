"use client";

import { Button, Checkbox, Modal, NumberInput, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { type Person } from '@prisma/client';
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

export interface PointFormProps {
  people: Person[];
}

export const PointForm = ({ people }: PointFormProps) => {
  const [open, setOpen] = useState(false);

  const [personId, setPersonId] = useState(NaN);
  const [points, setPoints] = useState(NaN);
  const [date, setDate] = useState<Date | null>(new Date());
  const [wasDouble, setWasDouble] = useState(false);

  const router = useRouter();
  const { mutate: createPointEntry, isPending } = api.point.create.useMutation(
    {
      onSuccess: () => router.refresh(),
    },
  );

  const closeHandler = () => {
    setPersonId(NaN);
    setPoints(NaN);
    setWasDouble(false);
    setOpen(false);
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    createPointEntry({ person: personId, points, wasDouble, date: date ?? undefined });

    closeHandler();
  };

  return (
    <div className='flex justify-start'>
      <Button onClick={() => setOpen(true)}>Create new</Button>
      <Modal
        opened={open}
        onClose={closeHandler}
        centered
        title="Create Point Entry"
      >
        <form
          onSubmit={submitHandler}
          onReset={closeHandler}
          className="flex flex-col gap-3"
        >
          <Select 
            value={personId.toString()} 
            onChange={v => v && setPersonId(parseInt(v))}
            data={people.map((person) => ({ value: person.id.toString(), label: person.name }))} 
            label="Person"
            placeholder='Select a person...'
            searchable
            required
          />
          <NumberInput
            label="Points"
            value={points}
            required
            placeholder="Total number of points..."
            onChange={(value) => setPoints(parseInt(value.toString()))}
          />
          <DateInput value={date} onChange={setDate} label="Date" />
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
    </div>
  );
};
