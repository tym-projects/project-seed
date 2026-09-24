import { FirstExamPracticePage } from '@/components/exam/FirstExamPracticePage';
import { questions } from '@/lib/questions/jiejie-chinese';
import { getFirstExamQuestions } from '@/lib/first-exam-practice';

export default function JieJieChineseExamPage() {
  return <FirstExamPracticePage questions={getFirstExamQuestions('jiejie', 'chinese', questions)} student="jiejie" subject="chinese" theme="pink" pageTitle="🌸 姐姐的國語第一次月考練習" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
