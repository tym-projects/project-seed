export type ReviewState = {
  lastCompletedLocalDate: string | null;
  lastSessionHadWrong: boolean;
  stableSuccessStreak: number;
  nextReviewLocalDate: string | null;
  isDue: boolean;
};

export type SpacedReviewRecord = {
  student: string;
  subject: string;
  questionId: string;
  firstAnswer: number;
  finalAnswer: number;
  attempts: number;
  correct: boolean;
  completed: boolean;
  createdAt: string;
};

type DeriveReviewStateOptions = {
  records: unknown[];
  student: string;
  subject: string;
  questionId: string;
  questionIds?: string[];
  now: Date;
  timeZone: string;
};

type ReviewDay = {
  localDate: string;
  hadWrong: boolean;
};

export function getLocalDateKey(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export function addLocalDays(localDate: string, days: number) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(localDate);

  if (!match || !Number.isInteger(days)) {
    return localDate;
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

function isSpacedReviewRecord(value: unknown): value is SpacedReviewRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.student === 'string' &&
    typeof record.subject === 'string' &&
    typeof record.questionId === 'string' && record.questionId.length > 0 &&
    typeof record.firstAnswer === 'number' && Number.isInteger(record.firstAnswer) && record.firstAnswer >= 0 &&
    typeof record.finalAnswer === 'number' && Number.isInteger(record.finalAnswer) && record.finalAnswer >= 0 &&
    typeof record.attempts === 'number' && Number.isInteger(record.attempts) && record.attempts >= 1 &&
    record.correct === true &&
    record.completed === true &&
    typeof record.createdAt === 'string' && Number.isFinite(Date.parse(record.createdAt))
  );
}

function toReviewDays(records: unknown[], student: string, subject: string, questionIds: string[], timeZone: string): ReviewDay[] {
  const days = new Map<string, boolean>();
  const questionIdSet = new Set(questionIds);

  for (const record of records) {
    if (!isSpacedReviewRecord(record) || record.student !== student || record.subject !== subject || !questionIdSet.has(record.questionId)) {
      continue;
    }

    const localDate = getLocalDateKey(new Date(record.createdAt), timeZone);
    days.set(localDate, (days.get(localDate) ?? false) || record.attempts > 1);
  }

  return [...days.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([localDate, hadWrong]) => ({ localDate, hadWrong }));
}

export function deriveReviewState({ records, student, subject, questionId, questionIds, now, timeZone }: DeriveReviewStateOptions): ReviewState {
  const reviewDays = toReviewDays(records, student, subject, questionIds ?? [questionId], timeZone);
  let lastCompletedLocalDate: string | null = null;
  let lastSessionHadWrong = false;
  let stableSuccessStreak = 0;
  let nextReviewLocalDate: string | null = null;

  for (const reviewDay of reviewDays) {
    lastCompletedLocalDate = reviewDay.localDate;
    lastSessionHadWrong = reviewDay.hadWrong;

    if (reviewDay.hadWrong) {
      stableSuccessStreak = 0;
      nextReviewLocalDate = addLocalDays(reviewDay.localDate, 1);
      continue;
    }

    if (nextReviewLocalDate === null || reviewDay.localDate >= nextReviewLocalDate) {
      stableSuccessStreak += 1;
      nextReviewLocalDate = addLocalDays(reviewDay.localDate, stableSuccessStreak === 1 ? 1 : stableSuccessStreak === 2 ? 3 : 7);
    }
  }

  return {
    lastCompletedLocalDate,
    lastSessionHadWrong,
    stableSuccessStreak,
    nextReviewLocalDate,
    isDue: nextReviewLocalDate !== null && getLocalDateKey(now, timeZone) >= nextReviewLocalDate,
  };
}
