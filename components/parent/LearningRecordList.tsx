import type { LearningRecordDisplay } from '@/lib/learning-record-display';

type LearningRecordListProps = {
  studentLabel: string;
  records: LearningRecordDisplay[];
};

export function LearningRecordList({ studentLabel, records }: LearningRecordListProps) {
  if (records.length === 0) {
    return <p className="rounded-xl bg-gray-50 px-5 py-4 text-gray-600">{studentLabel}目前還沒有學習紀錄。</p>;
  }

  return (
    <ol className="space-y-4">
      {records.map((record) => (
        <li key={record.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-lg font-bold text-gray-800">{record.questionText}</p>
          {record.questionText === '這題已不在目前題庫' && (
            <p className="mt-1 text-sm text-gray-500">題目 ID：{record.questionId}</p>
          )}
          <dl className="mt-4 space-y-2 text-gray-700">
            <div className="flex justify-between gap-4">
              <dt>作答狀態</dt>
              <dd className="font-bold">{record.status}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>作答次數</dt>
              <dd>{record.attempts} 次</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>完成時間</dt>
              <dd className="text-right">{record.completedAt}</dd>
            </div>
          </dl>
          {record.attempts > 1 && record.firstAnswerText !== null && record.finalAnswerText !== null && (
            <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <p>第一次答案：{record.firstAnswerText}</p>
              <p className="mt-1">最後答案：{record.finalAnswerText}</p>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}