'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { questions } from '@/lib/questions/meimei-natural-science';

export default function MeiMeiNaturalScienceReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={questions} student="meimei" subject="natural_science" theme="green" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
