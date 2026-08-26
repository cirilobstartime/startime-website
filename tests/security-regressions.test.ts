import assert from "node:assert/strict";
import test from "node:test";
import { buildContentSecurityPolicy } from "../src/lib/contentSecurityPolicy";
import { claimFormAttempt } from "../src/lib/formRateLimit";
import {
  readRequestBodyWithLimit,
  RequestBodyTooLargeError,
} from "../src/lib/requestBody";
import { administerRole } from "../src/payload/access/cmsUsers";
import { csvCell } from "../src/payload/collections/FormSubmissions";

test("CSP nonces executable scripts without allowing inline script attributes", () => {
  const policy = buildContentSecurityPolicy("testnonce", false);
  const scriptDirective = policy
    .split("; ")
    .find((directive) => directive.startsWith("script-src "));

  assert.match(scriptDirective || "", /'nonce-testnonce'/);
  assert.match(scriptDirective || "", /'strict-dynamic'/);
  assert.doesNotMatch(scriptDirective || "", /'unsafe-inline'/);
  assert.match(policy, /script-src-attr 'none'/);
  assert.match(policy, /object-src 'none'/);
});

test("bounded body reader accepts a normal request", async () => {
  const request = new Request("http://localhost/test", {
    body: "normal-body",
    method: "POST",
  });
  const body = await readRequestBodyWithLimit(request, 64);
  assert.equal(new TextDecoder().decode(body), "normal-body");
});

test("bounded body reader rejects a chunked body beyond the limit", async () => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("12345"));
      controller.enqueue(new TextEncoder().encode("67890"));
      controller.close();
    },
  });
  const request = new Request("http://localhost/test", {
    body: stream,
    duplex: "half",
    method: "POST",
  } as RequestInit & { duplex: "half" });

  await assert.rejects(
    readRequestBodyWithLimit(request, 8),
    RequestBodyTooLargeError,
  );
});

test("CSV cells neutralize spreadsheet formula prefixes", () => {
  for (const value of ["=1+1", "+SUM(A1:A2)", "-1+2", "@cmd", "\t=1+1"]) {
    assert.match(csvCell(value), /^"'/);
  }
  assert.equal(csvCell("ordinary value"), '"ordinary value"');
});

test("only administrators may change CMS user roles", async () => {
  const editor = await administerRole({
    req: {
      user: { collection: "cms-users", id: 2, role: "editor" },
    },
  } as never);
  const administrator = await administerRole({
    req: {
      user: { collection: "cms-users", id: 1, role: "administrator" },
    },
  } as never);

  assert.equal(editor, false);
  assert.equal(administrator, true);
});

test("rate-limit slots are atomic and scoped per form", async () => {
  const keys = new Set<string>();
  const store = {
    async count({ where }: { where: { attemptKey: { equals: string } } }) {
      return { totalDocs: keys.has(where.attemptKey.equals) ? 1 : 0 };
    },
    async create({ data }: { data: { attemptKey: string } }) {
      if (keys.has(data.attemptKey)) throw new Error("unique constraint");
      keys.add(data.attemptKey);
      return { id: keys.size };
    },
    async delete() {
      return { docs: [] };
    },
  };
  const parameters = {
    ipHash: "same-ip",
    limit: 1,
    now: Date.UTC(2026, 7, 25, 12, 0, 0),
    windowMinutes: 15,
  };

  const concurrent = await Promise.all(
    Array.from({ length: 8 }, () =>
      claimFormAttempt(store as never, { ...parameters, formKey: "contact" }),
    ),
  );
  assert.equal(concurrent.filter((result) => result.allowed).length, 1);

  const otherForm = await claimFormAttempt(store as never, {
    ...parameters,
    formKey: "career",
  });
  assert.equal(otherForm.allowed, true);
});
