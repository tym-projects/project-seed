import type { ReviewTargetMinutes } from '@/lib/review-time-settings';

export type ReviewTimeNotice =
  | { kind: 'gentle-ten-minute' }
  | { kind: 'target-complete'; targetMinutes: ReviewTargetMinutes }
  | null;

export function getElapsedReviewMinutes(startedAt: string, now: Date) {
  const startedAtMs = Date.parse(startedAt);
  const nowMs = now.getTime();
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(nowMs)) return 0;
  return Math.floor(Math.max(0, nowMs - startedAtMs) / 60_000);
}

export function getReviewTimeNotice(elapsedMinutes: number, targetMinutes: ReviewTargetMinutes | null): ReviewTimeNotice {
  if (elapsedMinutes < 10) return null;
  if (targetMinutes === 10) return { kind: 'target-complete', targetMinutes: 10 };
  if (elapsedMinutes < 15) return { kind: 'gentle-ten-minute' };
  return { kind: 'target-complete', targetMinutes: 15 };
}
