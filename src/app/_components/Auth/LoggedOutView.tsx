"use client";

import { Button, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const ErrorMessageMap: Record<string, string> = {
  OAuthSignin: "Error constructing OAuth URL",
  OAuthCallback: "Error handling auth response",
  OAuthCreateAccount: "Error creating user in the database",
  EmailCreateAccount: "Error creating user in the database",
  Callback: "Error handling auth response",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally",
  EmailSignin: "Sending email with verification token failed",
  CredentialsSignin: "Incorrect credentials",
  SessionRequired: "You must be signed in to view this content",
  Default: "An unknown sign in error occurred",
} as const;

export const LoggedOutView = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  const params = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const error = params.get("error");
    if (error) {
      notifications.clean();
      notifications.show({
        title: "Error signing in",
        message: ErrorMessageMap[error] ?? ErrorMessageMap.Default,
        color: "red",
        onClose: () => {
          const newParams = new URLSearchParams(params);
          newParams.delete("error");
          newParams.delete("callbackUrl");
          router.push(`${pathname}?${newParams.toString()}`);
        },
      });
    }
  }, [params, router, pathname]);

  return (
    <>
      <div className="flex items-center justify-end">
        <Button variant="subtle" onClick={() => setLoginOpen(true)}>
          Admin Sign In
        </Button>
      </div>
      <Modal
        opened={loginOpen}
        onClose={() => setLoginOpen(false)}
        size="sm"
        centered
        title="Sign in"
      >
        <div className="flex flex-col gap-4">
          Please select a provider to sign in with.
          <Button
            className="bg-[#7289da] transition-opacity duration-75 hover:bg-[#7289da] hover:opacity-90"
            size="lg"
            leftSection={<FaDiscord size={24} />}
            onClick={() => signIn("discord")}
          >
            Discord
          </Button>
          <Button
            size="lg"
            leftSection={<FaGithub size={24} />}
            className="bg-[#313840] text-white transition-opacity duration-75 hover:bg-[#313840] hover:text-white  hover:opacity-90"
            onClick={() => signIn("github")}
          >
            Github
          </Button>
          <Button
            size="lg"
            leftSection={<FcGoogle size={24} />}
            className="bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-800"
            onClick={() => signIn("google")}
          >
            Google
          </Button>
        </div>
      </Modal>
    </>
  );
};
