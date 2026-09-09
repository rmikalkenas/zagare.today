interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  list(opts?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
}

interface Env {
  REGISTRATIONS: KVNamespace;
  /** Global emergency override. "0" closes registration for every event. */
  MAX_REGISTRATIONS?: string;
  TURNSTILE_SECRET?: string;
}

type Ctx = {
  request: Request;
  env: Env;
  params: { event: string | string[] };
};

/**
 * Events that accept registrations, and their seat caps. An event id must
 * match the page slug. Anything not listed here 404s, so a stale or guessed
 * URL cannot create keys.
 */
const EVENTS: Record<string, { max: number }> = {
  "zygis-po-zagare": { max: 30 },
};

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

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

/** Resolves the route param against the registry, or null when unknown. */
function resolveEvent(
  params: Ctx["params"],
  env: Env,
): { id: string; prefix: string; max: number } | null {
  const raw = Array.isArray(params.event) ? params.event[0] : params.event;
  const id = typeof raw === "string" ? raw.toLowerCase() : "";
  const entry = EVENTS[id];
  if (!entry) return null;

  // The env var only ever tightens the cap, so a stray value cannot open an
  // event wider than its code-declared limit.
  const override = parseInt(env.MAX_REGISTRATIONS ?? "", 10);
  const max =
    Number.isFinite(override) && override >= 0
      ? Math.min(override, entry.max)
      : entry.max;

  return { id, prefix: `${id}:reg:`, max };
}

async function count(env: Env, prefix: string): Promise<number> {
  const { keys } = await env.REGISTRATIONS.list({ prefix });
  return keys.length;
}

export const onRequestGet = async ({ env, params }: Ctx): Promise<Response> => {
  const event = resolveEvent(params, env);
  if (!event) return json({ ok: false, status: "unknown" }, 404);

  const used = await count(env, event.prefix);
  const slotsLeft = Math.max(0, event.max - used);
  return json({ count: used, max: event.max, slotsLeft, full: slotsLeft === 0 });
};

export const onRequestPost = async ({
  request,
  env,
  params,
}: Ctx): Promise<Response> => {
  const event = resolveEvent(params, env);
  if (!event) return json({ ok: false, status: "unknown" }, 404);

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

  // Honeypot: pretend it worked so bots do not learn they were caught.
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

  const key = event.prefix + email;
  if ((await env.REGISTRATIONS.get(key)) !== null) {
    return json({ ok: false, status: "duplicate" }, 409);
  }

  const used = await count(env, event.prefix);
  if (used >= event.max) {
    return json({ ok: false, status: "full" }, 409);
  }

  await env.REGISTRATIONS.put(
    key,
    JSON.stringify({ name, email, event: event.id, ts: new Date().toISOString() }),
  );

  const slotsLeft = Math.max(0, event.max - (used + 1));
  return json({ ok: true, status: "ok", slotsLeft });
};
