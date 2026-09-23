import Link from 'next/link';

export function SiteHomeLink() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-slate-700 bg-slate-800 px-5 py-3 font-bold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
    >
      返回網站首頁
    </Link>
  );
}
