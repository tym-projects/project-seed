import { addLocalDays, deriveReviewState, getLocalDateKey } from '@/lib/spaced-review';
import { findPendingConfirmation } from '@/lib/understanding-confirmation';
import type { StudentId, SubjectId } from '@/lib/learning-records';

export type ParentSummaryQuestion = { id: string; question: string; reviewGroupId?: string };
export type ParentSummaryPeriod = { completedRecordCount: number; completedLearningGroupCount: number; firstTryCorrectCount: number; firstTryCorrectRate: number | null; retryRecordCount: number };
export type ParentSummaryAttentionItem =
  | { kind: 'repeated-retry'; unitId: string; label: string; retryRecordCount: number; retryDateCount: number }
  | { kind: 'due-review'; unitId: string; label: string };
export type ParentSummaryDueItem = { unitId: string; label: string; unstable: boolean };
export type ParentSummaryPendingItem = { unitId: string; label: string };
export type ParentLearningSummary = {
  today: ParentSummaryPeriod;
  last7Days: ParentSummaryPeriod;
  latestLearningLocalDate: string | null;
  dueLearningUnitCount: number;
  dueItems: ParentSummaryDueItem[];
  pendingConfirmationItems: ParentSummaryPendingItem[];
  attentionItems: ParentSummaryAttentionItem[];
};

type CompletedRecord = {
  id: string; student: string; subject: string; questionId: string; firstAnswer: number; finalAnswer: number;
  attempts: number; correct: true; completed: true; createdAt: string;
};

function isCompletedRecord(value: unknown): value is CompletedRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && record.id.length > 0 &&
    typeof record.student === 'string' && typeof record.subject === 'string' &&
    typeof record.questionId === 'string' && record.questionId.length > 0 &&
    typeof record.firstAnswer === 'number' && Number.isInteger(record.firstAnswer) && record.firstAnswer >= 0 &&
    typeof record.finalAnswer === 'number' && Number.isInteger(record.finalAnswer) && record.finalAnswer >= 0 &&
    typeof record.attempts === 'number' && Number.isInteger(record.attempts) && record.attempts >= 1 &&
    record.correct === true && record.completed === true &&
    typeof record.createdAt === 'string' && Number.isFinite(Date.parse(record.createdAt));
}

function toPeriod(records: CompletedRecord[], start: string, end: string, timeZone: string, unitByQuestionId: Map<string, string>): ParentSummaryPeriod {
  const inRange = records.filter((record) => {
    const date = getLocalDateKey(new Date(record.createdAt), timeZone);
    return date >= start && date <= end;
  });
  const completedRecordCount = inRange.length;
  const completedLearningGroupCount = new Set(inRange.map((record) => unitByQuestionId.get(record.questionId) ?? record.questionId)).size;
  const firstTryCorrectCount = inRange.filter((record) => record.attempts === 1).length;
  return {
    completedRecordCount,
    completedLearningGroupCount,
    firstTryCorrectCount,
    firstTryCorrectRate: completedRecordCount === 0 ? null : firstTryCorrectCount / completedRecordCount,
    retryRecordCount: inRange.filter((record) => record.attempts > 1).length,
  };
}

