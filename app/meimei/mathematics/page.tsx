'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { questions } from '@/lib/questions/meimei-mathematics';

export default function MeiMeiMathematicsPage() {
  return (
    <ChineseQuestionFlow
      questions={questions}
      student="meimei"
      subject="mathematics"
      theme="green"
      pageTitle="🌱 妹妹的數學練習"
      homeHref="/meimei"
      homeLabel="回到妹妹首頁"
    />
  );
}
