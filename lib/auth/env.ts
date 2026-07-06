export function isAuth0Configured() {
  return !!(
    process.env.AUTH0_DOMAIN &&
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_CLIENT_SECRET &&
    process.env.AUTH0_SECRET
  );
}

/** Hostname only — strips scheme, path, port, and trailing slashes from AUTH0_DOMAIN. */
export function normalizeAuth0Domain(raw: string | undefined): string | undefined {
  if (!raw) return undefined;

  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      return new URL(trimmed).hostname;
    }
  } catch {
    // Fall through to bare-hostname parsing.
  }

  return trimmed.split("/")[0].split(":")[0] || undefined;
}