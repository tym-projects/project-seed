'use client';

import { useEffect, useState } from 'react';
import { FlowExitLink } from '@/components/navigation/FlowExitLink';
import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import type { QuestionCardQuestion } from '@/components/question/QuestionCard';
import { readLearningRecords, type StudentId, type SubjectId } from '@/lib/learning-records';
import { selectReinforcementPracticeItems, type ReinforcementPracticeItem } from '@/lib/reinforcement-practice';
import { toPracticeFlowItems } from '@/lib/reinforcement-practice-flow';

type ChineseReinforcementPracticePageProps = {
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

export function ChineseReinforcementPracticePage({ questions, student, subject, theme, homeHref, homeLabel }: ChineseReinforcementPracticePageProps) {
  const [items, setItems] = useState<ReinforcementPracticeItem<QuestionCardQuestion>[] | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const classes = themeClasses[theme];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setItems(selectReinforcementPracticeItems({
        questions,
        records: readLearningRecords(),
        student,
        subject,
        now: new Date(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [questions, student, subject]);

  if (items === null) {
    return <main className={`min-h-screen ${classes.page}`} />;
  }

  if (hasStarted && items.length > 0) {
    const flowItems = toPracticeFlowItems(items);
    return (
      <ChineseQuestionFlow
        questions={items.map((item) => item.primary)}
        reviewItems={flowItems}
        mode="reinforcement-practice"
        student={student}
        subject={subject}
        theme={theme}
        pageTitle="再練一次"
        homeHref={homeHref}
        homeLabel={homeLabel}
        completionTitle="再練習完成！"
        completionMessage="你把需要加強的觀念再練了一次，做得很好！"
      />
    );
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center px-6 py-12 ${classes.page}`}>
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
        <h1 className={`text-4xl font-bold ${classes.title}`}>再練一次</h1>
        {items.length > 0 ? (
          <>
            <p className="mt-5 text-2xl font-bold text-gray-800">今天準備了 {items.length} 個需要再練的觀念。</p>
            <p className="mt-3 text-lg text-gray-700">慢慢想，答錯也可以看提示再試一次。</p>
            <button type="button" onClick={() => setHasStarted(true)} className={`mt-8 rounded-xl px-6 py-3 font-bold text-white transition-colors ${classes.button}`}>
              開始再練一次
            </button>
          </>
        ) : (
          <>
            <p className="mt-5 text-2xl font-bold text-gray-800">目前沒有需要再練的題目。</p>
            <p className="mt-3 text-lg text-gray-700">先完成今天的學習，之後再回來看看吧！</p>
          </>
        )}
        <FlowExitLink href={homeHref} label={homeLabel} shouldConfirm={false} className={`mt-5 inline-block font-bold ${classes.title}`} />
      </section>
    </main>
  );
}
