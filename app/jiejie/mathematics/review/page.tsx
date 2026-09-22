'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { questions } from '@/lib/questions/jiejie-mathematics';

export default function JieJieMathematicsReviewPage() {
  return <TodayReviewPage questions={questions} student="jiejie" subject="mathematics" theme="pink" homeHref="/jiejie" homeLabel="回姐姐首頁" />;
}
