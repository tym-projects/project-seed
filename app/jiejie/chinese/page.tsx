'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { questions } from '@/lib/questions/jiejie-chinese';

export default function JieJieChinesePage() {
  return (
    <ChineseQuestionFlow
      questions={questions}
      student="jiejie"
      theme="pink"
      pageTitle="🌸 姐姐的國語複習"
      homeHref="/jiejie"
      homeLabel="回到姐姐首頁"
    />
  );
}
