import { api } from "~/trpc/server";
import { PointForm } from "./_components/PointForm";
import { UserForm } from "./_components/UserForm";
import { UserTable } from "./_components/UserTable";
import { DateFilerForm } from './_components/DateFilterForm';
import { getDateFilterObject } from './_utils/getDateFilterObject';

export default async function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined>}) {
  const { startDate, endDate } = searchParams;
  const filterDates = getDateFilterObject(startDate, endDate);

  const points = await api.point.getAll(filterDates);
  const people = await api.person.getAllWithPointTotal(filterDates);

  return (
    <main className="flex flex-col-reverse justify-between gap-4 p-4 md:flex-row">
      <div>
        <h2>Points</h2>
        {points.map((pointEntry) => (
          <div key={pointEntry.id} className="flex gap-1">
            <b>{pointEntry.Person.name}</b>
            <div>{pointEntry.points}</div>
            <div>{pointEntry.date.toLocaleDateString()}</div>
          </div>
        ))}
        <PointForm people={people} />
      </div>
      <div className='flex flex-col gap-6'>
        <DateFilerForm />
        <div className="flex flex-col gap-3">
          <UserTable people={people} />
          <UserForm />
        </div>
      </div>
    </main>
  );
}
