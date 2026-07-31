// Shared wire paths for the lead funnel. The browser client and the build-time
// CSP guard both import these constants so an endpoint rename cannot leave CI
// validating a URL the runtime no longer calls.
export const LEAD_CAPTURE_PATH = "/api/v1/leads";
export const LEAD_VERIFY_PATH = "/api/v1/leads/verify";
export const LEAD_API_PATHS = Object.freeze([
  LEAD_CAPTURE_PATH,
  LEAD_VERIFY_PATH,
]);
