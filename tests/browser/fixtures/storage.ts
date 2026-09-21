export const STORAGE_KEYS = {
  learningRecords: 'project-seed:learning-records:v1',
  reviewSessions: 'project-seed:review-sessions:v1',
  reviewSettings: 'project-seed:review-settings:v1',
} as const;

export type SyntheticStorageState = Partial<Record<(typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS], string>>;

type FixtureOptions = {
  learningRecords?: unknown[];
  reviewSessions?: unknown[];
  reviewSettings?: unknown[];
};

export function createSyntheticStorageState({ learningRecords, reviewSessions, reviewSettings }: FixtureOptions = {}): SyntheticStorageState {
  const state: SyntheticStorageState = {};
  if (learningRecords !== undefined) state[STORAGE_KEYS.learningRecords] = JSON.stringify(learningRecords);
  if (reviewSessions !== undefined) state[STORAGE_KEYS.reviewSessions] = JSON.stringify(reviewSessions);
  if (reviewSettings !== undefined) state[STORAGE_KEYS.reviewSettings] = JSON.stringify(reviewSettings);
  return state;
}
