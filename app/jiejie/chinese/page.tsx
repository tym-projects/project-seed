export default function JieJieChinesePage() {
  return (
    <main className="min-h-screen bg-pink-50 px-6 py-12 flex flex-col items-center justify-center">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <h1 className="text-4xl font-bold text-pink-600">👧 姐姐模式</h1>
        <h2 className="mt-3 text-3xl font-bold text-gray-800">📘 國語</h2>

        <div className="mt-8 border-t border-pink-100 pt-6 text-left text-gray-700">
          <p className="text-lg font-bold text-pink-600">第一題</p>
          <p className="mt-5 text-lg">請選出正確的注音。</p>
          <p className="mt-4 text-xl font-bold">香蕉 的「蕉」讀音是？</p>

          <ol className="mt-6 space-y-3 text-lg">
            <li>① ㄐㄧㄠ</li>
            <li>② ㄑㄧㄠ</li>
            <li>③ ㄒㄧㄠ</li>
          </ol>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <button type="button" className="rounded-xl bg-pink-500 px-4 py-3 font-bold text-white">
            🤔 我會
          </button>
          <button type="button" className="rounded-xl bg-pink-100 px-4 py-3 font-bold text-pink-700">
            😥 我不會
          </button>
        </div>
      </section>
    </main>
  );
}
