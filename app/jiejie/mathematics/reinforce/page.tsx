'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { questions } from '@/lib/questions/jiejie-mathematics';

export default function JieJieMathematicsReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={questions} student="jiejie" subject="mathematics" theme="pink" homeHref="/jiejie" homeLabel="回到姐姐首頁" />;
}
