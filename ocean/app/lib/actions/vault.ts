"use server";

import prisma from "../db";
import { requireUser } from "../hook";
import { revalidatePath } from "next/cache";
import { encryptSecret, decryptSecret } from "../crypto";
import { VaultCategory } from "../../generated/prisma";

async function uid() {
  const session = await requireUser();
  return session.user!.id as string;
}

export async function createVaultItem(input: {
  title: string;
  category?: VaultCategory;
  username?: string | null;
  url?: string | null;
  secret: string;
}) {
  const userId = await uid();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required" };
  if (!input.secret) return { ok: false, error: "Secret is required" };

  const enc = encryptSecret(input.secret);
  await prisma.vaultItem.create({
    data: {
      title: title.slice(0, 200),
      category: input.category ?? "NOTE",
      username: input.username?.slice(0, 200) || null,
      url: input.url?.slice(0, 500) || null,
      ciphertext: enc.ciphertext,
      iv: enc.iv,
      authTag: enc.authTag,
      userId,
    },
  });
  revalidatePath("/dashboard/vault");
  return { ok: true };
}

export async function updateVaultItem(
  id: string,
  input: {
    title?: string;
    category?: VaultCategory;
    username?: string | null;
    url?: string | null;
    secret?: string; // only re-encrypt if provided
  }
) {
  const userId = await uid();
  const item = await prisma.vaultItem.findFirst({ where: { id, userId } });
  if (!item) return { ok: false, error: "Not found" };

  const enc = input.secret ? encryptSecret(input.secret) : null;
  await prisma.vaultItem.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.slice(0, 200) } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.username !== undefined ? { username: input.username?.slice(0, 200) || null } : {}),
      ...(input.url !== undefined ? { url: input.url?.slice(0, 500) || null } : {}),
      ...(enc ? { ciphertext: enc.ciphertext, iv: enc.iv, authTag: enc.authTag } : {}),
    },
  });
  revalidatePath("/dashboard/vault");
  return { ok: true };
}

export async function deleteVaultItem(id: string) {
  const userId = await uid();
  await prisma.vaultItem.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard/vault");
  return { ok: true };
}

/** Reveal a single secret on demand (kept out of the initial page payload). */
export async function revealVaultSecret(id: string): Promise<{ ok: boolean; secret?: string; error?: string }> {
  const userId = await uid();
  const item = await prisma.vaultItem.findFirst({ where: { id, userId } });
  if (!item) return { ok: false, error: "Not found" };
  try {
    const secret = decryptSecret({
      ciphertext: item.ciphertext,
      iv: item.iv,
      authTag: item.authTag,
    });
    return { ok: true, secret };
  } catch {
    return { ok: false, error: "Unable to decrypt" };
  }
}