export function createParentLearningSummary({ records, student, subject, questions, now, timeZone }: {
  records: unknown[]; student: StudentId; subject: SubjectId; questions: ParentSummaryQuestion[]; now: Date; timeZone: string;
}): ParentLearningSummary {
  const validRecords = records.filter(isCompletedRecord).filter((record) => record.student === student && record.subject === subject);
  const todayKey = getLocalDateKey(now, timeZone);
  const last7Start = addLocalDays(todayKey, -6);
  const units = new Map<string, ParentSummaryQuestion[]>();
  const unitByQuestionId = new Map<string, string>();
  for (const question of questions) {
    const unitId = question.reviewGroupId ?? question.id;
    const unit = units.get(unitId) ?? [];
    unit.push(question);
    units.set(unitId, unit);
    unitByQuestionId.set(question.id, unitId);
  }
  const latestLearningLocalDate = validRecords.reduce<string | null>((latest, record) => {
    const date = getLocalDateKey(new Date(record.createdAt), timeZone);
    return latest === null || date > latest ? date : latest;
  }, null);
  const todayUnits = new Set(validRecords
    .filter((record) => getLocalDateKey(new Date(record.createdAt), timeZone) === todayKey)
    .map((record) => unitByQuestionId.get(record.questionId))
    .filter((unitId): unitId is string => unitId !== undefined));
  const dueItems: ParentSummaryAttentionItem[] = [];
  const dueOverviewItems: ParentSummaryDueItem[] = [];
  const pendingConfirmationItems: ParentSummaryPendingItem[] = [];
  let dueLearningUnitCount = 0;
  for (const [unitId, unitQuestions] of units) {
    const state = deriveReviewState({ records: validRecords, student, subject, questionId: unitQuestions[0].id, questionIds: unitQuestions.map((question) => question.id), now, timeZone });
    const group = { id: unitId, questions: unitQuestions.map((question) => ({ ...question, topic: 'parent-summary', type: 'basic' as const })) };
    const pending = findPendingConfirmation({ group, records: validRecords, student, subject, now, timeZone });
    if (pending) {
      pendingConfirmationItems.push({ unitId, label: unitQuestions[0].question });
    } else if (state.isDue) {
      dueLearningUnitCount += 1;
      if (!todayUnits.has(unitId)) {
        dueItems.push({ kind: 'due-review', unitId, label: unitQuestions[0].question });
        dueOverviewItems.push({ unitId, label: unitQuestions[0].question, unstable: state.lastSessionHadWrong });
      }
    }
  }
  const retryGroups = new Map<string, { label: string; ids: Set<string>; dates: Set<string> }>();
  for (const record of validRecords) {
    const date = getLocalDateKey(new Date(record.createdAt), timeZone);
    if (record.attempts <= 1 || date < last7Start || date > todayKey) continue;
    const unitId = unitByQuestionId.get(record.questionId) ?? record.questionId;
    const label = units.get(unitId)?.[0].question ?? record.questionId;
    const group = retryGroups.get(unitId) ?? { label, ids: new Set<string>(), dates: new Set<string>() };
    group.ids.add(record.id);
    group.dates.add(date);
    retryGroups.set(unitId, group);
  }
  const repeatedItems: ParentSummaryAttentionItem[] = [...retryGroups.entries()]
    .filter(([, group]) => group.dates.size >= 2)
    .map(([unitId, group]) => ({ kind: 'repeated-retry' as const, unitId, label: group.label, retryRecordCount: group.ids.size, retryDateCount: group.dates.size, latestRetryDate: [...group.dates].sort().at(-1) ?? '' }))
    .sort((a, b) => b.latestRetryDate.localeCompare(a.latestRetryDate) || b.retryDateCount - a.retryDateCount || a.unitId.localeCompare(b.unitId))
    .slice(0, 3)
    .map((item) => ({ kind: item.kind, unitId: item.unitId, label: item.label, retryRecordCount: item.retryRecordCount, retryDateCount: item.retryDateCount }));
  dueItems.sort((a, b) => a.unitId.localeCompare(b.unitId));
  return {
    today: toPeriod(validRecords, todayKey, todayKey, timeZone, unitByQuestionId),
    last7Days: toPeriod(validRecords, last7Start, todayKey, timeZone, unitByQuestionId),
    latestLearningLocalDate,
    dueLearningUnitCount,
    dueItems: dueOverviewItems.sort((a, b) => Number(b.unstable) - Number(a.unstable) || a.unitId.localeCompare(b.unitId)).slice(0, 5),
    pendingConfirmationItems: pendingConfirmationItems.sort((a, b) => a.unitId.localeCompare(b.unitId)),
    attentionItems: [...repeatedItems, ...dueItems],
  };
}
