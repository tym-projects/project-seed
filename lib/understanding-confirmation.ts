import { deriveReviewState, getLocalDateKey, type SpacedReviewRecord } from '@/lib/spaced-review';

export type ReviewQuestionLike = {
  id: string;
  reviewGroupId?: string;
  topic: string;
  type: 'basic' | 'application';
};

export type ConfirmationPlan<T extends ReviewQuestionLike> = {
  groupId: string;
  primary: T;
  confirmation: T | null;
};

export type PendingConfirmation<T extends ReviewQuestionLike> = {
  groupId: string;
  primaryQuestionId: string;
  confirmation: T;
};

type ReviewGroup<T extends ReviewQuestionLike> = {
  id: string;
  questions: T[];
};

function isCompletedRecord(value: unknown): value is SpacedReviewRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.student === 'string'
    && typeof record.subject === 'string'
    && typeof record.questionId === 'string'
    && typeof record.firstAnswer === 'number'
    && Number.isInteger(record.firstAnswer)
    && record.firstAnswer >= 0
    && typeof record.finalAnswer === 'number'
    && Number.isInteger(record.finalAnswer)
    && record.finalAnswer >= 0
    && typeof record.attempts === 'number'
    && Number.isFinite(record.attempts)
    && record.attempts > 0
    && record.completed === true
    && record.correct === true
    && typeof record.createdAt === 'string'
    && Number.isFinite(Date.parse(record.createdAt));
}

export function getReviewGroupId(question: ReviewQuestionLike) {
  return question.reviewGroupId ?? question.id;
}

function groupRecords<T extends ReviewQuestionLike>(group: ReviewGroup<T>, records: unknown[], student: string, subject: string) {
  const questionIds = new Set(group.questions.map((question) => question.id));
  return records.filter(isCompletedRecord).filter((record) => (
    record.student === student && record.subject === subject && questionIds.has(record.questionId)
  ));
}

function getRecordsBeforeToday<T extends ReviewQuestionLike>(group: ReviewGroup<T>, records: unknown[], student: string, subject: string, today: string, timeZone: string) {
  return groupRecords(group, records, student, subject).filter((record) => getLocalDateKey(new Date(record.createdAt), timeZone) < today);
}

function getLatestQuestionId<T extends ReviewQuestionLike>(group: ReviewGroup<T>, records: unknown[]) {
  const ids = new Set(group.questions.map((question) => question.id));
  return records
    .filter(isCompletedRecord)
    .filter((record) => ids.has(record.questionId))
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))[0]?.questionId ?? null;
}

function hashSelectionKey(key: string) {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0);
}

function hasOneHistoricalVariation<T extends ReviewQuestionLike>(group: ReviewGroup<T>, records: unknown[], student: string, subject: string, today: string, timeZone: string) {
  const historical = getRecordsBeforeToday(group, records, student, subject, today, timeZone);
  return new Set(historical.map((record) => record.questionId)).size === 1;
}

function isDueFromHistory<T extends ReviewQuestionLike>(group: ReviewGroup<T>, records: unknown[], student: string, subject: string, now: Date, timeZone: string) {
  const today = getLocalDateKey(now, timeZone);
  const historical = getRecordsBeforeToday(group, records, student, subject, today, timeZone);
  if (historical.length === 0) return false;
  return deriveReviewState({
    records: historical,
    student,
    subject,
    questionId: group.questions[0].id,
    questionIds: group.questions.map((question) => question.id),
    now,
    timeZone,
  }).isDue;
}

export function isConfirmationEligible<T extends ReviewQuestionLike>({ group, records, student, subject, now, timeZone }: {
  group: ReviewGroup<T>;
  records: unknown[];
  student: string;
  subject: string;
  now: Date;
  timeZone: string;
}) {
  if (group.questions.length < 2) return false;
  const today = getLocalDateKey(now, timeZone);
  const matchingRecords = groupRecords(group, records, student, subject);
  const hasTodayRecord = matchingRecords.some((record) => getLocalDateKey(new Date(record.createdAt), timeZone) === today);
  return !hasTodayRecord
    && hasOneHistoricalVariation(group, records, student, subject, today, timeZone)
    && isDueFromHistory(group, records, student, subject, now, timeZone);
}

export function selectConfirmationVariation<T extends ReviewQuestionLike>({ group, primaryQuestionId, records, student, subject, localReviewDate }: {
  group: ReviewGroup<T>;
  primaryQuestionId: string;
  records: unknown[];
  student: string;
  subject: string;
  localReviewDate: string;
}) {
  const alternatives = group.questions.filter((question) => question.id !== primaryQuestionId);
  if (alternatives.length === 0) return null;
  if (alternatives.length === 1) return alternatives[0];
  const latestQuestionId = getLatestQuestionId(group, records);
  const preferred = alternatives.filter((question) => question.id !== latestQuestionId);
  const candidates = preferred.length > 0 ? preferred : alternatives;
  const key = `${student}:${subject}:${group.id}:${localReviewDate}:confirmation:${primaryQuestionId}`;
  return candidates[hashSelectionKey(key) % candidates.length];
}

export function findPendingConfirmation<T extends ReviewQuestionLike>({ group, records, student, subject, now, timeZone }: {
  group: ReviewGroup<T>;
  records: unknown[];
  student: string;
  subject: string;
  now: Date;
  timeZone: string;
}): PendingConfirmation<T> | null {
  if (group.questions.length < 2) return null;
  const today = getLocalDateKey(now, timeZone);
  const matchingRecords = groupRecords(group, records, student, subject);
  const todayRecords = matchingRecords.filter((record) => getLocalDateKey(new Date(record.createdAt), timeZone) === today);
  if (todayRecords.length !== 1 || todayRecords[0].attempts !== 1) return null;
  const todayQuestionIds = [...new Set(todayRecords.map((record) => record.questionId))];
  if (todayQuestionIds.length !== 1) return null;
  if (!hasOneHistoricalVariation(group, records, student, subject, today, timeZone)) return null;
  if (!isDueFromHistory(group, records, student, subject, now, timeZone)) return null;
  const primaryQuestionId = todayQuestionIds[0];
  const confirmation = selectConfirmationVariation({ group, primaryQuestionId, records, student, subject, localReviewDate: today });
  return confirmation ? { groupId: group.id, primaryQuestionId, confirmation } : null;
}
