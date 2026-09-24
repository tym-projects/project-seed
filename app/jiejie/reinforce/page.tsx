'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { practiceQuestions } from '@/lib/questions/jiejie-chinese';

export default function JieJieReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={practiceQuestions} student="jiejie" subject="chinese" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
