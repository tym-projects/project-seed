'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { questions } from '@/lib/questions/meimei-mathematics';

export default function MeiMeiMathematicsReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={questions} student="meimei" subject="mathematics" theme="green" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
