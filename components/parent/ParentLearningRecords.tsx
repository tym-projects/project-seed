'use client';
import { useEffect, useMemo, useState } from 'react';
import { LearningRecordList } from '@/components/parent/LearningRecordList';
import { sortLearningRecords, toDisplayLearningRecord, type LearningRecordDisplay } from '@/lib/learning-record-display';
import { readLearningRecords, type LearningRecord, type StudentId } from '@/lib/learning-records';
import { createParentLearningSummary, type ParentLearningSummary } from '@/lib/parent-learning-summary';
import { questions as jiejieChineseQuestions } from '@/lib/questions/jiejie-chinese';
import { questions as meimeiChineseQuestions } from '@/lib/questions/meimei-chinese';
type StudentSection = { id: StudentId; label: string; records: LearningRecordDisplay[]; summary: ParentLearningSummary };
function PeriodCard({ label, summary }: { label: string; summary: ParentLearningSummary['today'] }) {
  const rate = summary.firstTryCorrectRate === null ? '尚無作答' : `${Math.round(summary.firstTryCorrectRate * 100)}%`;
  return <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"><h3 className="text-xl font-bold text-gray-800">{label}</h3><dl className="mt-3 space-y-2 text-gray-700"><div className="flex justify-between gap-4"><dt>完成作答</dt><dd>{summary.completedRecordCount} 次</dd></div><div className="flex justify-between gap-4"><dt>首次答對</dt><dd>{summary.firstTryCorrectCount} 次（{rate}）</dd></div><div className="flex justify-between gap-4"><dt>有 retry 的作答</dt><dd>{summary.retryRecordCount} 次</dd></div></dl></article>;
}
export function ParentLearningRecords() {
  const [records, setRecords] = useState<LearningRecord[] | null>(null);
  useEffect(() => { const id = window.setTimeout(() => setRecords(readLearningRecords()), 0); return () => window.clearTimeout(id); }, []);
  const sections = useMemo<StudentSection[]>(() => {
    const source = records ?? []; const sorted = sortLearningRecords(source);
    const make = (id: StudentId, label: string, questions: typeof jiejieChineseQuestions): StudentSection => ({ id, label, records: sorted.filter((record) => record.student === id).map(toDisplayLearningRecord), summary: createParentLearningSummary({ records: source, student: id, subject: 'chinese', questions, now: new Date(), timeZone: 'Asia/Taipei' }) });
    return [make('jiejie', '姐姐', jiejieChineseQuestions), make('meimei', '妹妹', meimeiChineseQuestions)];
  }, [records]);
  if (records === null) return <p className="mt-8 text-center text-gray-600">正在讀取學習摘要…</p>;
  return <section className="mt-8 grid gap-8 lg:grid-cols-2">{sections.map((section) => <article key={section.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"><h2 className="text-2xl font-bold text-gray-800">{section.label}的學習摘要</h2><section className="mt-5 rounded-xl bg-amber-50 p-4"><h3 className="text-lg font-bold text-amber-900">需要留意</h3>{section.summary.attentionItems.length === 0 ? <p className="mt-2 text-amber-800">目前沒有需要特別留意的項目。</p> : <ul className="mt-2 space-y-2 text-amber-900">{section.summary.attentionItems.map((item) => <li key={`${item.kind}:${item.unitId}`}>{item.kind === 'repeated-retry' ? `${item.label}：最近 7 天有 ${item.retryRecordCount} 次需要再次嘗試。` : `${item.label}：已到複習日，今天尚未完成。`}</li>)}</ul>}</section><div className="mt-5 grid gap-4 sm:grid-cols-2"><PeriodCard label="Today" summary={section.summary.today} /><PeriodCard label="最近 7 天" summary={section.summary.last7Days} /></div><dl className="mt-5 rounded-xl bg-gray-50 p-4 text-gray-700"><div className="flex justify-between gap-4"><dt>最近一次學習</dt><dd>{section.summary.latestLearningLocalDate ?? '尚無完成作答'}</dd></div><div className="mt-2 flex justify-between gap-4"><dt>待複習 learning units</dt><dd>{section.summary.dueLearningUnitCount}</dd></div></dl><div className="mt-5"><LearningRecordList studentLabel={section.label} records={section.records} /></div></article>)}</section>;
}
