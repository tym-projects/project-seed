export type QuestionBankMetadata = {
  id: string;
  reviewGroupId?: string;
  topic: string;
  type: string;
  options: string[];
  answer: number;
  hint?: string;
  explanation: string;
};

export type QuestionBankValidationOptions = {
  requireHintIds?: string[];
};

export type QuestionBankCoverageOptions = {
  activeTopics: readonly string[];
  minimumUnitsPerActiveTopic: number;
  minimumUnitsByActiveTopic?: Readonly<Record<string, number>>;
  minimumTotalUnits: number;
};

export type QuestionBankValidationResult = {
  errors: string[];
  unitIds: string[];
  topicUnitCounts: Map<string, number>;
};

const validQuestionTypes = new Set(['basic', 'application']);

export function getLearningUnitId(question: Pick<QuestionBankMetadata, 'id' | 'reviewGroupId'>) {
  return question.reviewGroupId ?? question.id;
}

export function collectLearningUnits(questions: Pick<QuestionBankMetadata, 'id' | 'reviewGroupId'>[]) {
  return Array.from(new Set(questions.map(getLearningUnitId))).sort();
}

export function validateQuestionBank(
  questions: QuestionBankMetadata[],
  { requireHintIds = [] }: QuestionBankValidationOptions = {},
): QuestionBankValidationResult {
  const errors: string[] = [];
  const ids = new Set<string>();
  const requiredHints = new Set(requireHintIds);
  const groupMetadata = new Map<string, Pick<QuestionBankMetadata, 'topic' | 'type'>>();

  for (const question of questions) {
    if (ids.has(question.id)) {
      errors.push(`duplicate id: ${question.id}`);
    }
    ids.add(question.id);

    if (!question.topic?.trim()) {
      errors.push(`missing topic: ${question.id}`);
    }
    if (!question.type?.trim()) {
      errors.push(`missing type: ${question.id}`);
    } else if (!validQuestionTypes.has(question.type)) {
      errors.push(`invalid type: ${question.id}`);
    }
    if (!Array.isArray(question.options) || question.options.length === 0) {
      errors.push(`missing options: ${question.id}`);
    } else if (new Set(question.options).size !== question.options.length) {
      errors.push(`duplicate options: ${question.id}`);
    }
    if (!Array.isArray(question.options) || !Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length) {
      errors.push(`answer not in options: ${question.id}`);
    }
    if (!question.explanation?.trim()) {
      errors.push(`missing explanation: ${question.id}`);
    }
    if (requiredHints.has(question.id) && !question.hint?.trim()) {
      errors.push(`missing hint: ${question.id}`);
    }

    if (question.reviewGroupId !== undefined) {
      const initialMetadata = groupMetadata.get(question.reviewGroupId);
      if (!initialMetadata) {
        groupMetadata.set(question.reviewGroupId, question);
      } else {
        if (initialMetadata.topic !== question.topic) {
          errors.push(`review group topic mismatch: ${question.reviewGroupId}`);
        }
        if (initialMetadata.type !== question.type) {
          errors.push(`review group type mismatch: ${question.reviewGroupId}`);
        }
      }
    }
  }

  const unitIds = collectLearningUnits(questions);
  const topicUnitSets = new Map<string, Set<string>>();
  for (const question of questions) {
    const units = topicUnitSets.get(question.topic) ?? new Set<string>();
    units.add(getLearningUnitId(question));
    topicUnitSets.set(question.topic, units);
  }

  return {
    errors,
    unitIds,
    topicUnitCounts: new Map(Array.from(topicUnitSets, ([topic, units]) => [topic, units.size])),
  };
}

export function validateQuestionBankCoverage(
  questions: QuestionBankMetadata[],
  { activeTopics, minimumUnitsPerActiveTopic, minimumUnitsByActiveTopic = {}, minimumTotalUnits }: QuestionBankCoverageOptions,
): QuestionBankValidationResult {
  const result = validateQuestionBank(questions);
  const errors = [...result.errors];

  for (const topic of activeTopics) {
    const minimumUnits = minimumUnitsByActiveTopic[topic] ?? minimumUnitsPerActiveTopic;
    const unitCount = result.topicUnitCounts.get(topic) ?? 0;
    if (unitCount < minimumUnits) {
      errors.push(`insufficient active topic units: ${topic} (${unitCount}/${minimumUnits})`);
    }
  }

  if (result.unitIds.length < minimumTotalUnits) {
    errors.push(`insufficient total units: ${result.unitIds.length}/${minimumTotalUnits}`);
  }

  return { ...result, errors };
}
