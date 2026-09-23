'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { questions } from '@/lib/questions/jiejie-mathematics';

export default function JieJieMathematicsPage() {
  return (
    <ChineseQuestionFlow
      questions={questions}
      student="jiejie"
      subject="mathematics"
      theme="pink"
      pageTitle="🌸 姐姐的數學練習"
      homeHref="/jiejie"
      homeLabel="返回姐姐首頁"
    />
  );
}
