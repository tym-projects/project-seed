export default function MeiMeiPage() {
  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-green-600">👧 妹妹模式</h1>

      <p className="mt-6 text-2xl text-gray-700">今天一起加油！</p>

      <div className="mt-10 rounded-2xl bg-white shadow-lg p-8 w-80">
        <h2 className="text-xl font-bold">📚 今日任務</h2>

        <ul className="mt-4 space-y-3">
          <li>
            <a href="/meimei/chinese" className="hover:text-green-600 hover:underline">
              ✅ 國語複習
            </a>
          </li>
          <li>⬜ 數學複習</li>
          <li>⬜ 英文單字</li>
        </ul>
      </div>
    </main>
  );
}
