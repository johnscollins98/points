"use client";

import { Button, Checkbox, NumberInput, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { type Person, type PointEntry } from "@prisma/client";
import { useState, type FormEvent } from "react";

export interface PointSubmit<TRequireNumVoters extends number | null> {
  personId: number;
  points: number;
  numVoters: TRequireNumVoters;
  date?: Date;
  wasDouble: boolean;
  wasTriple: boolean;
}

export type PointFormProps = {
  onReset: () => void;
  isPending: boolean;
  people: Person[];
  defaultPoint?: PointEntry;
  autoFocus?: boolean;
} & (
  | {
      requireNumVoters: true;
      onSubmit: (v: PointSubmit<number>) => void;
    }
  | {
      requireNumVoters?: false;
      onSubmit: (v: PointSubmit<number | null>) => void;
    }
);

export const PointForm = ({
  people,
  onReset,
  autoFocus = false,
  isPending,
  defaultPoint,
  ...props
}: PointFormProps) => {
  const [personId, setPersonId] = useState(defaultPoint?.personId ?? NaN);
  const [points, setPoints] = useState(defaultPoint?.points ?? NaN);
  const [date, setDate] = useState<Date | null>(
    defaultPoint?.date ?? new Date(),
  );
  const [wasDouble, setWasDouble] = useState(defaultPoint?.wasDouble ?? false);
  const [wasTriple, setWasTriple] = useState(defaultPoint?.wasTriple ?? false);
  const [numVoters, setNumVoters] = useState(defaultPoint?.numVoters ?? NaN);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const toSubmit = {
      personId,
      points,
      date: date ?? undefined,
      wasDouble,
      wasTriple,
    };

    if (props.requireNumVoters) {
      if (isNaN(numVoters)) {
        notifications.show({
          title: "Error",
          message: "Number of voters must be provided.",
          color: "red",
        });
        return;
      }

      props.onSubmit({
        ...toSubmit,
        numVoters,
      });
    } else {
      props.onSubmit({
        ...toSubmit,
        numVoters: isNaN(numVoters) ? null : numVoters,
      });
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      onReset={onReset}
      className="flex flex-col gap-3"
    >
      <Select
        value={personId.toString()}
        onChange={(v) => v && setPersonId(parseInt(v))}
        data={people.map((person) => ({
          value: person.id.toString(),
          label: person.name,
        }))}
        label="Person"
        placeholder="Select a person..."
        searchable
        autoFocus={autoFocus}
        required
      />
      <NumberInput
        label="Points"
        value={points}
        required
        placeholder="Total number of points..."
        onChange={(value) => setPoints(parseInt(value.toString()))}
      />
      <NumberInput
        label="Number of Voters"
        value={numVoters}
        required={props.requireNumVoters}
        placeholder="Number of people voting..."
        onChange={(value) => setNumVoters(parseInt(value.toString()))}
      />
      <DateInput value={date} onChange={setDate} label="Date" />
      <Checkbox
        label="Was Double Points?"
        checked={wasDouble}
        disabled={wasTriple}
        onChange={(e) => setWasDouble(e.currentTarget.checked)}
      />
      <Checkbox
        label="Was Triple Points?"
        checked={wasTriple}
        disabled={wasDouble}
        onChange={(e) => setWasTriple(e.currentTarget.checked)}
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
  );
};
