import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { AdminForm } from "./_components/AdminForm";
import { CreatePoint } from "./_components/CreatePoint";
import { DateFilerForm } from "./_components/DateFilterForm";
import { PersonForm } from "./_components/PersonForm";
import { PersonTable } from "./_components/PersonTable";
import { PointTable } from "./_components/PointTable";
import { SessionForm } from "./_components/SessionForm";
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
    <main className="flex flex-col-reverse justify-between gap-4 overflow-auto p-4 md:max-h-svh md:flex-row md:overflow-hidden">
      <div className="flex flex-grow flex-col gap-3 md:max-h-full md:overflow-auto">
        <PointTable pointEntries={points} people={people} />
      </div>
      <div className="flex flex-col gap-6 md:overflow-auto md:pr-2">
        <SessionForm session={session} />
        <DateFilerForm />
        <div className="flex flex-col gap-4">
          <PersonTable people={people} />
          {session?.user.isAdmin && <PersonForm />}
          {session?.user.isAdmin && <CreatePoint people={people} />}
          {session?.user.isSuperuser && <AdminForm />}
        </div>
      </div>
    </main>
  );
}
