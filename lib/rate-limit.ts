type Entry = { count: number; resetsAt: number };
const requests = new Map<string, Entry>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

/** Best-effort single-process protection for a portfolio/demo deployment. */
export function checkApplicationRateLimit(ip: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
  const current = requests.get(ip);
  if (!current || current.resetsAt <= now) {
    requests.set(ip, { count: 1, resetsAt: now + WINDOW_MS });
    if (requests.size > 3000) {
      for (const [key, value] of requests.entries()) {
        if (value.resetsAt <= now) requests.delete(key);
      }
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetsAt - now) / 1000)) };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
