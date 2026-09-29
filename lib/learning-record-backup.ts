import { isLearningRecord, LEARNING_RECORDS_STORAGE_KEY, type LearningRecord } from '@/lib/learning-records';

export const LEARNING_RECORD_BACKUP_FORMAT = 'project-seed-learning-records-backup';
export const LEARNING_RECORD_BACKUP_VERSION = 1;

export type LearningRecordBackup = {
  format: typeof LEARNING_RECORD_BACKUP_FORMAT;
  version: typeof LEARNING_RECORD_BACKUP_VERSION;
  exportedAt: string;
  recordCount: number;
  records: LearningRecord[];
};

export type LearningRecordMergeCounts = {
  existing: number;
  imported: number;
  added: number;
  duplicates: number;
  final: number;
};

type BackupParseResult =
  | { ok: true; backup: LearningRecordBackup }
  | { ok: false; error: string };

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function createLearningRecordBackup(records: LearningRecord[], exportedAt = new Date().toISOString()): LearningRecordBackup {
  if (!records.every(isLearningRecord)) {
    throw new Error('Cannot export invalid learning records');
  }

  if (!Number.isFinite(Date.parse(exportedAt))) {
    throw new Error('Invalid export timestamp');
  }

  return {
    format: LEARNING_RECORD_BACKUP_FORMAT,
    version: LEARNING_RECORD_BACKUP_VERSION,
    exportedAt,
    recordCount: records.length,
    records: records.map((record) => ({ ...record })),
  };
}

export function parseLearningRecordBackup(rawBackup: string): BackupParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBackup);
  } catch {
    return { ok: false, error: 'Backup JSON could not be parsed' };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'Backup root must be an object' };
  }

  const envelope = parsed as Record<string, unknown>;
  if (envelope.format !== LEARNING_RECORD_BACKUP_FORMAT) {
    return { ok: false, error: 'Unsupported backup format' };
  }
  if (envelope.version !== LEARNING_RECORD_BACKUP_VERSION) {
    return { ok: false, error: 'Unsupported backup version' };
  }
  if (typeof envelope.exportedAt !== 'string' || !Number.isFinite(Date.parse(envelope.exportedAt))) {
    return { ok: false, error: 'Invalid export timestamp' };
  }
  if (!Number.isInteger(envelope.recordCount) || (envelope.recordCount as number) < 0) {
    return { ok: false, error: 'Invalid record count' };
  }
  if (!Array.isArray(envelope.records)) {
    return { ok: false, error: 'Backup records must be an array' };
  }
  if (envelope.recordCount !== envelope.records.length) {
    return { ok: false, error: 'Record count does not match records length' };
  }
  if (!envelope.records.every(isLearningRecord)) {
    return { ok: false, error: 'Backup contains an invalid learning record' };
  }

  return {
    ok: true,
    backup: {
      format: LEARNING_RECORD_BACKUP_FORMAT,
      version: LEARNING_RECORD_BACKUP_VERSION,
      exportedAt: envelope.exportedAt,
      recordCount: envelope.recordCount,
      records: envelope.records,
    },
  };
}

export function mergeLearningRecords(existingRecords: LearningRecord[], importedRecords: LearningRecord[]) {
  if (!existingRecords.every(isLearningRecord) || !importedRecords.every(isLearningRecord)) {
    throw new Error('Cannot merge invalid learning records');
  }

  const byId = new Map(existingRecords.map((record) => [record.id, record]));
  const merged = [...existingRecords];
  let duplicates = 0;

  for (const imported of importedRecords) {
    const existing = byId.get(imported.id);
    if (existing) {
      if (JSON.stringify(existing) !== JSON.stringify(imported)) {
        throw new Error(`Conflicting learning record id: ${imported.id}`);
      }
      duplicates += 1;
      continue;
    }
    byId.set(imported.id, imported);
    merged.push(imported);
  }

  const counts: LearningRecordMergeCounts = {
    existing: existingRecords.length,
    imported: importedRecords.length,
    added: merged.length - existingRecords.length,
    duplicates,
    final: merged.length,
  };
  return { records: merged, counts };
}

export type LearningRecordImportResult =
  | { ok: true; counts: LearningRecordMergeCounts }
  | { ok: false; error: string };

export function importLearningRecordBackup(storage: StorageLike, rawBackup: string): LearningRecordImportResult {
  const parsedBackup = parseLearningRecordBackup(rawBackup);
  if (!parsedBackup.ok) return parsedBackup;

  let existingRecords: LearningRecord[] = [];
  const rawExisting = storage.getItem(LEARNING_RECORDS_STORAGE_KEY);
  if (rawExisting !== null) {
    try {
      const parsedExisting: unknown = JSON.parse(rawExisting);
      if (!Array.isArray(parsedExisting) || !parsedExisting.every(isLearningRecord)) {
        return { ok: false, error: 'Existing learning records are invalid' };
      }
      existingRecords = parsedExisting;
    } catch {
      return { ok: false, error: 'Existing learning records could not be parsed' };
    }
  }

  let merged: ReturnType<typeof mergeLearningRecords>;
  try {
    merged = mergeLearningRecords(existingRecords, parsedBackup.backup.records);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Learning records could not be merged' };
  }

  try {
    storage.setItem(LEARNING_RECORDS_STORAGE_KEY, JSON.stringify(merged.records));
  } catch {
    return { ok: false, error: 'Learning record storage write failed' };
  }

  return { ok: true, counts: merged.counts };
}
