import { createHash } from "node:crypto";
import type { Payload } from "payload";

type AttemptStore = Pick<Payload, "count" | "create" | "delete">;

export async function claimFormAttempt(
  payload: AttemptStore,
  {
    formKey,
    ipHash,
    limit,
    now = Date.now(),
    windowMinutes,
  }: {
    formKey: string;
    ipHash: string;
    limit: number;
    now?: number;
    windowMinutes: number;
  },
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const windowMilliseconds = windowMinutes * 60 * 1000;
  const bucketStart = Math.floor(now / windowMilliseconds) * windowMilliseconds;
  const expiresAt = new Date(bucketStart + windowMilliseconds).toISOString();

  await payload.delete({
    collection: "form-attempts",
    overrideAccess: true,
    where: {
      expiresAt: { less_than_equal: new Date(now).toISOString() },
    },
  });

  for (let slot = 0; slot < limit; slot += 1) {
    const attemptKey = createHash("sha256")
      .update(`${formKey}:${ipHash}:${bucketStart}:${slot}`)
      .digest("hex");
    try {
      await payload.create({
        collection: "form-attempts",
        data: { attemptKey, expiresAt, formKey, ipHash },
        overrideAccess: true,
      });
      return { allowed: true, retryAfterSeconds: 0 };
    } catch (error) {
      const duplicate = await payload.count({
        collection: "form-attempts",
        overrideAccess: true,
        where: { attemptKey: { equals: attemptKey } },
      });
      if (!duplicate.totalDocs) throw error;
    }
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((Date.parse(expiresAt) - now) / 1000),
    ),
  };
}
