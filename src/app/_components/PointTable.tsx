"use client";

import { Table } from '@mantine/core';
import { type api } from '~/trpc/server';
import { FaCheck} from 'react-icons/fa';

export interface PointTableProps {
  pointEntries: Awaited<ReturnType<typeof api.point.getAll>>
}

export const PointTable = ({ pointEntries }: PointTableProps) => {
  return (<Table>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Name</Table.Th>
        <Table.Th>Points</Table.Th>
        <Table.Th>Double?</Table.Th>
        <Table.Th>Date</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {pointEntries.map((pointEntry) => (
        <Table.Tr key={pointEntry.id}>
          <Table.Td>{pointEntry.Person.name}</Table.Td>
          <Table.Td>{pointEntry.points}</Table.Td>
          <Table.Td>{pointEntry.wasDouble ? <FaCheck /> : null}</Table.Td>
          <Table.Td>{pointEntry.date.toLocaleDateString()}</Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>)
}