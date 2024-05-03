"use client";

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { api } from '~/trpc/react';

export const PointForm = () => {
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [itemNumber, setItemNumber] = useState(0);
  const [wasDouble, setWasDouble] = useState(false);

  const router = useRouter();
  const { mutate: createPointEntry, isPending } = api.points.create.useMutation({
    onSuccess: () => router.refresh()
  });

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    createPointEntry({ person: name, points, itemNumber, wasDouble });
  }

  return (
    <form onSubmit={submitHandler}>
      <h2>Create Point Entry</h2>
      <label>
        Name: 
        <input className='border-gray-300 border rounded-md' type="text" value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Points:
        <input className='border-gray-300 border rounded-md' type="number" value={points} onChange={e => setPoints(parseInt(e.target.value))} />
      </label>
      <label>
        Item:
        <input className='border-gray-300 border rounded-md' type="number" value={itemNumber} onChange={e => setItemNumber(parseInt(e.target.value))} />
      </label>
      <label>
        <input type="checkbox" checked={wasDouble} onClick={() => setWasDouble(!wasDouble)} />
        Was Double Points?
      </label>
      <button type="submit" disabled={isPending}>Submit</button>
    </form>
  )
}