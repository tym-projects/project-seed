'use client';

import { useRef, useState } from 'react';
import {
  createLearningRecordBackup,
  importLearningRecordBackup,
} from '@/lib/learning-record-backup';
import { readLearningRecords } from '@/lib/learning-records';

function fileStamp(date: Date) {
  return date.toISOString().replace(/[:.]/g, '-');
}

export function LearningRecordBackup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const exportBackup = () => {
    const backup = createLearningRecordBackup(readLearningRecords());
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `project-seed-learning-records-${fileStamp(new Date())}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(`備份成功：${backup.recordCount} 筆`);
  };

  const importBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const result = await importLearningRecordBackup(window.localStorage, await file.text());
      if (!result.ok) {
        setStatus(`匯入拒絕：${result.error}`);
        return;
      }
      setStatus(`匯入完成：新增 ${result.counts.added} 筆，既有 ${result.counts.existing} 筆，重複略過 ${result.counts.duplicates} 筆`);
    } catch {
      setStatus('匯入拒絕：檔案無法讀取');
    }
  };

  return (
    <section className="rounded-2xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100" aria-labelledby="learning-record-backup-title">
      <h2 id="learning-record-backup-title" className="text-xl font-bold text-emerald-950">學習紀錄備份</h2>
      <p className="mt-2 text-sm leading-6 text-emerald-900">可將目前學習紀錄下載成檔案，或匯入已驗證的備份。請使用一般瀏覽模式並妥善保存備份檔。</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={exportBackup} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white shadow-sm hover:bg-emerald-800">匯出備份</button>
        <label htmlFor="learning-record-backup-file" className="cursor-pointer rounded-xl border-2 border-emerald-700 bg-white px-5 py-3 font-bold text-emerald-900 hover:bg-emerald-100">
          匯入備份
          <input ref={inputRef} id="learning-record-backup-file" type="file" accept="application/json,.json" onChange={importBackup} className="sr-only" />
        </label>
      </div>
      {status && <p role="status" className="mt-3 text-sm font-semibold text-emerald-950">{status}</p>}
    </section>
  );
}
