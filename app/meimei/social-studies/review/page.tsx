'use client';

import { TodayReviewPage } from '@/components/review/TodayReviewPage';
import { questions } from '@/lib/questions/meimei-social-studies';

export default function MeiMeiSocialStudiesReviewPage() {
  return <TodayReviewPage questions={questions} student="meimei" subject="social_studies" theme="green" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
