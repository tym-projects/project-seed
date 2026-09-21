export type QuestionFlowMode = 'formal-review' | 'reinforcement-practice';

export function shouldPersistLearningRecord(mode: QuestionFlowMode) {
  return mode === 'formal-review';
}
