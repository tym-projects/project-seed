import { FirstExamPracticePage } from '@/components/exam/FirstExamPracticePage';
import { questions } from '@/lib/questions/meimei-social-studies';
import { getFirstExamQuestions } from '@/lib/first-exam-practice';

export default function MeiMeiSocialStudiesExamPage() {
  return <FirstExamPracticePage questions={getFirstExamQuestions('meimei', 'social_studies', questions)} student="meimei" subject="social_studies" theme="green" pageTitle="🌱 妹妹的社會第一次月考練習" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
