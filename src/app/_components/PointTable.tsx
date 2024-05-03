"use client";

import { ActionIcon, CloseIcon, Table } from "@mantine/core";
import { type Person } from '@prisma/client';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { RxPencil1 } from "react-icons/rx";
import { api } from "~/trpc/react";
import { type api as ServerAPI } from "~/trpc/server";
import { EditPoint } from './EditPoint';

export interface PointTableProps {
  pointEntries: Awaited<ReturnType<typeof ServerAPI.point.getAll>>;
  people: Person[];
}

export const PointTable = ({ pointEntries, people }: PointTableProps) => {
  const router = useRouter();

  const { mutate: deleteEntry } = api.point.deleteById.useMutation({
    onSuccess: () => router.refresh(),
  });

  const onDelete = (id: number) => {
    deleteEntry(id);
  };

  const [toEdit, setToEdit] = useState<PointTableProps["pointEntries"][number] | null>(null);
  const onEdit = (toEdit: PointTableProps["pointEntries"][number]) => {
    setToEdit(toEdit);
  }

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
              <Table.Td>{pointEntry.date.toLocaleDateString()}</Table.Td>
              <Table.Td>
                <div className="flex items-center gap-1">
                  <ActionIcon onClick={() => onEdit(pointEntry)}>
                    <RxPencil1 />
                  </ActionIcon>
                  <ActionIcon onClick={() => onDelete(pointEntry.id)}>
                    <CloseIcon />
                  </ActionIcon>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <EditPoint clearDefaultPoint={() => setToEdit(null)} defaultPoint={toEdit} people={people} />
    </>
  );
};
