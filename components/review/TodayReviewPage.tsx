'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import type { QuestionCardQuestion } from '@/components/question/QuestionCard';
import { readLearningRecords, type StudentId, type SubjectId } from '@/lib/learning-records';
import { endReviewSession, getOrCreateReviewSession, type ReviewSession } from '@/lib/review-sessions';
import { getReviewTargetMinutes, type ReviewTargetMinutes } from '@/lib/review-time-settings';
import { selectTodayReviewItems } from '@/lib/today-review';
import type { ConfirmationPlan } from '@/lib/understanding-confirmation';

type TodayReviewPageProps = {
  questions: QuestionCardQuestion[];
  student: StudentId;
  subject: SubjectId;
  theme: 'pink' | 'green';
  homeHref: string;
  homeLabel: string;
};

const themeClasses = {
  pink: { page: 'bg-pink-50', title: 'text-pink-600', button: 'bg-pink-500 hover:bg-pink-600' },
  green: { page: 'bg-green-50', title: 'text-green-600', button: 'bg-green-500 hover:bg-green-600' },
};

export function TodayReviewPage({ questions, student, subject, theme, homeHref, homeLabel }: TodayReviewPageProps) {
  const [reviewItems, setReviewItems] = useState<ConfirmationPlan<QuestionCardQuestion>[] | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [reviewSession, setReviewSession] = useState<ReviewSession | null>(null);
  const [reviewTargetMinutes, setReviewTargetMinutes] = useState<ReviewTargetMinutes | null>(null);
  const classes = themeClasses[theme];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setReviewItems(
        selectTodayReviewItems({
          questions,
          records: readLearningRecords(),
          student,
          subject,
          now: new Date(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [questions, student, subject]);

  if (reviewItems === null) {
    return <main className={`min-h-screen ${classes.page}`} />;
  }

  if (hasStarted && reviewSession !== null && reviewItems.length > 0) {
    return (
      <ChineseQuestionFlow
        questions={reviewItems.map((item) => item.primary)}
        reviewItems={reviewItems}
        student={student}
        subject={subject}
        theme={theme}
        pageTitle="今日複習"
        homeHref={homeHref}
        homeLabel={homeLabel}
        completionTitle="今日複習完成！"
        completionMessage="今天的複習已完成，做得很好！"
        reviewStartedAt={reviewSession.startedAt}
        reviewTargetMinutes={reviewTargetMinutes}
        onReviewComplete={() => endReviewSession(student, subject)}
      />
    );
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center px-6 py-12 ${classes.page}`}>
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
        <h1 className={`text-4xl font-bold ${classes.title}`}>今日複習</h1>
        {reviewItems.length > 0 ? (
          <>
            <p className="mt-5 text-2xl font-bold text-gray-800">今天準備了 {reviewItems.length} 題。</p>
            <p className="mt-3 text-lg text-gray-700">慢慢想，答錯也可以再試一次。</p>
            <button type="button" onClick={() => {
              const session = getOrCreateReviewSession({
                student,
                subject,
                now: new Date(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              });
              setReviewSession(session);
              setReviewTargetMinutes(getReviewTargetMinutes(student, subject));
              setHasStarted(true);
            }} className={`mt-8 rounded-xl px-6 py-3 font-bold text-white transition-colors ${classes.button}`}>
              開始複習
            </button>
          </>
        ) : (
          <>
            <p className="mt-5 text-2xl font-bold text-gray-800">今天沒有新的複習題目。</p>
            <p className="mt-3 text-lg text-gray-700">今天做過的題目明天再見！</p>
          </>
        )}
        <Link href={homeHref} className={`mt-5 inline-block font-bold ${classes.title}`}>
          {homeLabel}
        </Link>
      </section>
    </main>
  );
}
