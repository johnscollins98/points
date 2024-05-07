"use client";

import { ActionIcon, CloseIcon, Table } from "@mantine/core";
import { type Person } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RxPencil1 } from "react-icons/rx";
import { type PointEntryWithPerson } from "~/server/api/routers/points";
import { DeletePoint } from "./DeletePoint";
import { EditPoint } from "./EditPoint";

export interface PointTableProps {
  pointEntries: PointEntryWithPerson[];
  people: Person[];
}

export const PointTable = ({ pointEntries, people }: PointTableProps) => {
  const { data: session } = useSession();

  const [toDelete, setToDelete] = useState<PointEntryWithPerson | null>(null);
  const onDelete = (point: PointEntryWithPerson) => {
    setToDelete(point);
  };

  const [toEdit, setToEdit] = useState<PointEntryWithPerson | null>(null);
  const onEdit = (toEdit: PointEntryWithPerson) => {
    setToEdit(toEdit);
  };

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Points</Table.Th>
            <Table.Th>Double?</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pointEntries.map((pointEntry) => (
            <Table.Tr key={pointEntry.id}>
              <Table.Td>{pointEntry.Person.name}</Table.Td>
              <Table.Td>{pointEntry.points}</Table.Td>
              <Table.Td>{pointEntry.wasDouble ? <FaCheck /> : null}</Table.Td>
              <Table.Td>{pointEntry.date.toLocaleDateString("en-GB")}</Table.Td>
              <Table.Td>
                {session?.user.isAdmin && (
                  <div className="flex items-center gap-1">
                    <ActionIcon onClick={() => onEdit(pointEntry)}>
                      <RxPencil1 />
                    </ActionIcon>
                    <ActionIcon onClick={() => onDelete(pointEntry)}>
                      <CloseIcon />
                    </ActionIcon>
                  </div>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <DeletePoint
        pointToDelete={toDelete}
        onCancel={() => setToDelete(null)}
      />
      <EditPoint
        clearDefaultPoint={() => setToEdit(null)}
        defaultPoint={toEdit}
        people={people}
      />
    </>
  );
};
