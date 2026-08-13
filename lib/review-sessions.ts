import type { StudentId } from '@/lib/learning-records';
import { getLocalDateKey } from '@/lib/spaced-review';

export type ReviewSession = {
  student: StudentId;
  subject: string;
  localReviewDate: string;
  startedAt: string;
};

export const REVIEW_SESSIONS_STORAGE_KEY = 'project-seed:review-sessions:v1';

function isStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isReviewSession(value: unknown): value is ReviewSession {
  if (typeof value !== 'object' || value === null) return false;
  const session = value as Record<string, unknown>;
  return (
    (session.student === 'jiejie' || session.student === 'meimei') &&
    typeof session.subject === 'string' && session.subject.length > 0 &&
    typeof session.localReviewDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(session.localReviewDate) &&
    typeof session.startedAt === 'string' && Number.isFinite(Date.parse(session.startedAt))
  );
}

export function readReviewSessions(): ReviewSession[] {
  if (!isStorageAvailable()) return [];
  try {
    const stored = window.localStorage.getItem(REVIEW_SESSIONS_STORAGE_KEY);
    if (stored === null) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isReviewSession) : [];
  } catch {
    return [];
  }
}

function writeReviewSessions(sessions: ReviewSession[]) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(REVIEW_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // The review flow still works if browser storage is unavailable.
  }
}

export function getOrCreateReviewSession({ student, subject, now, timeZone }: { student: StudentId; subject: string; now: Date; timeZone: string }): ReviewSession {
  const localReviewDate = getLocalDateKey(now, timeZone);
  const sessions = readReviewSessions();
  const existing = sessions.find((session) => session.student === student && session.subject === subject && session.localReviewDate === localReviewDate);
  if (existing) return existing;

  const session = { student, subject, localReviewDate, startedAt: now.toISOString() };
  writeReviewSessions(sessions.filter((item) => item.student !== student || item.subject !== subject).concat(session));
  return session;
}

export function endReviewSession(student: StudentId, subject: string) {
  writeReviewSessions(readReviewSessions().filter((session) => session.student !== student || session.subject !== subject));
}
