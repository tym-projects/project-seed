import { deriveReviewState, getLocalDateKey, type ReviewState } from '@/lib/spaced-review';

export type ReviewQuestion = {
  id: string;
  topic: string;
  type: 'basic' | 'application';
};

type TodayReviewOptions<T extends ReviewQuestion> = {
  questions: T[];
  records: unknown[];
  student: string;
  subject: string;
  now: Date;
  timeZone: string;
  maxQuestions?: number;
};

type QuestionHistory<T extends ReviewQuestion> = {
  question: T;
  state: ReviewState;
};

const MAX_QUESTIONS = 5;

function isCompletedRecord(value: unknown): value is { student: string; subject: string; questionId: string; createdAt: string; attempts: number; correct: true; completed: true } {
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

function compareUnstable<T extends ReviewQuestion>(first: QuestionHistory<T>, second: QuestionHistory<T>) {
  if (first.state.lastSessionHadWrong !== second.state.lastSessionHadWrong) {
    return first.state.lastSessionHadWrong ? -1 : 1;
  }

  if (first.state.stableSuccessStreak !== second.state.stableSuccessStreak) {
    return first.state.stableSuccessStreak - second.state.stableSuccessStreak;
  }

  return compareDue(first, second);
}

function compareDue<T extends ReviewQuestion>(first: QuestionHistory<T>, second: QuestionHistory<T>) {
  const firstDate = first.state.nextReviewLocalDate ?? '';
  const secondDate = second.state.nextReviewLocalDate ?? '';

  if (firstDate !== secondDate) {
    return firstDate.localeCompare(secondDate);
  }

  if (first.question.type !== second.question.type) {
    return first.question.type === 'application' ? -1 : 1;
  }

  return first.question.id.localeCompare(second.question.id);
}

function compareNeverCompleted<T extends ReviewQuestion>(first: QuestionHistory<T>, second: QuestionHistory<T>) {
  if (first.question.type !== second.question.type) {
    return first.question.type === 'application' ? -1 : 1;
  }

  return first.question.id.localeCompare(second.question.id);
}

function addWithTopicSpread<T extends ReviewQuestion>(
  selected: T[],
  candidates: QuestionHistory<T>[],
  compare: (first: QuestionHistory<T>, second: QuestionHistory<T>) => number,
  limit: number,
) {
  const usedQuestionIds = new Set(selected.map((question) => question.id));
  const usedTopics = new Set(selected.map((question) => question.topic));
  const remaining = candidates.filter((candidate) => !usedQuestionIds.has(candidate.question.id)).sort(compare);

  for (const candidate of remaining) {
    if (selected.length >= limit) {
      return;
    }

    if (!usedTopics.has(candidate.question.topic)) {
      selected.push(candidate.question);
      usedQuestionIds.add(candidate.question.id);
      usedTopics.add(candidate.question.topic);
    }
  }

  for (const candidate of remaining) {
    if (selected.length >= limit) {
      return;
    }

    if (!usedQuestionIds.has(candidate.question.id)) {
      selected.push(candidate.question);
      usedQuestionIds.add(candidate.question.id);
      usedTopics.add(candidate.question.topic);
    }
  }
}

export function selectTodayReviewQuestions<T extends ReviewQuestion>({
  questions,
  records,
  student,
  subject,
  now,
  timeZone,
  maxQuestions = MAX_QUESTIONS,
}: TodayReviewOptions<T>): T[] {
  const questionById = new Map<string, T>();

  for (const question of questions) {
    if (!questionById.has(question.id)) {
      questionById.set(question.id, question);
    }
  }

  const todayKey = getLocalDateKey(now, timeZone);
  const completedToday = new Set(
    records
      .filter(isCompletedRecord)
      .filter((record) => record.student === student && record.subject === subject && questionById.has(record.questionId))
      .filter((record) => getLocalDateKey(new Date(record.createdAt), timeZone) === todayKey)
      .map((record) => record.questionId),
  );
  const histories = [...questionById.values()]
    .filter((question) => !completedToday.has(question.id))
    .map<QuestionHistory<T>>((question) => ({
      question,
      state: deriveReviewState({ records, student, subject, questionId: question.id, now, timeZone }),
    }));
  const selected: T[] = [];
  const limit = Math.min(Math.max(maxQuestions, 0), MAX_QUESTIONS);
  const dueUnstable = histories.filter((history) => history.state.isDue && (history.state.lastSessionHadWrong || history.state.stableSuccessStreak < 2));
  const dueStable = histories.filter((history) => history.state.isDue && !dueUnstable.includes(history));
  const neverCompleted = histories.filter((history) => history.state.lastCompletedLocalDate === null);

  addWithTopicSpread(selected, dueUnstable, compareUnstable, limit);
  addWithTopicSpread(selected, dueStable, compareDue, limit);
  addWithTopicSpread(selected, neverCompleted, compareNeverCompleted, limit);

  return selected;
}
