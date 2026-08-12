import { type LearningRecord } from '@/lib/learning-records';
import { questions as jiejieChineseQuestions } from '@/lib/questions/jiejie-chinese';
import { questions as meimeiChineseQuestions } from '@/lib/questions/meimei-chinese';

type Question = {
  id: string;
  question: string;
  options: string[];
};

export type LearningRecordDisplay = LearningRecord & {
  questionText: string;
  firstAnswerText: string | null;
  finalAnswerText: string | null;
  status: string;
  completedAt: string;
};

const questionBanks: Record<LearningRecord['student'], Record<LearningRecord['subject'], Question[]>> = {
  jiejie: {
    chinese: jiejieChineseQuestions,
  },
  meimei: {
    chinese: meimeiChineseQuestions,
  },
};

export function getAttemptStatus(attempts: number) {
  if (attempts === 1) {
    return '一次答對';
  }

  if (attempts === 2) {
    return '曾經答錯';
  }

  return '多次嘗試後完成';
}

export function sortLearningRecords(records: LearningRecord[]) {
  return [...records].sort((first, second) => {
    const firstTime = Date.parse(first.createdAt);
    const secondTime = Date.parse(second.createdAt);

    if (Number.isNaN(firstTime) || Number.isNaN(secondTime)) {
      return 0;
    }

    return secondTime - firstTime;
  });
}

export function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '完成時間無法辨識';
  }

  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function toDisplayLearningRecord(record: LearningRecord): LearningRecordDisplay {
  const question = questionBanks[record.student][record.subject].find((item) => item.id === record.questionId);

  if (!question) {
    return {
      ...record,
      questionText: '這題已不在目前題庫',
      firstAnswerText: null,
      finalAnswerText: null,
      status: getAttemptStatus(record.attempts),
      completedAt: formatCreatedAt(record.createdAt),
    };
  }

  return {
    ...record,
    questionText: question.question,
    firstAnswerText: question.options[record.firstAnswer] ?? null,
    finalAnswerText: question.options[record.finalAnswer] ?? null,
    status: getAttemptStatus(record.attempts),
    completedAt: formatCreatedAt(record.createdAt),
  };
}
