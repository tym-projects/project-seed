'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { questions } from '@/lib/questions/jiejie-social-studies';

export default function JieJieSocialStudiesPage() {
  return <ChineseQuestionFlow questions={questions} student="jiejie" subject="social_studies" theme="pink" pageTitle="🌸 姐姐的社會練習" homeHref="/jiejie" homeLabel="回到姐姐首頁" />;
}
