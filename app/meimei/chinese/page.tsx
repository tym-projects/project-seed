'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { questions } from '@/lib/questions/meimei-chinese';

export default function MeiMeiChinesePage() {
  return (
    <ChineseQuestionFlow
      questions={questions}
      student="meimei"
      subject="chinese"
      theme="green"
      pageTitle="🌱 妹妹的國語複習"
      homeHref="/meimei"
      homeLabel="返回妹妹首頁"
    />
  );
}
