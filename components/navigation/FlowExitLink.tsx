'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

type FlowExitLinkProps = {
  href: string;
  label: string;
  shouldConfirm: boolean;
  className?: string;
};

export function FlowExitLink({ href, label, shouldConfirm, className }: FlowExitLinkProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isDialogOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    continueButtonRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsDialogOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      (previouslyFocused ?? trigger)?.focus();
    };
  }, [isDialogOpen]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldConfirm) {
      event.preventDefault();
      setIsDialogOpen(true);
    }
  }

  return (
    <>
      <Link
        ref={triggerRef}
        href={href}
        onClick={handleClick}
        className={`${className ?? ''} inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-slate-700 bg-slate-800 px-5 py-3 font-bold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300`}
      >
        {label}
      </Link>
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="flow-exit-dialog-title"
            className="w-full max-w-md rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-2xl"
          >
            <h2 id="flow-exit-dialog-title" className="text-2xl font-bold text-slate-900">確定要返回首頁嗎？</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">目前這題尚未完成，離開後不會保留這題的作答進度。</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                ref={continueButtonRef}
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="min-h-12 rounded-xl border-2 border-slate-700 bg-white px-5 py-3 font-bold text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              >
                繼續作答
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  router.push(href);
                }}
                className="min-h-12 rounded-xl border-2 border-slate-900 bg-slate-900 px-5 py-3 font-bold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              >
                確認返回首頁
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
