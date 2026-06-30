/**
 * Cloudflare Pages Function: event registration for "Žygis Švėtės upe".
 *
 * Routes (this file = /api/zygis-svete):
 *   GET  -> { count, max, slotsLeft, full }       current availability
 *   POST -> { ok, status, slotsLeft }             register one person
 *
 * Storage: Workers KV, bound as ZYGIS_SVETE (see Pages -> Settings -> Bindings).
 *   reg:<email>  -> JSON { name, email, ts }   one key per registrant (dedup)
 * Count is derived by listing the "reg:" prefix, so there is no separate
 * counter key to drift. KV is eventually consistent, so two simultaneous
 * submits could overshoot the cap by one - acceptable for a small event.
 *
 * Cap is configurable via the MAX_REGISTRATIONS text variable
 * (Pages -> Settings -> Variables and secrets); falls back to 30.
 */

// Minimal KV surface we use - avoids depending on @cloudflare/workers-types.
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  list(opts?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
}

interface Env {
  ZYGIS_SVETE: KVNamespace;
  MAX_REGISTRATIONS?: string;
  TURNSTILE_SECRET?: string;
}

type Ctx = { request: Request; env: Env };

const DEFAULT_MAX = 30;
const KEY_PREFIX = "reg:";
const MAX_NAME = 80;
const MAX_EMAIL = 120;
// Pragmatic email shape check - server side is authoritative but not strict RFC.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cloudflare Turnstile. When TURNSTILE_SECRET is unset (local dev / preview) we
// fall back to the official "always passes" TEST secret so the flow still works.
// PRODUCTION MUST set the real secret in Pages -> Variables and secrets, else
// there is effectively no bot protection.
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string | null,
): Promise<boolean> {
  if (!token) return false;
  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function maxFrom(env: Env): number {
  const n = parseInt(env.MAX_REGISTRATIONS ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function count(env: Env): Promise<number> {
  const { keys } = await env.ZYGIS_SVETE.list({ prefix: KEY_PREFIX });
  return keys.length;
}

export const onRequestGet = async ({ env }: Ctx): Promise<Response> => {
  const max = maxFrom(env);
  const used = await count(env);
  const slotsLeft = Math.max(0, max - used);
  return json({ count: used, max, slotsLeft, full: slotsLeft === 0 });
};

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const max = maxFrom(env);

  let body: {
    name?: unknown;
    email?: unknown;
    website?: unknown;
    token?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, status: "invalid" }, 400);
  }

  // Honeypot: bots fill hidden "website". Pretend success, store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true, status: "ok" });
  }

  // Turnstile: verify the human-challenge token before doing anything else.
  const token = typeof body.token === "string" ? body.token : "";
  const passed = await verifyTurnstile(
    token,
    env.TURNSTILE_SECRET ?? TURNSTILE_TEST_SECRET,
    request.headers.get("CF-Connecting-IP"),
  );
  if (!passed) {
    return json({ ok: false, status: "captcha" }, 403);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (
    name.length < 1 ||
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    !EMAIL_RE.test(email)
  ) {
    return json({ ok: false, status: "invalid" }, 400);
  }

  if ((await count(env)) >= max) {
    return json({ ok: false, status: "full" }, 409);
  }

  const key = KEY_PREFIX + email;
  if ((await env.ZYGIS_SVETE.get(key)) !== null) {
    return json({ ok: false, status: "duplicate" }, 409);
  }

  await env.ZYGIS_SVETE.put(
    key,
    JSON.stringify({ name, email, ts: new Date().toISOString() }),
  );

  const slotsLeft = Math.max(0, max - (await count(env)));
  return json({ ok: true, status: "ok", slotsLeft });
};
