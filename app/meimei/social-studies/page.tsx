'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { questions } from '@/lib/questions/meimei-social-studies';

export default function MeiMeiSocialStudiesPage() {
  return <ChineseQuestionFlow questions={questions} student="meimei" subject="social_studies" theme="green" pageTitle="🌿 妹妹的社會練習" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
