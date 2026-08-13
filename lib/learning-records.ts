export type StudentId = 'jiejie' | 'meimei';

export type SubjectId = 'chinese';

export type LearningRecord = {
  id: string;
  student: StudentId;
  subject: SubjectId;
  questionId: string;
  firstAnswer: number;
  finalAnswer: number;
  attempts: number;
  correct: boolean;
  completed: boolean;
  createdAt: string;
};

export const LEARNING_RECORDS_STORAGE_KEY = 'project-seed:learning-records:v1';

function isBrowserStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isLearningRecord(value: unknown): value is LearningRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const hasValidDate = typeof record.createdAt === 'string' && Number.isFinite(Date.parse(record.createdAt));
  const hasValidAnswerIndexes =
    typeof record.firstAnswer === 'number' &&
    Number.isInteger(record.firstAnswer) &&
    record.firstAnswer >= 0 &&
    typeof record.finalAnswer === 'number' &&
    Number.isInteger(record.finalAnswer) &&
    record.finalAnswer >= 0;
  const hasValidAttempts = typeof record.attempts === 'number' && Number.isInteger(record.attempts) && record.attempts >= 1;

  return (
    typeof record.id === 'string' && record.id.length > 0 &&
    (record.student === 'jiejie' || record.student === 'meimei') &&
    record.subject === 'chinese' &&
    typeof record.questionId === 'string' && record.questionId.length > 0 &&
    hasValidAnswerIndexes &&
    hasValidAttempts &&
    typeof record.correct === 'boolean' &&
    typeof record.completed === 'boolean' &&
    hasValidDate
  );
}

export function readLearningRecords(): LearningRecord[] {
  if (!isBrowserStorageAvailable()) {
    return [];
  }

  try {
    const storedRecords = window.localStorage.getItem(LEARNING_RECORDS_STORAGE_KEY);

    if (storedRecords === null) {
      return [];
    }

    const parsedRecords: unknown = JSON.parse(storedRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords.filter(isLearningRecord);
  } catch {
    return [];
  }
}

export function saveLearningRecord(record: LearningRecord) {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.setItem(LEARNING_RECORDS_STORAGE_KEY, JSON.stringify([...readLearningRecords(), record]));
  } catch {
    // Storage can be unavailable or full; completing a question must still succeed.
  }
}
