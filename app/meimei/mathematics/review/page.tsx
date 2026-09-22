'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { questions } from '@/lib/questions/meimei-mathematics';

export default function MeiMeiMathematicsReviewPage() {
  return <TodayReviewPage questions={questions} student="meimei" subject="mathematics" theme="green" homeHref="/meimei" homeLabel="回妹妹首頁" />;
}
