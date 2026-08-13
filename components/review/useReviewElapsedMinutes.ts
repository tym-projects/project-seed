'use client';

import { useEffect, useState } from 'react';
import { getElapsedReviewMinutes } from '@/lib/review-session-time';

export function useReviewElapsedMinutes(startedAt?: string) {
  const [elapsedMinutes, setElapsedMinutes] = useState(() => getElapsedReviewMinutes(startedAt ?? '', new Date()));

  useEffect(() => {
    if (!startedAt) {
      return;
    }

    const activeStartedAt = startedAt;

    let timeoutId: number | undefined;

    function updateElapsedMinutes() {
      const nextElapsedMinutes = getElapsedReviewMinutes(activeStartedAt, new Date());
      setElapsedMinutes((currentElapsedMinutes) => currentElapsedMinutes === nextElapsedMinutes ? currentElapsedMinutes : nextElapsedMinutes);
      timeoutId = window.setTimeout(updateElapsedMinutes, 60_000 - (Date.now() % 60_000));
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') updateElapsedMinutes();
    }

    updateElapsedMinutes();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startedAt]);

  return elapsedMinutes;
}
