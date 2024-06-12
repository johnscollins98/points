import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { DateFilerForm } from "./_components/DateFilterForm";
import { CreatePoint } from "./_components/PointEntry/CreatePoint";
import { PointTable } from "./_components/PointEntry/PointTable";
import { getDateFilterObject } from "./_utils/getDateFilterObject";

export default async function Entries({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { startDate, endDate, name } = searchParams;
  const filterDates = getDateFilterObject(startDate, endDate);

  const session = await getServerAuthSession();

  const points = await api.point.getAll({
    ...filterDates,
    filterPerson: typeof name === "string" ? name : undefined,
  });
  const people = await api.person.getAllWithPointTotal(filterDates);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Filter</h2>
        <DateFilerForm />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Point Entries</h2>
        <div>{session?.user.isAdmin && <CreatePoint people={people} />}</div>
        <PointTable pointEntries={points} people={people} />
      </div>
    </div>
  );
}
