'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { questions } from '@/lib/questions/jiejie-chinese';

export default function JieJieReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={questions} student="jiejie" subject="chinese" theme="pink" homeHref="/jiejie" homeLabel="回到姐姐首頁" />;
}
