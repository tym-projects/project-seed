'use client';

import { useState } from 'react';

const questions = [
  {
    title: '第一題',
    instruction: '請選出正確的注音。',
    prompt: '香蕉 的「蕉」讀音是？',
    choices: [
      { id: 'jiao', label: '① ㄐㄧㄠ' },
      { id: 'qiao', label: '② ㄑㄧㄠ' },
      { id: 'xiao', label: '③ ㄒㄧㄠ' },
    ],
    correctAnswer: 'jiao',
    correctFeedback: ['🎉 答對了！', '「蕉」讀作 ㄐㄧㄠ。', '你已經掌握這個字的讀音！'],
    incorrectFeedback: ['❌ 答錯了。', '提示：「蕉」跟「交朋友」的「交」讀音相同。', '再想一次！'],
  },
  {
    title: '第二題',
    instruction: '請選出正確的部首。',
    prompt: '「天空」的「天」是什麼部首？',
    choices: [
      { id: 'big', label: '① 大' },
      { id: 'one', label: '② 一' },
      { id: 'person', label: '③ 人' },
    ],
    correctAnswer: 'big',
    correctFeedback: ['🎉 答對了！', '「天」的部首是「大」。'],
    incorrectFeedback: ['❌ 答錯了。', '提示：想想天空很大的樣子。', '再想一次！'],
  },
];

export default function JieJieChinesePage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const question = questions[questionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;

  function selectAnswer(answerId: string) {
    setSelectedAnswer(answerId);
    setIsSubmitted(false);
  }

  function goToNextQuestion() {
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-pink-50 px-6 py-12 flex flex-col items-center justify-center">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <h1 className="text-4xl font-bold text-pink-600">👧 姐姐模式</h1>
        <h2 className="mt-3 text-3xl font-bold text-gray-800">📘 國語</h2>

        <div className="mt-8 border-t border-pink-100 pt-6 text-left text-gray-700">
          <p className="text-lg font-bold text-pink-600">{question.title}</p>
          <p className="mt-5 text-lg">{question.instruction}</p>
          <p className="mt-4 text-xl font-bold">{question.prompt}</p>

          <div className="mt-6 space-y-3">
            {question.choices.map((choice) => {
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
                <p className="text-lg font-bold">{question.correctFeedback[0]}</p>
                {question.correctFeedback.slice(1).map((message) => (
                  <p key={message} className="mt-2">{message}</p>
                ))}
              </>
            ) : (
              <>
                <p className="text-lg font-bold">{question.incorrectFeedback[0]}</p>
                {question.incorrectFeedback.slice(1).map((message) => (
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
