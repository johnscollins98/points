import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { PersonForm } from "./_components/Person/PersonForm";
import { PersonTable } from "./_components/Person/PersonTable";

export default async function Home() {
  const session = await getServerAuthSession();
  const people = await api.person.getAllWithPointTotal();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Leaderboard</h2>
      {session?.user.isAdmin && <PersonForm />}
      <PersonTable people={people} />
    </div>
  );
}
