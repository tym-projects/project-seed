import type { StudentId, SubjectId } from '@/lib/learning-records';

export const REVIEW_TIME_SETTINGS_STORAGE_KEY = 'project-seed:review-settings:v1';

export type ReviewTargetMinutes = 10 | 15;

export type ReviewTimeSetting = {
  student: StudentId;
  subject: SubjectId;
  targetMinutes: ReviewTargetMinutes;
};

function isStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isReviewTimeSetting(value: unknown): value is ReviewTimeSetting {
  if (typeof value !== 'object' || value === null) return false;
  const setting = value as Record<string, unknown>;
  return (
    (setting.student === 'jiejie' || setting.student === 'meimei') &&
    setting.subject === 'chinese' &&
    (setting.targetMinutes === 10 || setting.targetMinutes === 15)
  );
}

export function readReviewTimeSettings(): ReviewTimeSetting[] {
  if (!isStorageAvailable()) return [];
  try {
    const stored = window.localStorage.getItem(REVIEW_TIME_SETTINGS_STORAGE_KEY);
    if (stored === null) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    const settings = new Map<string, ReviewTimeSetting>();
    for (const value of parsed) {
      if (!isReviewTimeSetting(value)) continue;
      settings.set(`${value.student}:${value.subject}`, value);
    }
    return [...settings.values()];
  } catch {
    return [];
  }
}

export function getReviewTargetMinutes(student: StudentId, subject: SubjectId): ReviewTargetMinutes | null {
  return readReviewTimeSettings().find((setting) => setting.student === student && setting.subject === subject)?.targetMinutes ?? null;
}

export function saveReviewTargetMinutes(student: StudentId, subject: SubjectId, targetMinutes: ReviewTargetMinutes) {
  if (!isStorageAvailable()) return;
  try {
    const settings = readReviewTimeSettings().filter((setting) => setting.student !== student || setting.subject !== subject);
    window.localStorage.setItem(REVIEW_TIME_SETTINGS_STORAGE_KEY, JSON.stringify(settings.concat({ student, subject, targetMinutes })));
  } catch {
    // The parent page remains usable when browser storage is unavailable.
  }
}
