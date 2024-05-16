"use client";

import { Button, Checkbox, NumberInput, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { type Person, type PointEntry } from "@prisma/client";
import { useState, type FormEvent } from "react";

export interface PointSubmit {
  personId: number;
  points: number;
  numVoters?: number;
  date?: Date;
  wasDouble: boolean;
  wasTriple: boolean;
}

export interface PointFormProps {
  onSubmit: (v: PointSubmit) => void;
  onReset: () => void;
  isPending: boolean;
  people: Person[];
  defaultPoint?: PointEntry;
  autoFocus?: boolean;
  requireNumVoters?: boolean;
}

export const PointForm = ({
  people,
  onSubmit,
  onReset,
  autoFocus = false,
  requireNumVoters = false,
  isPending,
  defaultPoint,
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

    onSubmit({
      personId,
      points,
      date: date ?? undefined,
      wasDouble,
      wasTriple,
      numVoters: isNaN(numVoters) ? undefined : numVoters,
    });
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
        required={requireNumVoters}
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
