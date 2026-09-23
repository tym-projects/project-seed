'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { questions } from '@/lib/questions/meimei-chinese';

export default function MeiMeiTodayReviewPage() {
  return <TodayReviewPage questions={questions} student="meimei" subject="chinese" theme="green" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
