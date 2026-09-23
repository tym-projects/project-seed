'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { questions } from '@/lib/questions/jiejie-natural-science';

export default function JieJieNaturalScienceReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={questions} student="jiejie" subject="natural_science" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
