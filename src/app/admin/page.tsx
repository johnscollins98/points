import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { AdminFormClient } from "./_components/AdminFormClient";

export default async function Admin() {
  const session = await getServerAuthSession();
  if (!session?.user.isSuperuser) {
    redirect("/");
  }

  const users = await api.admin.getAllUsers();

  return <AdminFormClient users={users} />;
}
