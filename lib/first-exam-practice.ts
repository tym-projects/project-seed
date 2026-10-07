import type { StudentId, SubjectId } from '@/lib/learning-records';
import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

const FIRST_EXAM_QUESTION_IDS: Readonly<Record<StudentId, Readonly<Partial<Record<SubjectId, readonly string[]>>>>> = {
  jiejie: {
    chinese: [
      'jiejie-chinese-10', 'jiejie-chinese-11', 'jiejie-chinese-12', 'jiejie-chinese-13',
      'jiejie-chinese-14', 'jiejie-chinese-15', 'jiejie-chinese-16', 'jiejie-chinese-17',
      'jiejie-chinese-70', 'jiejie-chinese-71', 'jiejie-chinese-72', 'jiejie-chinese-73', 'jiejie-chinese-74',
    ],
    mathematics: [
      'jiejie-mathematics-1', 'jiejie-mathematics-2', 'jiejie-mathematics-3', 'jiejie-mathematics-4',
      'jiejie-mathematics-7', 'jiejie-mathematics-8', 'jiejie-mathematics-9', 'jiejie-mathematics-10',
      'jiejie-mathematics-11', 'jiejie-mathematics-12', 'jiejie-mathematics-13',
      'jiejie-mathematics-14', 'jiejie-mathematics-15',
      'jiejie-mathematics-63', 'jiejie-mathematics-64', 'jiejie-mathematics-65', 'jiejie-mathematics-66', 'jiejie-mathematics-67',
    ],
    natural_science: [
      'jiejie-natural-science-1', 'jiejie-natural-science-2', 'jiejie-natural-science-3', 'jiejie-natural-science-4',
      'jiejie-natural-science-5', 'jiejie-natural-science-6', 'jiejie-natural-science-7', 'jiejie-natural-science-8',
      'jiejie-natural-science-9', 'jiejie-natural-science-10', 'jiejie-natural-science-11', 'jiejie-natural-science-12',
      'jiejie-natural-science-61', 'jiejie-natural-science-62', 'jiejie-natural-science-63', 'jiejie-natural-science-64', 'jiejie-natural-science-65',
    ],
    social_studies: [
      'jiejie-social-studies-3', 'jiejie-social-studies-4',
      'jiejie-social-studies-5', 'jiejie-social-studies-6', 'jiejie-social-studies-7', 'jiejie-social-studies-8',
      'jiejie-social-studies-9', 'jiejie-social-studies-10', 'jiejie-social-studies-11', 'jiejie-social-studies-12',
      'jiejie-social-studies-63', 'jiejie-social-studies-64', 'jiejie-social-studies-65', 'jiejie-social-studies-66', 'jiejie-social-studies-67',
    ],
  },
  meimei: {
    chinese: [
      'meimei-chinese-1', 'meimei-chinese-2', 'meimei-chinese-3', 'meimei-chinese-4', 'meimei-chinese-5',
      'meimei-chinese-6', 'meimei-chinese-7', 'meimei-chinese-8', 'meimei-chinese-9', 'meimei-chinese-10',
      'meimei-chinese-11', 'meimei-chinese-action-word-identification-3',
      'meimei-chinese-61', 'meimei-chinese-62', 'meimei-chinese-63', 'meimei-chinese-64', 'meimei-chinese-65',
    ],
    mathematics: [
      'meimei-mathematics-1', 'meimei-mathematics-2', 'meimei-mathematics-3', 'meimei-mathematics-4',
      'meimei-mathematics-7', 'meimei-mathematics-8', 'meimei-mathematics-9', 'meimei-mathematics-10',
      'meimei-mathematics-11', 'meimei-mathematics-12',
      'meimei-mathematics-61', 'meimei-mathematics-62', 'meimei-mathematics-63', 'meimei-mathematics-64', 'meimei-mathematics-65',
    ],
    natural_science: [
      'meimei-natural-science-1', 'meimei-natural-science-2', 'meimei-natural-science-3', 'meimei-natural-science-4',
      'meimei-natural-science-5', 'meimei-natural-science-6', 'meimei-natural-science-7', 'meimei-natural-science-8',
      'meimei-natural-science-9', 'meimei-natural-science-10', 'meimei-natural-science-11', 'meimei-natural-science-12',
      'meimei-natural-science-61', 'meimei-natural-science-62', 'meimei-natural-science-63', 'meimei-natural-science-64', 'meimei-natural-science-65',
    ],
    social_studies: [
      'meimei-social-studies-1', 'meimei-social-studies-2', 'meimei-social-studies-3', 'meimei-social-studies-4',
      'meimei-social-studies-5', 'meimei-social-studies-6', 'meimei-social-studies-7', 'meimei-social-studies-8',
      'meimei-social-studies-9', 'meimei-social-studies-10',
      'meimei-social-studies-61', 'meimei-social-studies-62', 'meimei-social-studies-63', 'meimei-social-studies-64', 'meimei-social-studies-65',
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
