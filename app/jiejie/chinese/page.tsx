'use client';

import Link from 'next/link';
import { useState } from 'react';
import { QuestionCard } from '@/components/question/QuestionCard';
import { questions } from '@/lib/questions/jiejie-chinese';

export default function JieJieChinesePage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;

  if (isComplete) {
    return (
      <main className="min-h-screen bg-pink-50 px-6 py-12 flex flex-col items-center justify-center">
        <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
          <p className="text-5xl">🎉</p>
          <h1 className="mt-4 text-4xl font-bold text-pink-600">太棒了！</h1>
          <p className="mt-5 text-2xl font-bold text-gray-800">今天的國語練習完成！</p>
          <p className="mt-4 text-lg text-gray-700">你完成了今天的 {questions.length} / {questions.length} 題。</p>
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
        <h1 className="text-4xl font-bold text-pink-600">🌸 姐姐的國語練習</h1>
        <h2 className="mt-3 text-3xl font-bold text-gray-800">📘 國語</h2>
        <QuestionCard
          key={question.id}
          question={question}
          hasNextQuestion={!isLastQuestion}
          onNextQuestion={() => setQuestionIndex((currentIndex) => currentIndex + 1)}
          onComplete={() => setIsComplete(true)}
          theme="pink"
        />
      </section>
    </main>
  );
}
