import { FirstExamPracticePage } from '@/components/exam/FirstExamPracticePage';
import { questions } from '@/lib/questions/jiejie-mathematics';
import { getFirstExamQuestions } from '@/lib/first-exam-practice';

export default function JieJieMathematicsExamPage() {
  return <FirstExamPracticePage questions={getFirstExamQuestions('jiejie', 'mathematics', questions)} student="jiejie" subject="mathematics" theme="pink" pageTitle="🌸 姐姐的數學第一次月考練習" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
