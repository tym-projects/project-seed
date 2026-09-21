import type { PracticeQuestion, ReinforcementPracticeItem } from '@/lib/reinforcement-practice';

export type ReinforcementFlowItem<T extends PracticeQuestion> = {
  groupId: string;
  primary: T;
  confirmation: null;
};

export function toPracticeFlowItems<T extends PracticeQuestion>(items: ReinforcementPracticeItem<T>[]): ReinforcementFlowItem<T>[] {
  return items.map((item) => ({
    groupId: item.groupId,
    primary: item.primary,
    confirmation: null,
  }));
}
