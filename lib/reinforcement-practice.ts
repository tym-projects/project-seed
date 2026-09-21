import { addLocalDays, deriveReviewState, getLocalDateKey } from '@/lib/spaced-review';

export type PracticeQuestion = {
  id: string;
  reviewGroupId?: string;
  topic: string;
  type: 'basic' | 'application';
};

export type ReinforcementPracticeItem<T extends PracticeQuestion> = {
  groupId: string;
  primary: T;
};

type PracticeRecord = {
  student: string;
  subject: string;
  questionId: string;
  firstAnswer: number;
  finalAnswer: number;
  attempts: number;
  correct: true;
  completed: true;
  createdAt: string;
};

type PracticeGroup<T extends PracticeQuestion> = {
  id: string;
  questions: T[];
};

type Candidate<T extends PracticeQuestion> = {
  group: PracticeGroup<T>;
  records: PracticeRecord[];
  latestRetryDate: string;
  retryCount: number;
  latestCompletedDate: string;
};

function isPracticeRecord(value: unknown): value is PracticeRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.student === 'string'
    && typeof record.subject === 'string'
    && typeof record.questionId === 'string'
    && record.questionId.length > 0
    && typeof record.firstAnswer === 'number'
    && Number.isInteger(record.firstAnswer)
    && record.firstAnswer >= 0
    && typeof record.finalAnswer === 'number'
    && Number.isInteger(record.finalAnswer)
    && record.finalAnswer >= 0
    && typeof record.attempts === 'number'
    && Number.isInteger(record.attempts)
    && record.attempts >= 1
    && record.correct === true
    && record.completed === true
    && typeof record.createdAt === 'string'
    && Number.isFinite(Date.parse(record.createdAt));
}

function getGroupId(question: PracticeQuestion) {
  return question.reviewGroupId ?? question.id;
}

function hashSelectionKey(key: string) {
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash * 31) + key.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function selectPracticeVariation<T extends PracticeQuestion>(
  group: PracticeGroup<T>,
  records: PracticeRecord[],
  student: string,
  subject: string,
  localDate: string,
) {
  const latestQuestionId = records
    .filter((record) => record.student === student && record.subject === subject)
    .sort((first, second) => {
      const dateDifference = Date.parse(second.createdAt) - Date.parse(first.createdAt);
      return dateDifference === 0 ? second.questionId.localeCompare(first.questionId) : dateDifference;
    })[0]?.questionId;
  let selectedIndex = hashSelectionKey(`${student}:${subject}:${group.id}:${localDate}:practice`) % group.questions.length;

  if (group.questions.length > 1 && group.questions[selectedIndex].id === latestQuestionId) {
    selectedIndex = (selectedIndex + 1) % group.questions.length;
  }

  return group.questions[selectedIndex];
}

function compareCandidates<T extends PracticeQuestion>(first: Candidate<T>, second: Candidate<T>) {
  if (first.latestRetryDate !== second.latestRetryDate) {
    return second.latestRetryDate.localeCompare(first.latestRetryDate);
  }
  if (first.retryCount !== second.retryCount) {
    return second.retryCount - first.retryCount;
  }
  if (first.latestCompletedDate !== second.latestCompletedDate) {
    return second.latestCompletedDate.localeCompare(first.latestCompletedDate);
  }
  return first.group.id.localeCompare(second.group.id);
}

export function selectReinforcementPracticeItems<T extends PracticeQuestion>({
  questions,
  records,
  student,
  subject,
  now,
  timeZone,
  maxItems = 3,
}: {
  questions: T[];
  records: unknown[];
  student: string;
  subject: string;
  now: Date;
  timeZone: string;
  maxItems?: number;
}): ReinforcementPracticeItem<T>[] {
  const questionById = new Map<string, T>();
  for (const question of questions) {
    if (!questionById.has(question.id)) questionById.set(question.id, question);
  }

  const groupsById = new Map<string, PracticeGroup<T>>();
  for (const question of questionById.values()) {
    const groupId = getGroupId(question);
    const group = groupsById.get(groupId) ?? { id: groupId, questions: [] };
    group.questions.push(question);
    groupsById.set(groupId, group);
  }

  const validRecords = records.filter(isPracticeRecord).filter((record) => record.student === student && record.subject === subject);
  const questionGroupById = new Map<string, string>();
  for (const group of groupsById.values()) {
    for (const question of group.questions) questionGroupById.set(question.id, group.id);
  }

  const today = getLocalDateKey(now, timeZone);
  const lookbackStart = addLocalDays(today, -7);
  const max = Math.min(Math.max(maxItems, 0), 3);
  if (max === 0) return [];

  const candidates: Candidate<T>[] = [];
  for (const group of groupsById.values()) {
    const groupRecords = validRecords.filter((record) => questionGroupById.get(record.questionId) === group.id);
    const hasRecordToday = groupRecords.some((record) => getLocalDateKey(new Date(record.createdAt), timeZone) === today);
    if (hasRecordToday) continue;

    const history = groupRecords.filter((record) => getLocalDateKey(new Date(record.createdAt), timeZone) < today);
    const state = deriveReviewState({
      records: history,
      student,
      subject,
      questionId: group.questions[0].id,
      questionIds: group.questions.map((question) => question.id),
      now,
      timeZone,
    });
    if (state.isDue) continue;

    const lookback = history.filter((record) => {
      const localDate = getLocalDateKey(new Date(record.createdAt), timeZone);
      return localDate >= lookbackStart && localDate < today;
    });
    const retryRecords = lookback.filter((record) => record.attempts > 1);
    if (retryRecords.length === 0) continue;

    const retryDates = retryRecords.map((record) => getLocalDateKey(new Date(record.createdAt), timeZone)).sort();
    const completionDates = history.map((record) => getLocalDateKey(new Date(record.createdAt), timeZone)).sort();
    candidates.push({
      group,
      records: groupRecords,
      latestRetryDate: retryDates.at(-1)!,
      retryCount: retryRecords.length,
      latestCompletedDate: completionDates.at(-1)!,
    });
  }

  return candidates
    .sort(compareCandidates)
    .slice(0, max)
    .map((candidate) => ({
      groupId: candidate.group.id,
      primary: selectPracticeVariation(candidate.group, candidate.records, student, subject, today),
    }));
}
