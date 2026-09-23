'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { questions } from '@/lib/questions/jiejie-natural-science';

export default function JieJieNaturalScienceReviewPage() {
  return <TodayReviewPage questions={questions} student="jiejie" subject="natural_science" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
