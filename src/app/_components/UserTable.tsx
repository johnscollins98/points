"use client";

import { Table } from "@mantine/core";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { type PersonWithPointTotals } from "~/server/api/routers/person";

export interface UserTableProps {
  people: PersonWithPointTotals[];
}

const headers: { label: string; id: keyof PersonWithPointTotals }[] = [
  { label: "Name", id: "name" },
  { label: "Points", id: "pointTotal" },
  { label: "Total Items", id: "totalEntries" },
  { label: "Average", id: "pointAverage" },
];

export const UserTable = ({ people }: UserTableProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const filterByName = params.get("name");

  const [sortBy, setSortBy] =
    useState<keyof PersonWithPointTotals>("pointTotal");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedPeople = useMemo(
    () =>
      people.sort((personA, personB) => {
        const valA = personA[sortBy];
        const valB = personB[sortBy];

        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc"
            ? valB.localeCompare(valA)
            : valA.localeCompare(valB);
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        return 0;
      }),
    [people, sortBy, sortDirection],
  );

  const headerClickHandler = (headerId: keyof PersonWithPointTotals) => {
    if (headerId === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(headerId);
      setSortDirection("desc");
    }
  };

  const nameClickHandler = (name: string) => {
    const newParams = new URLSearchParams(params);

    if (filterByName === name) {
      newParams.delete("name");
    } else {
      newParams.set("name", name);
    }

    const query = newParams.toString();
    router.push(`${pathname}?${query}`);
  };

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {headers.map((header) => (
            <Table.Th
              key={header.id}
              onClick={() => headerClickHandler(header.id)}
            >
              <div className="flex items-center gap-1">
                {header.label}
                {sortBy === header.id &&
                  (sortDirection === "asc" ? (
                    <RxCaretUp size={20} />
                  ) : (
                    <RxCaretDown size={20} />
                  ))}
              </div>
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {sortedPeople.map((person) => (
          <Table.Tr key={person.id}>
            <Table.Td
              onClick={() => nameClickHandler(person.name)}
              className={`cursor-pointer select-none ${filterByName === person.name ? "font-bold" : ""}`}
            >
              {person.name}
            </Table.Td>
            <Table.Td>{person.pointTotal}</Table.Td>
            <Table.Td>{person.totalEntries}</Table.Td>
            <Table.Td>
              {person.pointAverage.toLocaleString(undefined, {
                maximumSignificantDigits: 3,
              })}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
