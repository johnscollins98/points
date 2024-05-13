import { notifications } from "@mantine/notifications";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "~/server/api/root";

export const errorToast = (
  e: TRPCClientErrorLike<AppRouter>,
  fallbackMessage: string,
) => {
  if (e.data?.zodError) {
    Object.values(e.data.zodError.fieldErrors).map((err) =>
      notifications.show({
        title: "Error",
        message: err,
        color: "red",
      }),
    );
  } else {
    notifications.show({
      title: "Error",
      message: fallbackMessage,
      color: "red",
    });
  }
};
