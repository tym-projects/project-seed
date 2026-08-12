'use client';

import { useEffect, useState } from 'react';
import { QuestionOptions } from '@/components/question/QuestionOptions';
import { QuestionResult } from '@/components/question/QuestionResult';

export type QuestionCardQuestion = {
  id: string;
  title: string;
  instruction: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  encouragement: string;
};

type QuestionCardProps = {
  question: QuestionCardQuestion;
  hasNextQuestion: boolean;
  onNextQuestion: () => void;
  onComplete: () => void;
  theme: 'pink' | 'green';
};

const themeClasses = {
  pink: {
    divider: 'border-pink-100',
    title: 'text-pink-600',
    submit: 'bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200',
    next: 'border-pink-300 text-pink-600 hover:bg-pink-50',
  },
  green: {
    divider: 'border-green-100',
    title: 'text-green-600',
    submit: 'bg-green-500 hover:bg-green-600 disabled:bg-green-200',
    next: 'border-green-300 text-green-600 hover:bg-green-50',
  },
};

export function QuestionCard({ question, hasNextQuestion, onNextQuestion, onComplete, theme }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCorrect = selectedAnswer === question.answer;
  const classes = themeClasses[theme];

  useEffect(() => {
    if (isSubmitted && isCorrect && !hasNextQuestion) {
      onComplete();
    }
  }, [hasNextQuestion, isCorrect, isSubmitted, onComplete]);

  function selectAnswer(answerIndex: number) {
    setSelectedAnswer(answerIndex);
    setIsSubmitted(false);
  }

  return (
    <>
      <div className={`mt-8 border-t pt-6 text-left text-gray-700 ${classes.divider}`}>
        <p className={`text-lg font-bold ${classes.title}`}>{question.title}</p>
        <p className="mt-5 text-lg">{question.instruction}</p>
        <p className="mt-4 text-xl font-bold">{question.question}</p>

        <QuestionOptions
          options={question.options}
          selectedAnswer={selectedAnswer}
          onSelect={selectAnswer}
          theme={theme}
        />
      </div>

      <button
        type="button"
        onClick={() => setIsSubmitted(true)}
        disabled={selectedAnswer === null}
        className={`mt-8 w-full rounded-xl px-4 py-3 font-bold text-white transition-colors disabled:cursor-not-allowed ${classes.submit}`}
      >
        送出答案
      </button>

      {isSubmitted && (
        <QuestionResult
          isCorrect={isCorrect}
          encouragement={question.encouragement}
          explanation={question.explanation}
          theme={theme}
        />
      )}

      {isSubmitted && isCorrect && hasNextQuestion && (
        <button
          type="button"
          onClick={onNextQuestion}
          className={`mt-4 w-full rounded-xl border-2 bg-white px-4 py-3 font-bold transition-colors ${classes.next}`}
        >
          下一題
        </button>
      )}
    </>
  );
}
