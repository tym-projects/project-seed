import { FirstExamPracticePage } from '@/components/exam/FirstExamPracticePage';
import { questions } from '@/lib/questions/meimei-chinese';
import { getFirstExamQuestions } from '@/lib/first-exam-practice';

export default function MeiMeiChineseExamPage() {
  return <FirstExamPracticePage questions={getFirstExamQuestions('meimei', 'chinese', questions)} student="meimei" subject="chinese" theme="green" pageTitle="🌱 妹妹的國語第一次月考練習" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
