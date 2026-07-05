import { ReactNode } from "react";
import { requireUser } from "../lib/hook";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { signOut } from "../lib/auth";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: { userName: true, grantId: true },
  });
  if (!data?.userName) redirect("/onboarding");
  if (!data?.grantId) redirect("/onboarding/grant-id");
  return data;
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser();
  await getData(session.user?.id as string);

  return (
    <>
      <DashboardShell
        userImage={session.user?.image}
        userName={session.user?.name}
        logoutFormAction={
          <form
            className="w-full"
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="w-full cursor-pointer text-left">
              Log out
            </button>
          </form>
        }
      >
        {children}
      </DashboardShell>
      <Toaster richColors closeButton />
    </>
  );
}
