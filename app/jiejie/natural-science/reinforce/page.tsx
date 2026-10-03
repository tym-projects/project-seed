'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { practiceQuestions } from '@/lib/questions/jiejie-natural-science';

export default function JieJieNaturalScienceReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={practiceQuestions} student="jiejie" subject="natural_science" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
