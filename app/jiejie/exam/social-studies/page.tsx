import { FirstExamPracticePage } from '@/components/exam/FirstExamPracticePage';
import { questions } from '@/lib/questions/jiejie-social-studies';
import { getFirstExamQuestions } from '@/lib/first-exam-practice';

export default function JieJieSocialStudiesExamPage() {
  return <FirstExamPracticePage questions={getFirstExamQuestions('jiejie', 'social_studies', questions)} student="jiejie" subject="social_studies" theme="pink" pageTitle="🌸 姐姐的社會第一次月考練習" homeHref="/jiejie" homeLabel="返回姐姐首頁" />;
}
