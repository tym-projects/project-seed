import { FirstExamPracticePage } from '@/components/exam/FirstExamPracticePage';
import { questions } from '@/lib/questions/jiejie-natural-science';
import { getFirstExamQuestions } from '@/lib/first-exam-practice';

export default function JieJieNaturalScienceExamPage() {
  return <FirstExamPracticePage questions={getFirstExamQuestions('jiejie', 'natural_science', questions)} student="jiejie" subject="natural_science" theme="pink" pageTitle="🌸 姐姐的自然第一次月考練習" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
