export type ReviewQuestion = {
  id: string;
  topic: string;
  type: 'basic' | 'application';
};

export type ReviewLearningRecord = {
  student: string;
  subject: string;
  questionId: string;
  firstAnswer: number;
  finalAnswer: number;
  attempts: number;
  createdAt: string;
};

type TodayReviewOptions<T extends ReviewQuestion> = {
  questions: T[];
  records: ReviewLearningRecord[];
  student: string;
  subject: string;
  now: Date;
  timeZone: string;
  maxQuestions?: number;
};

type QuestionHistory<T extends ReviewQuestion> = {
  question: T;
  latestRecord: ReviewLearningRecord | undefined;
  latestRecordTime: number;
  latestRetryTime: number;
  isRecentRetry: boolean;
  isUnstable: boolean;
};

const MAX_QUESTIONS = 5;

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

function getTime(value: string) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? -Infinity : time;
}

function requiredRetries(record: ReviewLearningRecord) {
  return record.attempts > 1;
}

function hasUnstableHistory(records: ReviewLearningRecord[]) {
  let state: 'none' | 'wrong' | 'improved' = 'none';

  for (const record of records) {
    if (requiredRetries(record)) {
      if (state === 'improved') {
        return true;
      }

      state = 'wrong';
      continue;
    }

    if (state === 'wrong') {
      state = 'improved';
    }
  }

  return false;
}

function compareByEvidence<T extends ReviewQuestion>(first: QuestionHistory<T>, second: QuestionHistory<T>) {
  const firstAttempts = first.latestRecord?.attempts ?? 0;
  const secondAttempts = second.latestRecord?.attempts ?? 0;

  if (firstAttempts !== secondAttempts) {
    return secondAttempts - firstAttempts;
  }

  if (first.question.type !== second.question.type) {
    return first.question.type === 'application' ? -1 : 1;
  }

  if (first.latestRetryTime !== second.latestRetryTime) {
    return second.latestRetryTime - first.latestRetryTime;
  }

  return first.question.id.localeCompare(second.question.id);
}

function compareGeneral<T extends ReviewQuestion>(first: QuestionHistory<T>, second: QuestionHistory<T>) {
  if (first.latestRecordTime !== second.latestRecordTime) {
    return first.latestRecordTime - second.latestRecordTime;
  }

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

  const relevantRecords = records.filter((record) => record.student === student && record.subject === subject && questionById.has(record.questionId));
  const todayKey = getLocalDateKey(now, timeZone);
  const completedToday = new Set(
    relevantRecords
      .filter((record) => getTime(record.createdAt) !== -Infinity && getLocalDateKey(new Date(record.createdAt), timeZone) === todayKey)
      .map((record) => record.questionId),
  );
  const recordsByQuestionId = new Map<string, ReviewLearningRecord[]>();

  for (const record of relevantRecords) {
    if (!recordsByQuestionId.has(record.questionId)) {
      recordsByQuestionId.set(record.questionId, []);
    }

    recordsByQuestionId.get(record.questionId)?.push(record);
  }

  const histories = [...questionById.values()]
    .filter((question) => !completedToday.has(question.id))
    .map<QuestionHistory<T>>((question) => {
      const questionRecords = [...(recordsByQuestionId.get(question.id) ?? [])].sort((first, second) => getTime(first.createdAt) - getTime(second.createdAt));
      const latestRecord = questionRecords.at(-1);
      const retryRecords = questionRecords.filter(requiredRetries);

      return {
        question,
        latestRecord,
        latestRecordTime: latestRecord ? getTime(latestRecord.createdAt) : -Infinity,
        latestRetryTime: retryRecords.length > 0 ? getTime(retryRecords.at(-1)?.createdAt ?? '') : -Infinity,
        isRecentRetry: latestRecord ? requiredRetries(latestRecord) : false,
        isUnstable: hasUnstableHistory(questionRecords),
      };
    });
  const selected: T[] = [];
  const limit = Math.min(Math.max(maxQuestions, 0), MAX_QUESTIONS);

  addWithTopicSpread(selected, histories.filter((history) => history.isRecentRetry), compareByEvidence, limit);
  addWithTopicSpread(
    selected,
    histories.filter((history) => !history.isRecentRetry && history.isUnstable),
    compareByEvidence,
    limit,
  );
  addWithTopicSpread(
    selected,
    histories.filter((history) => !history.isRecentRetry && !history.isUnstable),
    compareGeneral,
    limit,
  );

  return selected;
}
