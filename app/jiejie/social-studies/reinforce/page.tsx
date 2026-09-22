'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { questions } from '@/lib/questions/jiejie-social-studies';

export default function JieJieSocialStudiesReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={questions} student="jiejie" subject="social_studies" theme="pink" homeHref="/jiejie" homeLabel="回到姐姐首頁" />;
}
