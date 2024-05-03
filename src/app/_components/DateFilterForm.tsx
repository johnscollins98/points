"use client";

import { Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getDateFilterObject } from "../_utils/getDateFilterObject";

export const DateFilerForm = () => {
  const params = useSearchParams();
  const startParam = params.get("startDate");
  const endParam = params.get("endDate");
  const dateFilterObj = getDateFilterObject(startParam, endParam);

  const router = useRouter();
  const pathname = usePathname();

  const [startDate, setStartDate] = useState<Date | null>(
    dateFilterObj.startDate ?? null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    dateFilterObj.endDate ?? null,
  );

  const resetHandler = () => {
    setStartDate(null);
    setEndDate(null);
    router.push(pathname);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const params: Record<string, string> = {};
    if (startDate) {
      params.startDate = startDate.toISOString();
    }

    if (endDate) {
      params.endDate = endDate.toISOString();
    }

    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();

    router.push(`${pathname}?${query}`);
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={submitHandler}
      onReset={resetHandler}
    >
      <DateInput
        value={startDate}
        onChange={setStartDate}
        maxDate={endDate ?? undefined}
        clearable
        label="Start Date"
      />
      <DateInput
        value={endDate}
        onChange={setEndDate}
        minDate={startDate ?? undefined}
        clearable
        label="End Date"
      />
      <div className="flex justify-end gap-2">
        <Button variant="default" type="reset">
          Reset
        </Button>
        <Button type="submit">Filter By Date</Button>
      </div>
    </form>
  );
};
