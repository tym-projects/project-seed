'use client';

import Link from 'next/link';
import { useState } from 'react';
import { questions } from '@/data/chinese/grade6';

export default function JieJieChinesePage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const question = questions[questionIndex];
  const isCorrect = selectedAnswer === question.answer;
  const isComplete = isSubmitted && isCorrect && questionIndex === questions.length - 1;

  function selectAnswer(answerId: string) {
    setSelectedAnswer(answerId);
    setIsSubmitted(false);
  }

  function goToNextQuestion() {
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-pink-50 px-6 py-12 flex flex-col items-center justify-center">
        <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
          <p className="text-5xl">🎉</p>
          <h1 className="mt-4 text-4xl font-bold text-pink-600">太棒了！</h1>
          <p className="mt-5 text-2xl font-bold text-gray-800">今天的國語練習完成！</p>
          <p className="mt-4 text-lg text-gray-700">你完成了今天的 2 / 2 題。</p>
          <p className="mt-3 text-lg text-gray-700">明天再一起學習吧 🌱</p>
          <Link
            href="/jiejie"
            className="mt-8 inline-block rounded-xl bg-pink-500 px-6 py-3 font-bold text-white transition-colors hover:bg-pink-600"
          >
            回姐姐首頁
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 px-6 py-12 flex flex-col items-center justify-center">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <h1 className="text-4xl font-bold text-pink-600">👧 姐姐模式</h1>
        <h2 className="mt-3 text-3xl font-bold text-gray-800">📘 國語</h2>

        <div className="mt-8 border-t border-pink-100 pt-6 text-left text-gray-700">
          <p className="text-lg font-bold text-pink-600">{question.title}</p>
          <p className="mt-5 text-lg">{question.instruction}</p>
          <p className="mt-4 text-xl font-bold">{question.question}</p>

          <div className="mt-6 space-y-3">
            {question.options.map((choice) => {
              const isSelected = selectedAnswer === choice.id;

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => selectAnswer(choice.id)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left text-lg font-medium transition-colors ${
                    isSelected
                      ? 'border-pink-500 bg-pink-100 text-pink-700'
                      : 'border-pink-100 bg-white hover:border-pink-300'
                  }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitted(true)}
          disabled={!selectedAnswer}
          className="mt-8 w-full rounded-xl bg-pink-500 px-4 py-3 font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-200"
        >
          送出答案
        </button>

        {isSubmitted && (
          <div className={`mt-5 rounded-xl p-4 text-center ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-pink-50 text-pink-700'}`}>
            {isCorrect ? (
              <>
                <p className="text-lg font-bold">{question.explanation[0]}</p>
                {question.explanation.slice(1).map((message) => (
                  <p key={message} className="mt-2">{message}</p>
                ))}
              </>
            ) : (
              <>
                <p className="text-lg font-bold">{question.hint[0]}</p>
                {question.hint.slice(1).map((message) => (
                  <p key={message} className="mt-2">{message}</p>
                ))}
              </>
            )}
          </div>
        )}

        {isSubmitted && isCorrect && questionIndex < questions.length - 1 && (
          <button
            type="button"
            onClick={goToNextQuestion}
            className="mt-4 w-full rounded-xl border-2 border-pink-300 bg-white px-4 py-3 font-bold text-pink-600 transition-colors hover:bg-pink-50"
          >
            下一題
          </button>
        )}
      </section>
    </main>
  );
}
