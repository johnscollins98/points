"use client";

import { CloseButton, Table } from '@mantine/core';
import { FaCheck } from 'react-icons/fa';
import { type api as ServerAPI } from '~/trpc/server';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';

export interface PointTableProps {
  pointEntries: Awaited<ReturnType<typeof ServerAPI.point.getAll>>
}

export const PointTable = ({ pointEntries }: PointTableProps) => {
  const router = useRouter();

  const { mutate: deleteEntry } = api.point.deleteById.useMutation({
    onSuccess: () => router.refresh()
  });

  const onDelete = (id: number) => {
    deleteEntry(id);
  }

  return (<Table>
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
          <Table.Td><CloseButton onClick={() => onDelete(pointEntry.id)} /></Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>)
}