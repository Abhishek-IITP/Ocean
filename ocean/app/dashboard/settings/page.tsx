import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hook";
import { SettingsForm } from "@/components/SettingsForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true, image: true },
  });
  if (!data) return notFound();
  return data;
}

export default async function SettingsRoute() {
  const session = await requireUser();
  const data = await getData(session.user!.id as string);
  return (
    <div className="mx-auto max-w-2xl animate-rise">
      <PageHeader
        title="Settings"
        description="Manage your profile and how you appear to people who book with you."
      />
      <SettingsForm
        email={data.email}
        fullName={data.name as string}
        profileImage={data.image as string}
      />
    </div>
  );
}
