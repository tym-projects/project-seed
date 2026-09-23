import { getStudentSubjectNavigation } from '@/lib/navigation/subject-navigation';
import { SiteHomeLink } from '@/components/navigation/SiteHomeLink';

export default function MeiMeiPage() {
  const subjects = getStudentSubjectNavigation('meimei');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-50">
      <h1 className="text-5xl font-bold text-green-600">🌱 妹妹的學習</h1>
      <p className="mt-6 text-2xl text-gray-700">今天想學什麼呢？</p>
      <nav className="mt-6" aria-label="網站導覽">
        <SiteHomeLink />
      </nav>
      <div className="mt-10 w-80 rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-xl font-bold">📚 選擇練習</h2>
        <div className="mt-4 space-y-4">
          {subjects.map(({ subject, label, actions }) => (
            <section key={subject} className="rounded-xl border border-green-100 p-3">
              <h3 className="font-bold text-gray-800">{label}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <a href={actions.practice} className="rounded-lg border border-green-200 px-3 py-2 text-center hover:bg-green-50 hover:text-green-600">練習</a>
                <a href={actions.review} className="rounded-lg border border-green-200 px-3 py-2 text-center hover:bg-green-50 hover:text-green-600">今日複習</a>
                <a href={actions.reinforce} className="rounded-lg border border-green-200 px-3 py-2 text-center hover:bg-green-50 hover:text-green-600">再練一次</a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
