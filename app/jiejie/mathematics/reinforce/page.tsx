'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { practiceQuestions } from '@/lib/questions/jiejie-mathematics';

export default function JieJieMathematicsReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={practiceQuestions} student="jiejie" subject="mathematics" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
