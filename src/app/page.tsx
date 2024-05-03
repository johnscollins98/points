import { api } from "~/trpc/server";
import { PointForm } from './_components/PointForm';

export default async function Home() {
  const pointEntries = await api.points.getAll();

  return (
    <main>
      <div className="point-entries">
        {pointEntries.map((pointEntry) => (
          <div key={pointEntry.id} className='flex gap-1'>
            <b>{pointEntry.person}</b>
            <div>{pointEntry.points}</div>
          </div>
        ))}
      </div>
      <PointForm />
    </main>
  );
}
