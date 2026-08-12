type QuestionResultProps = {
  isCorrect: boolean;
  encouragement: string;
  explanation: string;
  theme: 'pink' | 'green';
};

const resultClasses = {
  pink: {
    correct: 'bg-green-50 text-green-700',
    incorrect: 'bg-pink-50 text-pink-700',
  },
  green: {
    correct: 'bg-green-50 text-green-700',
    incorrect: 'bg-green-50 text-green-700',
  },
};

export function QuestionResult({ isCorrect, encouragement, explanation, theme }: QuestionResultProps) {
  return (
    <div className={`mt-5 rounded-xl p-4 text-center ${resultClasses[theme][isCorrect ? 'correct' : 'incorrect']}`}>
      {isCorrect ? (
        <>
          <p className="text-lg font-bold">{encouragement}</p>
          <p className="mt-2">{explanation}</p>
        </>
      ) : (
        <>
          <p className="text-lg font-bold">❌ 答錯了。</p>
          <p className="mt-2">再想一次！</p>
        </>
      )}
    </div>
  );
}
