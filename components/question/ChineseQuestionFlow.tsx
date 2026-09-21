'use client';

import Link from 'next/link';
import { useState } from 'react';
import { QuestionCard, type QuestionCardQuestion, type QuestionCompletion } from '@/components/question/QuestionCard';
import { type StudentId, type LearningRecord, saveLearningRecord } from '@/lib/learning-records';
import { shouldPersistLearningRecord, type QuestionFlowMode } from '@/lib/practice-persistence';
import type { ConfirmationPlan } from '@/lib/understanding-confirmation';
import { advanceAfterCompletion, getInitialConfirmationFlowState } from '@/lib/understanding-confirmation-flow';
import { getReviewTimeNotice } from '@/lib/review-session-time';
import type { ReviewTargetMinutes } from '@/lib/review-time-settings';
import { useReviewElapsedMinutes } from '@/components/review/useReviewElapsedMinutes';

type ChineseQuestionFlowProps = {
  questions: QuestionCardQuestion[];
  student: StudentId;
  theme: 'pink' | 'green';
  pageTitle: string;
  homeHref: string;
  homeLabel: string;
  completionTitle?: string;
  completionMessage?: string;
  reviewStartedAt?: string;
  reviewTargetMinutes?: ReviewTargetMinutes | null;
  reviewItems?: ConfirmationPlan<QuestionCardQuestion>[];
  mode?: QuestionFlowMode;
  onReviewComplete?: () => void;
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
  reviewStartedAt,
  reviewTargetMinutes,
  reviewItems,
  mode = 'formal-review',
  onReviewComplete,
}: ChineseQuestionFlowProps) {
  const flowItems: ConfirmationPlan<QuestionCardQuestion>[] = reviewItems ?? questions.map((question) => ({
    groupId: question.reviewGroupId ?? question.id,
    primary: question,
    confirmation: null,
  }));
  const [flowState, setFlowState] = useState(() => getInitialConfirmationFlowState(flowItems.length));
  const [pendingCompletion, setPendingCompletion] = useState<QuestionCompletion | null>(null);
  const isComplete = flowState.isComplete;
  const currentItem = flowItems[flowState.itemIndex];
  const question = flowState.phase === 'confirmation' && currentItem.confirmation ? currentItem.confirmation : currentItem.primary;
  const isLastQuestion = flowState.itemIndex === flowItems.length - 1;
  const hasNextQuestion = flowState.phase === 'primary'
    ? currentItem.confirmation !== null || !isLastQuestion
    : !isLastQuestion;
  const classes = themeClasses[theme];
  const elapsedMinutes = useReviewElapsedMinutes(reviewStartedAt);
  const reviewTimeNotice = reviewStartedAt ? getReviewTimeNotice(elapsedMinutes, reviewTargetMinutes ?? null) : null;

  if (isComplete) {
    return (
      <main className={`flex min-h-screen flex-col items-center justify-center px-6 py-12 ${classes.page}`}>
        <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
          <p className="text-5xl">🎉</p>
          <h1 className={`mt-4 text-4xl font-bold ${classes.title}`}>{completionTitle}</h1>
          <p className="mt-5 text-2xl font-bold text-gray-800">{completionMessage}</p>
          <p className="mt-4 text-lg text-gray-700">你完成了 {flowItems.length} / {flowItems.length} 題。</p>
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
        {mode === 'reinforcement-practice' && <Link href={homeHref} className={`mt-3 inline-block font-bold ${classes.title}`}>{homeLabel}</Link>}
        {reviewStartedAt && <p className="mt-3 text-lg font-bold text-gray-700">已複習 {elapsedMinutes} 分鐘</p>}
        {reviewTimeNotice?.kind === 'gentle-ten-minute' && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-lg font-bold text-amber-800">已經複習 10 分鐘，可以完成目前題目後休息。</p>}
        {reviewTimeNotice?.kind === 'target-complete' && reviewTimeNotice.targetMinutes === 10 && <p className="mt-3 rounded-xl bg-amber-100 p-3 text-lg font-bold text-amber-900">今天已經複習 10 分鐘，可以休息囉！</p>}
        {reviewTimeNotice?.kind === 'target-complete' && reviewTimeNotice.targetMinutes === 15 && <p className="mt-3 rounded-xl bg-amber-100 p-3 text-lg font-bold text-amber-900">已經複習 15 分鐘，完成目前題目後，現在就休息吧。</p>}
        <h2 className="mt-3 text-3xl font-bold text-gray-800">第 {flowState.itemIndex + 1} 題</h2>
        {flowState.phase === 'confirmation' && <p className="mt-3 rounded-xl bg-blue-50 p-3 text-lg font-bold text-blue-800">換一種問法試試看，看看你是不是真的懂了。</p>}
        <QuestionCard
          key={`${flowState.itemIndex}:${flowState.phase}:${question.id}`}
          question={question}
          hasNextQuestion={hasNextQuestion}
          onNextQuestion={() => {
            if (!pendingCompletion) return;
            const nextState = advanceAfterCompletion({
              state: flowState,
              item: currentItem,
              completion: pendingCompletion,
              itemCount: flowItems.length,
            });
            setPendingCompletion(null);
            if (nextState.isComplete) {
              onReviewComplete?.();
            }
            setFlowState(nextState);
          }}
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

            if (shouldPersistLearningRecord(mode)) {
              saveLearningRecord(record);
            }
            setPendingCompletion(completion);
          }}
          onComplete={() => {
            onReviewComplete?.();
            setFlowState((currentState) => ({ ...currentState, isComplete: true }));
          }}
          theme={theme}
        />
      </section>
    </main>
  );
}
