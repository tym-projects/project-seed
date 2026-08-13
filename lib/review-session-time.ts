export type ReviewTimeNotice = 'ten-minutes' | 'fifteen-minutes' | null;

export function getElapsedReviewMinutes(startedAt: string, now: Date) {
  const startedAtMs = Date.parse(startedAt);
  const nowMs = now.getTime();
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(nowMs)) return 0;
  return Math.floor(Math.max(0, nowMs - startedAtMs) / 60_000);
}

export function getReviewTimeNotice(elapsedMinutes: number): ReviewTimeNotice {
  if (elapsedMinutes >= 15) return 'fifteen-minutes';
  if (elapsedMinutes >= 10) return 'ten-minutes';
  return null;
}
