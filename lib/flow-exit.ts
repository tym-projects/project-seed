export type FlowAnswerState = {
  selectedAnswer: number | null;
  isSubmitted: boolean;
  isCorrect: boolean;
};

export function getFlowHomeTarget(href: string, label: string) {
  return { href, label };
}

export function shouldConfirmFlowExit({ selectedAnswer, isSubmitted, isCorrect }: FlowAnswerState) {
  return selectedAnswer !== null && (!isSubmitted || !isCorrect);
}
