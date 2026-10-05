/**
 * Read required environment variables (from .env or the real environment).
 * Each project prefixes its variables with its test ID prefix, e.g. SCG_EMAIL, SHOP_ADMIN_PASS.
 */
export function requireEnv<const K extends string>(...names: K[]): Record<K, string> {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    throw new Error(`Set ${missing.join(', ')} in .env or the environment (see .env.example).`);
  }
  return Object.fromEntries(names.map((n) => [n, process.env[n] as string])) as Record<K, string>;
}
