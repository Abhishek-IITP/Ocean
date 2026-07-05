import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { VaultManager, VaultItemView } from "@/components/vault/VaultManager";

export default async function VaultPage() {
  const session = await requireUser();
  // Only metadata is loaded here — ciphertext never reaches the initial render.
  const items = await prisma.vaultItem.findMany({
    where: { userId: session.user!.id as string },
    select: { id: true, title: true, category: true, username: true, url: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl animate-rise">
      <PageHeader
        title="Vault"
        description="Your valuables, kept quietly out of sight — passwords, keys and private notes, encrypted at rest."
      />
      <VaultManager items={items as VaultItemView[]} />
    </div>
  );
}
