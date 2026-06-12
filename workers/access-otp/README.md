# Access OTP Worker

Email-verification (OTP) backend for the **Start Now** gate, plus permanent
server-side **acceptance receipts** for the Access & Evaluation Agreement.

Why it exists: the site is static, so without a backend the acceptance record
is fired from the visitor's browser and the email is merely *claimed*. This
Worker makes the email *verified* (a code is sent to the mailbox and must be
entered back) and writes the acceptance receipt server-side at the moment of
verification — no receipt, no unlock.

## What a receipt contains

`receipt:<epoch-ms>:<email>` in KV, written only after a correct code:

```json
{
  "receiptId": "1781290521000-a1b2c3d4",
  "email": "dana@bigcorp.com",
  "verifiedAt": "2026-06-12T19:02:01.000Z",
  "ip": "203.0.113.7",
  "country": "IL",
  "userAgent": "Mozilla/5.0 …",
  "agreementVersion": "1.4",
  "agreementTextSha256": "<sha of AgreementText.jsx at deploy>",
  "surface": "start_now_topnav"
}
```

Together with the git history of `src/components/AgreementText.jsx` (exact
text per version) this is the attribution package: verified mailbox control +
assent + content + time + device context.

## Deploy (first time)

```bash
cd workers/access-otp
npx wrangler login                          # browser OAuth
npx wrangler kv namespace create ACCESS_KV  # paste resulting id into wrangler.jsonc
# Pin the agreement text hash (PowerShell):
#   Get-FileHash -Algorithm SHA256 ..\..\src\components\AgreementText.jsx
# put the hex into "AGREEMENT_SHA" in wrangler.jsonc — redo on version bumps.
npx wrangler secret put RESEND_API_KEY      # from resend.com (verify traigent.ai domain first)
npx wrangler secret put OTP_PEPPER          # any long random string
npx wrangler secret put ADMIN_KEY           # bearer token for GET /receipts
npx wrangler deploy
```

Then set the Worker URL in the site's `.env.local` as `VITE_OTP_WORKER_URL`
and rebuild/redeploy the site. An empty `VITE_OTP_WORKER_URL` keeps the whole
OTP flow dormant (site behaves exactly as before).

## Audit receipts

```bash
curl -H "Authorization: Bearer <ADMIN_KEY>" https://<worker-url>/receipts
```

## Endpoints

| Method | Path          | Body                                          | Success            |
| ------ | ------------- | --------------------------------------------- | ------------------ |
| POST   | `/otp/start`  | `{ email }`                                    | `{ sent: true }`   |
| POST   | `/otp/verify` | `{ email, code, agreementVersion, surface }`   | `{ verified, receiptId }` |
| GET    | `/receipts`   | — (Bearer ADMIN_KEY)                           | `{ count, receipts }` |

Errors: `business_email_required`, `rate_limited` (10/IP/h, 5/email/h),
`otp_unavailable` (no Resend key configured), `send_failed`, `expired`
(10-minute code TTL), `invalid_code` (with `remaining`), `too_many_attempts`
(5 wrong tries burns the code).
