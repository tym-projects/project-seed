'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { practiceQuestions } from '@/lib/questions/jiejie-chinese';

export default function JieJieChinesePage() {
  return (
    <ChineseQuestionFlow
      questions={practiceQuestions}
      student="jiejie"
      subject="chinese"
      theme="pink"
      pageTitle="🌸 姐姐的國語複習"
      homeHref="/jiejie"
      homeLabel="返回姐姐首頁"
    />
  );
}
