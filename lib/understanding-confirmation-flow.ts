export type ConfirmationFlowState = {
  itemIndex: number;
  phase: 'primary' | 'confirmation';
  isComplete: boolean;
};

type ConfirmationFlowItem = {
  confirmation: unknown | null;
};

type QuestionCompletion = {
  attempts: number;
  correct: true;
  completed: true;
};

export function getInitialConfirmationFlowState(itemCount: number): ConfirmationFlowState {
  return { itemIndex: 0, phase: 'primary', isComplete: itemCount === 0 };
}

export function advanceAfterCompletion({ state, item, completion, itemCount }: {
  state: ConfirmationFlowState;
  item: ConfirmationFlowItem;
  completion: QuestionCompletion;
  itemCount: number;
}): ConfirmationFlowState {
  if (state.isComplete) return state;

  if (state.phase === 'primary' && item.confirmation !== null && completion.attempts === 1) {
    return { ...state, phase: 'confirmation' };
  }

  if (state.itemIndex + 1 >= itemCount) {
    return { ...state, isComplete: true };
  }

  return { itemIndex: state.itemIndex + 1, phase: 'primary', isComplete: false };
}
