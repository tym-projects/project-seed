import type { StudentId, SubjectId } from '@/lib/learning-records';

export type SubjectNavigationItem = {
  subject: SubjectId;
  label: string;
  practice: string;
  exam: string;
  review: string;
  reinforce: string;
};

export const SUBJECT_NAVIGATION: readonly SubjectNavigationItem[] = [
  { subject: 'chinese', label: '國語', practice: '/chinese', exam: '/exam/chinese', review: '/review', reinforce: '/reinforce' },
  { subject: 'mathematics', label: '數學', practice: '/mathematics', exam: '/exam/mathematics', review: '/mathematics/review', reinforce: '/mathematics/reinforce' },
  { subject: 'natural_science', label: '自然', practice: '/natural-science', exam: '/exam/natural-science', review: '/natural-science/review', reinforce: '/natural-science/reinforce' },
  { subject: 'social_studies', label: '社會', practice: '/social-studies', exam: '/exam/social-studies', review: '/social-studies/review', reinforce: '/social-studies/reinforce' },
];

export function getStudentSubjectNavigation(student: StudentId) {
  return SUBJECT_NAVIGATION.map((item) => ({
    ...item,
    student,
    actions: {
      practice: `/${student}${item.practice}`,
      exam: `/${student}${item.exam}`,
      review: `/${student}${item.review}`,
      reinforce: `/${student}${item.reinforce}`,
    },
  }));
}
