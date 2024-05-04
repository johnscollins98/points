import { api } from "~/trpc/server";
import { CreatePoint } from "./_components/CreatePoint";
import { DateFilerForm } from "./_components/DateFilterForm";
import { PointTable } from "./_components/PointTable";
import { UserForm } from "./_components/UserForm";
import { UserTable } from "./_components/UserTable";
import { getDateFilterObject } from "./_utils/getDateFilterObject";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { startDate, endDate, name } = searchParams;
  const filterDates = getDateFilterObject(startDate, endDate);

  const points = await api.point.getAll({
    ...filterDates,
    filterPerson: typeof name === "string" ? name : undefined,
  });
  const people = await api.person.getAllWithPointTotal(filterDates);

  return (
    <main className="flex flex-col-reverse justify-between gap-4 overflow-auto p-4 md:max-h-svh md:flex-row md:overflow-hidden">
      <div className="flex flex-grow flex-col gap-3 md:max-h-full md:overflow-auto">
        <PointTable pointEntries={points} people={people} />
      </div>
      <div className="flex flex-col gap-6 md:overflow-auto md:pr-2">
        <DateFilerForm />
        <div className="flex flex-col gap-4">
          <UserTable people={people} />
          <UserForm />
          <CreatePoint people={people} />
        </div>
      </div>
    </main>
  );
}
