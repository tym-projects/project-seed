'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { practiceQuestions } from '@/lib/questions/jiejie-chinese';

export default function JieJieTodayReviewPage() {
  return <TodayReviewPage questions={practiceQuestions} student="jiejie" subject="chinese" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
