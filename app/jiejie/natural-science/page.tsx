'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { questions } from '@/lib/questions/jiejie-natural-science';

export default function JieJieNaturalSciencePage() {
  return <ChineseQuestionFlow questions={questions} student="jiejie" subject="natural_science" theme="pink" pageTitle="🌸 姐姐的自然練習" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
