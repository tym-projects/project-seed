'use client';

import Link from 'next/link';
import { useState } from 'react';
import { QuestionCard, type QuestionCardQuestion } from '@/components/question/QuestionCard';
import { type StudentId, type LearningRecord, saveLearningRecord } from '@/lib/learning-records';

type ChineseQuestionFlowProps = {
  questions: QuestionCardQuestion[];
  student: StudentId;
  theme: 'pink' | 'green';
  pageTitle: string;
  homeHref: string;
  homeLabel: string;
  completionTitle?: string;
  completionMessage?: string;
};

const themeClasses = {
  pink: {
    page: 'bg-pink-50',
    title: 'text-pink-600',
    button: 'bg-pink-500 hover:bg-pink-600',
  },
  green: {
    page: 'bg-green-50',
    title: 'text-green-600',
    button: 'bg-green-500 hover:bg-green-600',
  },
};

export function ChineseQuestionFlow({
  questions,
  student,
  theme,
  pageTitle,
  homeHref,
  homeLabel,
  completionTitle = '練習完成！',
  completionMessage = '你已經完成今天的練習，做得很好！',
}: ChineseQuestionFlowProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;
  const classes = themeClasses[theme];

  if (isComplete) {
    return (
      <main className={`flex min-h-screen flex-col items-center justify-center px-6 py-12 ${classes.page}`}>
        <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
          <p className="text-5xl">🎉</p>
          <h1 className={`mt-4 text-4xl font-bold ${classes.title}`}>{completionTitle}</h1>
          <p className="mt-5 text-2xl font-bold text-gray-800">{completionMessage}</p>
          <p className="mt-4 text-lg text-gray-700">你完成了 {questions.length} / {questions.length} 題。</p>
          <p className="mt-3 text-lg text-gray-700">休息一下，明天再來學習！</p>
          <Link href={homeHref} className={`mt-8 inline-block rounded-xl px-6 py-3 font-bold text-white transition-colors ${classes.button}`}>
            {homeLabel}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center px-6 py-12 ${classes.page}`}>
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <h1 className={`text-4xl font-bold ${classes.title}`}>{pageTitle}</h1>
        <h2 className="mt-3 text-3xl font-bold text-gray-800">第 {questionIndex + 1} 題</h2>
        <QuestionCard
          key={question.id}
          question={question}
          hasNextQuestion={!isLastQuestion}
          onNextQuestion={() => setQuestionIndex((currentIndex) => currentIndex + 1)}
          onQuestionComplete={(completion) => {
            const record: LearningRecord = {
              id: crypto.randomUUID(),
              student,
              subject: 'chinese',
              questionId: completion.questionId,
              firstAnswer: completion.firstAnswer,
              finalAnswer: completion.finalAnswer,
              attempts: completion.attempts,
              correct: completion.correct,
              completed: completion.completed,
              createdAt: new Date().toISOString(),
            };

            saveLearningRecord(record);
          }}
          onComplete={() => setIsComplete(true)}
          theme={theme}
        />
      </section>
    </main>
  );
}
