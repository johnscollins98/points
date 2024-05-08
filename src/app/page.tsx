import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { AdminForm } from "./_components/Admin/AdminForm";
import { SessionForm } from "./_components/Auth/SessionForm";
import { DateFilerForm } from "./_components/DateFilterForm";
import { PersonForm } from "./_components/Person/PersonForm";
import { PersonTable } from "./_components/Person/PersonTable";
import { CreatePoint } from "./_components/PointEntry/CreatePoint";
import { PointTable } from "./_components/PointEntry/PointTable";
import { getDateFilterObject } from "./_utils/getDateFilterObject";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerAuthSession();

  const { startDate, endDate, name } = searchParams;
  const filterDates = getDateFilterObject(startDate, endDate);

  const points = await api.point.getAll({
    ...filterDates,
    filterPerson: typeof name === "string" ? name : undefined,
  });
  const people = await api.person.getAllWithPointTotal(filterDates);

  return (
    <main className="flex flex-col-reverse justify-between gap-4 overflow-auto p-4 lg:max-h-svh lg:flex-row lg:overflow-hidden">
      <div className="flex max-h-80 flex-grow flex-col gap-3 overflow-auto lg:max-h-[unset]">
        <PointTable pointEntries={points} people={people} />
      </div>
      <div className="flex flex-col gap-6 lg:overflow-auto lg:pr-2">
        <SessionForm session={session} />
        <DateFilerForm />
        <div className="flex flex-col gap-4">
          <PersonTable people={people} />
          {session?.user.isAdmin && <PersonForm />}
          {session?.user.isAdmin && <CreatePoint people={people} />}
        </div>
        {session?.user.isSuperuser && <AdminForm />}
      </div>
    </main>
  );
}
