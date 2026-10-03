'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { practiceQuestions } from '@/lib/questions/jiejie-mathematics';

export default function JieJieMathematicsReviewPage() {
  return <TodayReviewPage questions={practiceQuestions} student="jiejie" subject="mathematics" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
