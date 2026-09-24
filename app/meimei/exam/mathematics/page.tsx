import { FirstExamPracticePage } from '@/components/exam/FirstExamPracticePage';
import { questions } from '@/lib/questions/meimei-mathematics';
import { getFirstExamQuestions } from '@/lib/first-exam-practice';

export default function MeiMeiMathematicsExamPage() {
  return <FirstExamPracticePage questions={getFirstExamQuestions('meimei', 'mathematics', questions)} student="meimei" subject="mathematics" theme="green" pageTitle="🌱 妹妹的數學第一次月考練習" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
