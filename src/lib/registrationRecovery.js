// Canonical portal-to-marketing handoff for replacing an expired or invalid
// registration code. HashRouter owns everything after "#", so the query must
// follow the hash route rather than the origin URL.
export const REGISTRATION_RECOVERY_URL = "https://traigent.ai/#/?start=free";
export const REGISTRATION_RECOVERY_SURFACE = "registration_recovery";

const RECOVERY_QUERY_KEY = "start";
const RECOVERY_QUERY_VALUE = "free";

/**
 * Return an exact deep-link match and a query with every consumed `start`
 * value removed. Unrelated attribution parameters survive unchanged.
 */
export function consumeRegistrationRecoveryQuery(searchParams) {
  const remaining = new URLSearchParams(searchParams);
  const shouldOpen = remaining
    .getAll(RECOVERY_QUERY_KEY)
    .includes(RECOVERY_QUERY_VALUE);
  if (shouldOpen) remaining.delete(RECOVERY_QUERY_KEY);
  return { shouldOpen, remaining };
}
