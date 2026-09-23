'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { questions } from '@/lib/questions/meimei-natural-science';

export default function MeiMeiNaturalScienceReviewPage() {
  return <TodayReviewPage questions={questions} student="meimei" subject="natural_science" theme="green" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
