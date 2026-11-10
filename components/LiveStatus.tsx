'use client';

import { useOpenStatus } from '@/lib/useOpenStatus';

export default function LiveStatus({ className = '' }: { className?: string }) {
  const status = useOpenStatus();
  const state = !status ? 'pending' : status.open ? (status.soon ? 'soon' : 'open') : 'closed';
  return (
    <span className={`live ${className}`} data-state={state} aria-live="polite">
      <span className="live-dot" aria-hidden="true" />
      <span>{status ? status.label : 'Mié a dom · desde 8 AM'}</span>
    </span>
  );
}
