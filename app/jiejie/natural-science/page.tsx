'use client';

import { ChineseQuestionFlow } from '@/components/question/ChineseQuestionFlow';
import { practiceQuestions } from '@/lib/questions/jiejie-natural-science';

export default function JieJieNaturalSciencePage() {
  return <ChineseQuestionFlow questions={practiceQuestions} student="jiejie" subject="natural_science" theme="pink" pageTitle="🌸 姐姐的自然練習" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
