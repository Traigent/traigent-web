// Traigent Access OTP Worker
//
// Proves mailbox control at the moment of agreement acceptance, and writes a
// permanent server-side acceptance receipt. This is the evidentiary backbone
// of the Start Now gate: the localStorage stamp on the visitor's machine is
// convenience; the KV receipt written here is the record.
//
// Endpoints (all JSON):
//   POST /otp/start   { email }                              → { sent: true }
//   POST /otp/verify  { email, code, agreementVersion, surface }
//                                              → { verified: true, receiptId }
//   GET  /receipts    Authorization: Bearer <ADMIN_KEY>      → { receipts: [...] }
//
// KV layout (single namespace ACCESS_KV):
//   otp:<email>            pending code: { codeHash, tries, ts }   TTL 10 min
//   rl:ip:<ip>             send counter per IP                     TTL 1 h
//   rl:email:<email>       send counter per email                  TTL 1 h
//   receipt:<ts>:<email>   acceptance receipt — NO TTL (permanent evidence)
//   verified:<email>       latest verification pointer — no TTL

const OTP_TTL_S = 600; // codes live 10 minutes
const MAX_TRIES = 5; // wrong-code attempts per issued code
const RL_WINDOW_S = 3600; // rate-limit window
const RL_MAX_PER_IP = 10; // code sends per IP per window
const RL_MAX_PER_EMAIL = 5; // code sends per email per window

// Free-mail domains rejected server-side. HubSpot blocks these on its forms;
// the Worker must enforce independently because verification IS the gate.
const FREE_MAIL = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.fr",
  "hotmail.com", "hotmail.co.uk", "hotmail.fr", "outlook.com", "outlook.fr",
  "live.com", "live.co.uk", "msn.com", "aol.com", "icloud.com", "me.com",
  "mac.com", "proton.me", "protonmail.com", "pm.me", "gmx.com", "gmx.de",
  "gmx.net", "mail.com", "mail.ru", "yandex.com", "yandex.ru", "zoho.com",
  "fastmail.com", "hey.com", "tutanota.com", "tuta.io", "qq.com", "163.com",
  "126.com", "naver.com", "walla.co.il", "duck.com", "mailinator.com",
  "guerrillamail.com", "10minutemail.com", "temp-mail.org", "yopmail.com",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      if (request.method === "POST" && url.pathname === "/otp/start") {
        return await handleStart(request, env, cors);
      }
      if (request.method === "POST" && url.pathname === "/otp/verify") {
        return await handleVerify(request, env, cors);
      }
      if (request.method === "GET" && url.pathname === "/receipts") {
        return await handleReceipts(request, env, cors);
      }
      return json({ error: "not_found" }, 404, cors);
    } catch (err) {
      // Never leak internals; the frontend maps this to "try again shortly".
      console.error("unhandled", err && err.message);
      return json({ error: "internal" }, 500, cors);
    }
  },
};

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function normalizeEmail(raw) {
  return String(raw || "").trim().toLowerCase();
}

function isBusinessEmail(email) {
  if (!EMAIL_RE.test(email)) return false;
  const domain = email.split("@")[1];
  return !FREE_MAIL.has(domain);
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Counter with TTL window. KV has no atomic increment; for a marketing-site
// gate, lost updates under race just make the limit marginally looser —
// acceptable. Returns the count AFTER incrementing.
async function bumpCounter(env, key, ttlSeconds) {
  const current = Number((await env.ACCESS_KV.get(key)) || "0") + 1;
  await env.ACCESS_KV.put(key, String(current), { expirationTtl: ttlSeconds });
  return current;
}

async function handleStart(request, env, cors) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(body.email);

  if (!isBusinessEmail(email)) {
    return json({ error: "business_email_required" }, 400, cors);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if ((await bumpCounter(env, `rl:ip:${ip}`, RL_WINDOW_S)) > RL_MAX_PER_IP) {
    return json({ error: "rate_limited" }, 429, cors);
  }
  if ((await bumpCounter(env, `rl:email:${email}`, RL_WINDOW_S)) > RL_MAX_PER_EMAIL) {
    return json({ error: "rate_limited" }, 429, cors);
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: "otp_unavailable" }, 503, cors);
  }

  // 6 digits, crypto-random, no modulo bias worth caring about at 10^6.
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const code = String(buf[0] % 1000000).padStart(6, "0");

  await env.ACCESS_KV.put(
    `otp:${email}`,
    JSON.stringify({ codeHash: await sha256Hex(`${code}|${env.OTP_PEPPER || ""}`), tries: 0, ts: Date.now() }),
    { expirationTtl: OTP_TTL_S },
  );

  const sendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || "Traigent Access <access@traigent.ai>",
      to: [email],
      subject: `${code} is your Traigent access code`,
      html: codeEmailHtml(code),
      text: `Your Traigent access code is ${code}. It expires in 10 minutes.\n\nYou're receiving this because this address was entered at traigent.ai to unlock SDK access. If this wasn't you, you can ignore this email.`,
    }),
  });

  if (!sendRes.ok) {
    const detail = await sendRes.text().catch(() => "");
    console.error("resend_failed", sendRes.status, detail.slice(0, 300));
    return json({ error: "send_failed" }, 502, cors);
  }

  return json({ sent: true }, 200, cors);
}

