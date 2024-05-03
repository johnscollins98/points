import { api } from "~/trpc/server";
import { PointForm } from "./_components/PointForm";
import { UserForm } from "./_components/UserForm";
import { UserTable } from "./_components/UserTable";
import { DateFilerForm } from './_components/DateFilterForm';
import { getDateFilterObject } from './_utils/getDateFilterObject';
import { PointTable } from './_components/PointTable';

export default async function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined>}) {
  const { startDate, endDate, name } = searchParams;
  const filterDates = getDateFilterObject(startDate, endDate);

  const points = await api.point.getAll({ ...filterDates, filterPerson: typeof name === 'string' ? name : undefined });
  const people = await api.person.getAllWithPointTotal(filterDates);

  return (
    <main className="flex flex-col-reverse justify-between gap-4 p-4 overflow-auto md:flex-row md:overflow-hidden md:max-h-svh">
      <div className='flex flex-col flex-grow gap-3 md:max-h-full md:overflow-auto'>
        <PointTable pointEntries={points} />
      </div>
      <div className='flex flex-col gap-6 md:overflow-auto md:pr-2'>
        <DateFilerForm />
        <div className="flex flex-col gap-4">
          <UserTable people={people} />
          <UserForm />
          <PointForm people={people} />
        </div>
      </div>
    </main>
  );
}
