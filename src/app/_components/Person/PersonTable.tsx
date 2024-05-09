"use client";

import { ActionIcon, Button, CloseIcon, Modal, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { type PersonWithPointTotals } from "~/server/api/routers/person";
import { api } from "~/trpc/react";

export interface PersonTableProps {
  people: PersonWithPointTotals[];
}

const headers: { label: string; id: keyof PersonWithPointTotals }[] = [
  { label: "Name", id: "name" },
  { label: "Points", id: "pointTotal" },
  { label: "Total Items", id: "totalEntries" },
  { label: "Average", id: "pointAverage" },
];

export const PersonTable = ({ people }: PersonTableProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const filterByName = params.get("name");

  const { data: session } = useSession();

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

  const [toDelete, setToDelete] = useState<PersonWithPointTotals | null>(null);

  const { mutate: deletePerson } = api.person.delete.useMutation({
    onSuccess: () => router.refresh(),
    onError: () =>
      notifications.show({
        title: "Error",
        message: "An error occurred deleting the person, please try again",
        color: "red",
      }),
  });

  const deletePersonHandler = (
    e: FormEvent<HTMLFormElement>,
    person: PersonWithPointTotals | null,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (person) {
      deletePerson(person.id);
      setToDelete(null);
    }
  };

  return (
    <div className="max-h-80 overflow-y-auto overflow-x-hidden">
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
            {session?.user.isAdmin && <Table.Th></Table.Th>}
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
              {session?.user.isAdmin && (
                <Table.Td>
                  <ActionIcon onClick={() => setToDelete(person)}>
                    <CloseIcon></CloseIcon>
                  </ActionIcon>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Modal
        title={`Delete ${toDelete?.name}`}
        opened={toDelete !== null}
        onClose={() => setToDelete(null)}
        centered
      >
        <form
          onSubmit={(e) => deletePersonHandler(e, toDelete)}
          onReset={() => setToDelete(null)}
          className="flex flex-col gap-2"
        >
          Are you sure you want to delete {toDelete?.name}? It will also remove
          all their points.
          <div className="flex justify-end gap-1">
            <Button variant="default" type="reset">
              No
            </Button>
            <Button color="red" type="submit">
              Yes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
