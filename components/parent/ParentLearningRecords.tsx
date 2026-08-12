'use client';

import { useEffect, useMemo, useState } from 'react';
import { LearningRecordList } from '@/components/parent/LearningRecordList';
import {
  sortLearningRecords,
  toDisplayLearningRecord,
  type LearningRecordDisplay,
} from '@/lib/learning-record-display';
import { readLearningRecords, type LearningRecord, type StudentId } from '@/lib/learning-records';

type StudentSection = {
  id: StudentId;
  label: string;
  records: LearningRecordDisplay[];
};

function SummaryCard({ label, records }: { label: string; records: LearningRecordDisplay[] }) {
  const latestRecord = records[0];

  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="text-2xl font-bold text-gray-800">{label}摘要</h2>
      <p className="mt-4 text-gray-700">紀錄總數：{records.length}</p>
      <p className="mt-2 text-gray-700">
        最近一次完成：{latestRecord ? latestRecord.completedAt : '目前沒有完成紀錄'}
      </p>
    </article>
  );
}

export function ParentLearningRecords() {
  const [records, setRecords] = useState<LearningRecord[] | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRecords(readLearningRecords());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const sections = useMemo<StudentSection[]>(() => {
    const sortedRecords = sortLearningRecords(records ?? []);

    return [
      { id: 'jiejie', label: '姐姐', records: sortedRecords.filter((record) => record.student === 'jiejie').map(toDisplayLearningRecord) },
      { id: 'meimei', label: '妹妹', records: sortedRecords.filter((record) => record.student === 'meimei').map(toDisplayLearningRecord) },
    ];
  }, [records]);

  if (records === null) {
    return <p className="mt-8 text-center text-gray-600">正在讀取學習紀錄…</p>;
  }

  return (
    <>
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <SummaryCard key={section.id} label={section.label} records={section.records} />
        ))}
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        {sections.map((section) => (
          <article key={section.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">{section.label}學習紀錄</h2>
            <div className="mt-5">
              <LearningRecordList studentLabel={section.label} records={section.records} />
            </div>
          </article>
        ))}
      </section>
    </>
  );
}