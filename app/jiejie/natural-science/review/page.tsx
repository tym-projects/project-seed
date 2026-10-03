'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { practiceQuestions } from '@/lib/questions/jiejie-natural-science';

export default function JieJieNaturalScienceReviewPage() {
  return <TodayReviewPage questions={practiceQuestions} student="jiejie" subject="natural_science" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
