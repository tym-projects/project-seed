'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { questions } from '@/lib/questions/jiejie-chinese';

export default function JieJieTodayReviewPage() {
  return <TodayReviewPage questions={questions} student="jiejie" theme="pink" homeHref="/jiejie" homeLabel="回姐姐首頁" />;
}
