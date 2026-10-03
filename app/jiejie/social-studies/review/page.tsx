'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { practiceQuestions } from '@/lib/questions/jiejie-social-studies';

export default function JieJieSocialStudiesReviewPage() {
  return <TodayReviewPage questions={practiceQuestions} student="jiejie" subject="social_studies" theme="pink" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
