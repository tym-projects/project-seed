type QuestionOptionsProps = {
  options: string[];
  selectedAnswer: number | null;
  onSelect: (answerIndex: number) => void;
  theme: 'pink' | 'green';
};

const selectedClasses = {
  pink: 'border-pink-500 bg-pink-100 text-pink-700',
  green: 'border-green-500 bg-green-100 text-green-700',
};

const defaultClasses = {
  pink: 'border-pink-100 bg-white hover:border-pink-300',
  green: 'border-green-100 bg-white hover:border-green-300',
};

export function QuestionOptions({ options, selectedAnswer, onSelect, theme }: QuestionOptionsProps) {
  return (
    <div className="mt-6 space-y-3">
      {options.map((option, optionIndex) => {
        const isSelected = selectedAnswer === optionIndex;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(optionIndex)}
            className={`w-full rounded-xl border-2 px-4 py-3 text-left text-lg font-medium transition-colors ${
              isSelected ? selectedClasses[theme] : defaultClasses[theme]
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