async function handleVerify(request, env, cors) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const code = String(body.code || "").trim();

  if (!isBusinessEmail(email) || !/^\d{6}$/.test(code)) {
    return json({ error: "invalid_request" }, 400, cors);
  }

  const otpKey = `otp:${email}`;
  const pendingRaw = await env.ACCESS_KV.get(otpKey);
  if (!pendingRaw) {
    return json({ error: "expired" }, 400, cors);
  }
  const pending = JSON.parse(pendingRaw);

  if (pending.tries >= MAX_TRIES) {
    await env.ACCESS_KV.delete(otpKey);
    return json({ error: "too_many_attempts" }, 429, cors);
  }

  const codeHash = await sha256Hex(`${code}|${env.OTP_PEPPER || ""}`);
  if (codeHash !== pending.codeHash) {
    pending.tries += 1;
    await env.ACCESS_KV.put(otpKey, JSON.stringify(pending), { expirationTtl: OTP_TTL_S });
    return json({ error: "invalid_code", remaining: MAX_TRIES - pending.tries }, 400, cors);
  }

  // Verified: burn the code, write the permanent acceptance receipt.
  await env.ACCESS_KV.delete(otpKey);

  const now = new Date();
  const receiptId = `${now.getTime()}-${crypto.randomUUID().slice(0, 8)}`;
  const receipt = {
    receiptId,
    email,
    verifiedAt: now.toISOString(),
    ip: request.headers.get("CF-Connecting-IP") || "",
    country: (request.cf && request.cf.country) || "",
    userAgent: request.headers.get("User-Agent") || "",
    agreementVersion: String(body.agreementVersion || ""),
    agreementTextSha256: env.AGREEMENT_SHA || "",
    surface: String(body.surface || "").slice(0, 80),
  };

  await env.ACCESS_KV.put(`receipt:${now.getTime()}:${email}`, JSON.stringify(receipt));
  await env.ACCESS_KV.put(`verified:${email}`, JSON.stringify({ receiptId, verifiedAt: receipt.verifiedAt }));

  return json({ verified: true, receiptId }, 200, cors);
}

async function handleReceipts(request, env, cors) {
  const auth = request.headers.get("Authorization") || "";
  if (!env.ADMIN_KEY || auth !== `Bearer ${env.ADMIN_KEY}`) {
    return json({ error: "unauthorized" }, 401, cors);
  }
  const list = await env.ACCESS_KV.list({ prefix: "receipt:", limit: 1000 });
  const receipts = [];
  for (const key of list.keys) {
    const raw = await env.ACCESS_KV.get(key.name);
    if (raw) receipts.push(JSON.parse(raw));
  }
  receipts.sort((a, b) => (a.verifiedAt < b.verifiedAt ? 1 : -1));
  return json({ count: receipts.length, receipts }, 200, cors);
}

function codeEmailHtml(code) {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:32px;">
        <tr><td style="color:#ffffff;font-size:18px;font-weight:bold;padding-bottom:8px;">Traigent access code</td></tr>
        <tr><td style="color:#94a3b8;font-size:14px;line-height:1.5;padding-bottom:24px;">Enter this code at traigent.ai to verify your email and unlock SDK access. It expires in 10 minutes.</td></tr>
        <tr><td align="center" style="padding-bottom:24px;"><div style="display:inline-block;background:#0f172a;border:1px solid #1a6bf5;border-radius:8px;padding:14px 28px;color:#ffffff;font-size:32px;font-weight:bold;letter-spacing:8px;">${code}</div></td></tr>
        <tr><td style="color:#64748b;font-size:12px;line-height:1.5;">You're receiving this because this address was entered at traigent.ai to unlock SDK access. If this wasn't you, you can safely ignore this email — no access is granted without the code.</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
