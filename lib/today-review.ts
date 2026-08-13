import { deriveReviewState, getLocalDateKey, type ReviewState } from '@/lib/spaced-review';

export type ReviewQuestion = {
  id: string;
  topic: string;
  type: 'basic' | 'application';
  reviewGroupId?: string;
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

type CompletedRecord = {
  student: string;
  subject: string;
  questionId: string;
  createdAt: string;
  attempts: number;
  correct: true;
  completed: true;
};

type ReviewGroup<T extends ReviewQuestion> = {
  id: string;
  questions: T[];
};

type GroupHistory<T extends ReviewQuestion> = {
  group: ReviewGroup<T>;
  state: ReviewState;
};

const MAX_QUESTIONS = 5;

function isCompletedRecord(value: unknown): value is CompletedRecord {
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

function compareUnstable<T extends ReviewQuestion>(first: GroupHistory<T>, second: GroupHistory<T>) {
  if (first.state.lastSessionHadWrong !== second.state.lastSessionHadWrong) {
    return first.state.lastSessionHadWrong ? -1 : 1;
  }

  if (first.state.stableSuccessStreak !== second.state.stableSuccessStreak) {
    return first.state.stableSuccessStreak - second.state.stableSuccessStreak;
  }

  return compareDue(first, second);
}

function compareDue<T extends ReviewQuestion>(first: GroupHistory<T>, second: GroupHistory<T>) {
  const firstDate = first.state.nextReviewLocalDate ?? '';
  const secondDate = second.state.nextReviewLocalDate ?? '';

  if (firstDate !== secondDate) {
    return firstDate.localeCompare(secondDate);
  }

  if (first.group.questions[0].type !== second.group.questions[0].type) {
    return first.group.questions[0].type === 'application' ? -1 : 1;
  }

  return first.group.id.localeCompare(second.group.id);
}

function compareNeverCompleted<T extends ReviewQuestion>(first: GroupHistory<T>, second: GroupHistory<T>) {
  if (first.group.questions[0].type !== second.group.questions[0].type) {
    return first.group.questions[0].type === 'application' ? -1 : 1;
  }

  return first.group.id.localeCompare(second.group.id);
}

function addWithTopicSpread<T extends ReviewQuestion>(
  selected: GroupHistory<T>[],
  candidates: GroupHistory<T>[],
  compare: (first: GroupHistory<T>, second: GroupHistory<T>) => number,
  limit: number,
) {
  const usedGroupIds = new Set(selected.map((history) => history.group.id));
  const usedTopics = new Set(selected.map((history) => history.group.questions[0].topic));
  const remaining = candidates.filter((candidate) => !usedGroupIds.has(candidate.group.id)).sort(compare);

  for (const candidate of remaining) {
    if (selected.length >= limit) return;
    if (!usedTopics.has(candidate.group.questions[0].topic)) {
      selected.push(candidate);
      usedGroupIds.add(candidate.group.id);
      usedTopics.add(candidate.group.questions[0].topic);
    }
  }

  for (const candidate of remaining) {
    if (selected.length >= limit) return;
    if (!usedGroupIds.has(candidate.group.id)) {
      selected.push(candidate);
      usedGroupIds.add(candidate.group.id);
      usedTopics.add(candidate.group.questions[0].topic);
    }
  }
}

function hashSelectionKey(key: string) {
  let hash = 0;

  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash * 31) + key.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function selectVariation<T extends ReviewQuestion>(group: ReviewGroup<T>, records: CompletedRecord[], student: string, subject: string, localReviewDate: string): T {
  const groupQuestionIds = new Set(group.questions.map((question) => question.id));
  const latestQuestionId = records
    .filter((record) => record.student === student && record.subject === subject && groupQuestionIds.has(record.questionId))
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))[0]?.questionId;
  let selectedIndex = hashSelectionKey(`${student}:${subject}:${group.id}:${localReviewDate}`) % group.questions.length;

  if (group.questions.length > 1 && group.questions[selectedIndex].id === latestQuestionId) {
    selectedIndex = (selectedIndex + 1) % group.questions.length;
  }

  return group.questions[selectedIndex];
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
    if (!questionById.has(question.id)) questionById.set(question.id, question);
  }

  const groupsById = new Map<string, ReviewGroup<T>>();
  for (const question of questionById.values()) {
    const groupId = question.reviewGroupId ?? question.id;
    const group = groupsById.get(groupId) ?? { id: groupId, questions: [] };
    group.questions.push(question);
    groupsById.set(groupId, group);
  }

  const validRecords = records.filter(isCompletedRecord);
  const questionGroupById = new Map<string, string>();
  for (const group of groupsById.values()) {
    for (const question of group.questions) questionGroupById.set(question.id, group.id);
  }

  const todayKey = getLocalDateKey(now, timeZone);
  const completedGroupIdsToday = new Set(
    validRecords
      .filter((record) => record.student === student && record.subject === subject)
      .filter((record) => getLocalDateKey(new Date(record.createdAt), timeZone) === todayKey)
      .map((record) => questionGroupById.get(record.questionId))
      .filter((groupId): groupId is string => groupId !== undefined),
  );
  const histories = [...groupsById.values()]
    .filter((group) => !completedGroupIdsToday.has(group.id))
    .map<GroupHistory<T>>((group) => ({
      group,
      state: deriveReviewState({
        records,
        student,
        subject,
        questionId: group.questions[0].id,
        questionIds: group.questions.map((question) => question.id),
        now,
        timeZone,
      }),
    }));
  const selected: GroupHistory<T>[] = [];
  const limit = Math.min(Math.max(maxQuestions, 0), MAX_QUESTIONS);
  const dueUnstable = histories.filter((history) => history.state.isDue && (history.state.lastSessionHadWrong || history.state.stableSuccessStreak < 2));
  const dueStable = histories.filter((history) => history.state.isDue && !dueUnstable.includes(history));
  const neverCompleted = histories.filter((history) => history.state.lastCompletedLocalDate === null);

  addWithTopicSpread(selected, dueUnstable, compareUnstable, limit);
  addWithTopicSpread(selected, dueStable, compareDue, limit);
  addWithTopicSpread(selected, neverCompleted, compareNeverCompleted, limit);

  return selected.map((history) => selectVariation(history.group, validRecords, student, subject, todayKey));
}
