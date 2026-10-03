'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { practiceQuestions } from '@/lib/questions/jiejie-social-studies';

export default function JieJieSocialStudiesReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={practiceQuestions} student="jiejie" subject="social_studies" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
