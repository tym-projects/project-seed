import type { StudentId, SubjectId } from '@/lib/learning-records';
import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

const FIRST_EXAM_QUESTION_IDS: Readonly<Record<StudentId, Readonly<Partial<Record<SubjectId, readonly string[]>>>>> = {
  jiejie: {
    chinese: [],
    mathematics: [
      'jiejie-mathematics-1', 'jiejie-mathematics-2', 'jiejie-mathematics-3', 'jiejie-mathematics-4',
      'jiejie-mathematics-7', 'jiejie-mathematics-8', 'jiejie-mathematics-9', 'jiejie-mathematics-10',
      'jiejie-mathematics-11', 'jiejie-mathematics-12', 'jiejie-mathematics-13',
    ],
    natural_science: [
      'jiejie-natural-science-1', 'jiejie-natural-science-2', 'jiejie-natural-science-3', 'jiejie-natural-science-4',
      'jiejie-natural-science-5', 'jiejie-natural-science-6', 'jiejie-natural-science-7', 'jiejie-natural-science-8',
      'jiejie-natural-science-9', 'jiejie-natural-science-10',
    ],
    social_studies: [
      'jiejie-social-studies-1', 'jiejie-social-studies-2', 'jiejie-social-studies-3', 'jiejie-social-studies-4',
      'jiejie-social-studies-5', 'jiejie-social-studies-6', 'jiejie-social-studies-7', 'jiejie-social-studies-8',
      'jiejie-social-studies-9', 'jiejie-social-studies-10',
    ],
  },
  meimei: {
    chinese: [
      'meimei-chinese-1', 'meimei-chinese-2', 'meimei-chinese-3', 'meimei-chinese-4', 'meimei-chinese-5',
      'meimei-chinese-6', 'meimei-chinese-7', 'meimei-chinese-8', 'meimei-chinese-9', 'meimei-chinese-10',
      'meimei-chinese-11', 'meimei-chinese-action-word-identification-3',
    ],
    mathematics: [
      'meimei-mathematics-1', 'meimei-mathematics-2', 'meimei-mathematics-3', 'meimei-mathematics-4',
      'meimei-mathematics-7', 'meimei-mathematics-8', 'meimei-mathematics-9', 'meimei-mathematics-10',
      'meimei-mathematics-11', 'meimei-mathematics-12',
    ],
    natural_science: [],
    social_studies: [
      'meimei-social-studies-1', 'meimei-social-studies-2', 'meimei-social-studies-3', 'meimei-social-studies-4',
      'meimei-social-studies-5', 'meimei-social-studies-6', 'meimei-social-studies-7', 'meimei-social-studies-8',
    ],
  },
};

export function getFirstExamQuestionIds(student: StudentId, subject: SubjectId): readonly string[] {
  return FIRST_EXAM_QUESTION_IDS[student][subject] ?? [];
}

export function getFirstExamQuestions(
  student: StudentId,
  subject: SubjectId,
  questions: readonly QuestionCardQuestion[],
): QuestionCardQuestion[] {
  const allowedIds = new Set(getFirstExamQuestionIds(student, subject));
  return questions.filter(({ id }) => allowedIds.has(id));
}
