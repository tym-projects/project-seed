import { FirstExamPracticePage } from '@/components/exam/FirstExamPracticePage';
import { questions } from '@/lib/questions/meimei-natural-science';
import { getFirstExamQuestions } from '@/lib/first-exam-practice';

export default function MeiMeiNaturalScienceExamPage() {
  return <FirstExamPracticePage questions={getFirstExamQuestions('meimei', 'natural_science', questions)} student="meimei" subject="natural_science" theme="green" pageTitle="🌱 妹妹的自然第一次月考練習" homeHref="/meimei" homeLabel="返回妹妹首頁" />;
}
