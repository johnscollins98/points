"use client";

import { AppShell, Burger, Group, NavLink, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";
import { SessionForm } from "./Auth/SessionForm";

export const AppContainer = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group
          h="100%"
          display="flex"
          flex="1"
          px="md"
          justify="space-between"
          wrap="nowrap"
        >
          <div className="flex items-center gap-2 align-middle">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={1} size="h3">
              <Link href="/">Points</Link>
            </Title>
          </div>
          <SessionForm />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <NavbarLink href="/" close={close}>
          Leaderboard
        </NavbarLink>
        <NavbarLink href="/entries" close={close}>
          Point Entries
        </NavbarLink>
        {session?.user.isSuperuser && (
          <NavbarLink href="/admin" close={close}>
            Admin
          </NavbarLink>
        )}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

interface NavbarLinkProps extends PropsWithChildren {
  href: string;
  close: () => void;
}

const NavbarLink = ({ href, close, children }: NavbarLinkProps) => {
  const pathname = usePathname();
  return (
    <NavLink
      component={Link}
      variant="subtle"
      href={href}
      active={pathname === href}
      label={children}
      onClick={close}
      className="px-3 py-3 font-semibold"
    />
  );
};
