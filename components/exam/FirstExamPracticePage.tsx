import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import type { QuestionCardQuestion } from '@/components/question/QuestionCard';
import type { StudentId, SubjectId } from '@/lib/learning-records';

type FirstExamPracticePageProps = {
  questions: QuestionCardQuestion[];
  student: StudentId;
  subject: SubjectId;
  theme: 'pink' | 'green';
  pageTitle: string;
  homeHref: string;
  homeLabel: string;
};

const themeClasses = {
  pink: { page: 'bg-pink-50', title: 'text-pink-600', button: 'bg-pink-500 hover:bg-pink-600' },
  green: { page: 'bg-green-50', title: 'text-green-600', button: 'bg-green-500 hover:bg-green-600' },
};

export function FirstExamPracticePage({ questions, student, subject, theme, pageTitle, homeHref, homeLabel }: FirstExamPracticePageProps) {
  const classes = themeClasses[theme];

  if (questions.length === 0) {
    return (
      <main className={`flex min-h-screen flex-col items-center justify-center px-6 py-12 ${classes.page}`}>
        <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
          <h1 className={`text-4xl font-bold ${classes.title}`}>{pageTitle}</h1>
          <p className="mt-6 text-2xl font-bold text-gray-800">第一次月考題庫準備中</p>
          <p className="mt-3 text-lg text-gray-700">目前還沒有可用的月考範圍題目，請先使用一般練習。</p>
          <a href={homeHref} className={`mt-8 inline-block rounded-xl px-6 py-3 font-bold text-white transition-colors ${classes.button}`}>{homeLabel}</a>
        </section>
      </main>
    );
  }

  return (
    <ChineseQuestionFlow
      questions={questions}
      student={student}
      subject={subject}
      theme={theme}
      pageTitle={pageTitle}
      homeHref={homeHref}
      homeLabel={homeLabel}
      completionTitle="第一次月考練習完成！"
      completionMessage="你已完成目前月考範圍的練習，做得很好！"
    />
  );
}
