import { ParentLearningRecords } from '@/components/parent/ParentLearningRecords';

export default function ParentPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl">孩子學習紀錄</h1>
          <p className="mt-4 text-lg text-gray-600">查看姐姐和妹妹已完成的國語練習。</p>
        </header>
        <ParentLearningRecords />
      </div>
    </main>
  );
}