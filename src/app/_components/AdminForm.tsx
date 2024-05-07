import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { AdminFormClient } from "./AdminFormClient";

export const AdminForm = async () => {
  const session = await getServerAuthSession();
  if (!session?.user.isSuperuser) return null;

  const users = await api.admin.getAllUsers();

  return <AdminFormClient users={users} />;
};
