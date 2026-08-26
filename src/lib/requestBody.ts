export class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body is too large.");
    this.name = "RequestBodyTooLargeError";
  }
}

export async function readRequestBodyWithLimit(
  request: Request,
  limit: number,
): Promise<ArrayBuffer> {
  const suppliedLength = request.headers.get("content-length");
  if (suppliedLength !== null) {
    const parsedLength = Number(suppliedLength);
    if (!Number.isSafeInteger(parsedLength) || parsedLength < 0) {
      throw new RequestBodyTooLargeError();
    }
    if (parsedLength > limit) throw new RequestBodyTooLargeError();
  }

  if (!request.body) return new ArrayBuffer(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel();
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new ArrayBuffer(total);
  const view = new Uint8Array(body);
  let offset = 0;
  for (const chunk of chunks) {
    view.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}
