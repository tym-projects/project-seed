import type { LearningRecord } from '@/lib/learning-records';

export type LearningRecordDiagnostic = {
  keyExists: boolean;
  rawIsNull: boolean;
  parseStatus: 'success' | 'failed';
  parsedContainerType: 'none' | 'array' | 'object' | 'string' | 'number' | 'boolean';
  totalRecordCount: number;
  validRecordCount: number;
  invalidRecordCount: number;
  validationStatus: 'no-key' | 'empty-array' | 'parse-failed' | 'schema-invalid' | 'partially-valid' | 'valid';
};

function isLearningRecord(value: unknown): value is LearningRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && record.id.length > 0 &&
    (record.student === 'jiejie' || record.student === 'meimei') &&
    (record.subject === 'chinese' || record.subject === 'mathematics' || record.subject === 'natural_science' || record.subject === 'social_studies') &&
    typeof record.questionId === 'string' && record.questionId.length > 0 &&
    Number.isInteger(record.firstAnswer) && (record.firstAnswer as number) >= 0 &&
    Number.isInteger(record.finalAnswer) && (record.finalAnswer as number) >= 0 &&
    Number.isInteger(record.attempts) && (record.attempts as number) >= 1 &&
    typeof record.correct === 'boolean' && typeof record.completed === 'boolean' &&
    typeof record.createdAt === 'string' && Number.isFinite(Date.parse(record.createdAt));
}

function getContainerType(value: unknown): LearningRecordDiagnostic['parsedContainerType'] {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'none';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'none';
}

export function diagnoseLearningRecordStorage(rawValue: string | null): LearningRecordDiagnostic {
  if (rawValue === null) {
    return {
      keyExists: false,
      rawIsNull: true,
      parseStatus: 'failed',
      parsedContainerType: 'none',
      totalRecordCount: 0,
      validRecordCount: 0,
      invalidRecordCount: 0,
      validationStatus: 'no-key',
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return {
      keyExists: true,
      rawIsNull: false,
      parseStatus: 'failed',
      parsedContainerType: 'none',
      totalRecordCount: 0,
      validRecordCount: 0,
      invalidRecordCount: 0,
      validationStatus: 'parse-failed',
    };
  }

  const parsedContainerType = getContainerType(parsed);
  if (!Array.isArray(parsed)) {
    return {
      keyExists: true,
      rawIsNull: false,
      parseStatus: 'success',
      parsedContainerType,
      totalRecordCount: 0,
      validRecordCount: 0,
      invalidRecordCount: 0,
      validationStatus: 'schema-invalid',
    };
  }

  const validRecordCount = parsed.filter(isLearningRecord).length;
  const totalRecordCount = parsed.length;
  const invalidRecordCount = totalRecordCount - validRecordCount;
  const validationStatus = totalRecordCount === 0 ? 'empty-array' :
    validRecordCount === totalRecordCount ? 'valid' :
    validRecordCount > 0 ? 'partially-valid' : 'schema-invalid';

  return {
    keyExists: true,
    rawIsNull: false,
    parseStatus: 'success',
    parsedContainerType,
    totalRecordCount,
    validRecordCount,
    invalidRecordCount,
    validationStatus,
  };
}
