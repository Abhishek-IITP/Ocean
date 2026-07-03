import crypto from "crypto";

/**
 * Vault encryption — AES-256-GCM.
 *
 * Secrets are encrypted at rest. The key comes from the VAULT_SECRET env var
 * (a base64-encoded 32-byte key). Each item gets a fresh random IV, and we
 * store the GCM auth tag alongside the ciphertext so tampering is detectable.
 *
 * NOTE: This protects data at rest in the database. It is not zero-knowledge —
 * the server can decrypt. For a resume/portfolio project that is the right,
 * honest tradeoff and is clearly better than storing plaintext.
 */

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const secret = process.env.VAULT_SECRET;
  if (!secret) {
    throw new Error(
      "VAULT_SECRET is not set. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    );
  }
  const key = Buffer.from(secret, "base64");
  if (key.length !== 32) {
    throw new Error("VAULT_SECRET must decode to exactly 32 bytes (base64).");
  }
  return key;
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export function encryptSecret(plaintext: string): EncryptedPayload {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export function decryptSecret(payload: EncryptedPayload): string {
  const decipher = crypto.createDecipheriv(
    ALGO,
    getKey(),
    Buffer.from(payload.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
