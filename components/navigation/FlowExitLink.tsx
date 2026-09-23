'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';

type FlowExitLinkProps = {
  href: string;
  label: string;
  shouldConfirm: boolean;
  className?: string;
};

export function FlowExitLink({ href, label, shouldConfirm, className }: FlowExitLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldConfirm && !window.confirm('要離開目前練習嗎？未完成的作答不會保存。')) {
      event.preventDefault();
    }
  }

  return <Link href={href} onClick={handleClick} className={className}>{label}</Link>;
}
