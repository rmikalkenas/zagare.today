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
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_MAX;
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

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true, status: "ok" });
  }

  const secret = env.TURNSTILE_SECRET;
  if (!secret) {
    return json({ ok: false, status: "error" }, 503);
  }
  const token = typeof body.token === "string" ? body.token : "";
  const passed = await verifyTurnstile(
    token,
    secret,
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

  const key = KEY_PREFIX + email;
  if ((await env.ZYGIS_SVETE.get(key)) !== null) {
    return json({ ok: false, status: "duplicate" }, 409);
  }

  const used = await count(env);
  if (used >= max) {
    return json({ ok: false, status: "full" }, 409);
  }

  await env.ZYGIS_SVETE.put(
    key,
    JSON.stringify({ name, email, ts: new Date().toISOString() }),
  );

  const slotsLeft = Math.max(0, max - (used + 1));
  return json({ ok: true, status: "ok", slotsLeft });
};
