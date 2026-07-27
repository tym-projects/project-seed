export default function HomePage() {
  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-16 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-lg sm:p-14">
        <h1 className="text-5xl font-bold tracking-tight text-emerald-700">
          🌱 Project Seed
        </h1>
        <p className="mt-4 text-3xl font-bold text-gray-800">AI 家教</p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          每天 10～15 分鐘，真正理解，而不是死背。
        </p>

        <nav className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="學習模式">
          <a
            href="/jiejie"
            className="rounded-2xl bg-pink-500 px-5 py-4 font-bold text-white transition-colors hover:bg-pink-600"
          >
            👧 姐姐
          </a>
          <a
            href="/meimei"
            className="rounded-2xl bg-green-600 px-5 py-4 font-bold text-white transition-colors hover:bg-green-700"
          >
            👧 妹妹
          </a>
          <a
            href="/parent"
            className="rounded-2xl bg-gray-600 px-5 py-4 font-bold text-white transition-colors hover:bg-gray-700"
          >
            👨 爸爸模式
          </a>
        </nav>
      </div>
    </main>
  );
}
