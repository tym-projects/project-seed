'use client';

import { ChineseReinforcementPracticePage } from '@/components/practice/ChineseReinforcementPracticePage';
import { questions } from '@/lib/questions/meimei-social-studies';

export default function MeiMeiSocialStudiesReinforcementPage() {
  return <ChineseReinforcementPracticePage questions={questions} student="meimei" subject="social_studies" theme="green" homeHref="/meimei" homeLabel="回妹妹首頁" />;
}
