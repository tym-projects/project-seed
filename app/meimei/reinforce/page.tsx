'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { questions } from '@/lib/questions/meimei-chinese';

export default function MeiMeiReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={questions} student="meimei" subject="chinese" theme="green" homeHref="/meimei" homeLabel="回到妹妹首頁" />;
}
