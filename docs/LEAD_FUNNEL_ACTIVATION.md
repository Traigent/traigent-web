# Lead funnel activation

Production activation is a reviewed repository change. The canonical state is
`VITE_FUNNEL_STATE` in `.env.production`; `VITE_API_BASE_URL` remains a GitHub
Actions Variable because the backend origin is environment-specific.

The browser enables the funnel only when the committed state is `active` and an
API origin exists. The production build independently rejects an active state
when the origin is missing, non-HTTPS, malformed, or blocked by the committed
meta CSP. A dormant state ignores any configured origin, so rollback does not
depend on synchronizing an Actions Variable deletion with a deployment.

## Before activation

1. Deploy the compatible Backend registration/lead routes and portal
   registration flow.
2. Provision `LEAD_ACCESS_RUN_ID_SECRET`,
   `PORTAL_ACCESS_IDENTITY_HMAC_SECRET`, and the lead-email provider bindings.
3. Enable `ENABLE_LEAD_ACCESS_ONBOARDING` in Backend; both lead routes return
   404 while it is disabled.
4. Allow `https://traigent.ai` and `https://www.traigent.ai` in Backend and
   ingress/Istio CORS. Verify a real browser preflight to both lead endpoints.
5. Add the Backend origin to both enforced CSP layers: the committed
   `index.html` meta policy and the Cloudflare response header.
6. Configure the repository Actions Variable `VITE_API_BASE_URL` with the
   production HTTPS origin only—no path, query, fragment, or credentials.
7. Confirm the aggregate alert for bounded lead-funnel refusal logs is active.

## Activate

Open a PR changing only the reviewed state in `.env.production`:

```dotenv
VITE_FUNNEL_STATE=active
```

The PR build exercises the active path. After deployment, complete one real
journey from each entry point: top-nav **Start Now**, hero **Connect your agent**,
the homepage CTA section, and the footer. Confirm the first email, six-digit
verification, second access-code email, portal registration, API-key creation,
and the copyable `traigent-first-run` prompt.

## Roll back

Change `.env.production` back to:

```dotenv
VITE_FUNNEL_STATE=dormant
```

The browser then refuses to call the configured API origin. The Actions
Variable may remain in place for a later reactivation. Disable the Backend flag
as a separate defense-in-depth step if the incident warrants it.
