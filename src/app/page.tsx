import { api } from "~/trpc/server";
import { PointForm } from './_components/PointForm';
import { UserForm } from './_components/UserForm';

export default async function Home() {
  const points = await api.point.getAll();
  const people = await api.person.getAll();

  return (
    <main className='flex'>
      <div className="flex-grow">
        <h2>Points</h2>
        {points.map((pointEntry) => (
          <div key={pointEntry.id} className='flex gap-1'>
            <b>{pointEntry.Person.name}</b>
            <div>{pointEntry.points}</div>
          </div>
        ))}
        <PointForm people={people} />
      </div>
      <div className='w-1/4'>
        <h2>Users</h2>
        <ul>
          {people.map((user) => <li key={user.id}>{user.name}</li>)}
        </ul>
        <UserForm />
      </div>
    </main>
  );
}
