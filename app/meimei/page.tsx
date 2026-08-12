export default function MeiMeiPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-50">
      <h1 className="text-5xl font-bold text-green-600">🌱 妹妹的學習</h1>
      <p className="mt-6 text-2xl text-gray-700">今天想學什麼呢？</p>
      <div className="mt-10 w-80 rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-xl font-bold">📚 選擇練習</h2>
        <ul className="mt-4 space-y-3">
          <li><a href="/meimei/chinese" className="hover:text-green-600 hover:underline">國語練習</a></li>
          <li><a href="/meimei/review" className="hover:text-green-600 hover:underline">今日複習</a></li>
          <li>英文練習</li>
          <li>數學練習</li>
        </ul>
      </div>
    </main>
  );
}
