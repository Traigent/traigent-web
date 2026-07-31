// Shared wire paths for the lead funnel. The browser client and the build-time
// CSP guard both import these constants so an endpoint rename cannot leave CI
// validating a URL the runtime no longer calls.
export const LEAD_CAPTURE_PATH = "/api/v1/leads";
export const LEAD_VERIFY_PATH = "/api/v1/leads/verify";
export const LEAD_API_PATHS = Object.freeze([
  LEAD_CAPTURE_PATH,
  LEAD_VERIFY_PATH,
]);

// The two exact conditions where the self-serve UI must retire and expose its
// real demo-booking fallback. Transient network/rate-limit errors remain
// retryable and must not silently turn into a different journey.
export const CLIENT_ERROR_DISABLED = "CLIENT_FUNNEL_DISABLED";
export const LEAD_ROUTE_NOT_FOUND = "NOT_FOUND";

export function isLeadFunnelUnavailableError(errorCode) {
  return (
    errorCode === CLIENT_ERROR_DISABLED || errorCode === LEAD_ROUTE_NOT_FOUND
  );
}
