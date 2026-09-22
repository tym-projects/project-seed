'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { questions } from '@/lib/questions/meimei-natural-science';

export default function MeiMeiNaturalSciencePage() {
  return <ChineseQuestionFlow questions={questions} student="meimei" subject="natural_science" theme="green" pageTitle="🌿 妹妹的自然練習" homeHref="/meimei" homeLabel="回妹妹首頁" />;
}
