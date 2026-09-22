'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { questions } from '@/lib/questions/jiejie-social-studies';

export default function JieJieSocialStudiesReviewPage() {
  return <TodayReviewPage questions={questions} student="jiejie" subject="social_studies" theme="pink" homeHref="/jiejie" homeLabel="回姐姐首頁" />;
}
