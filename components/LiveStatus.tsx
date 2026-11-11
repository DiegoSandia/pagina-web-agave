'use client';

import { useOpenStatus } from '@/lib/useOpenStatus';
import type { BranchId } from '@/lib/hours';

export default function LiveStatus({ className = '', branch }: { className?: string; branch?: BranchId }) {
  const status = useOpenStatus(branch);
  const state = !status ? 'pending' : status.open ? (status.soon ? 'soon' : 'open') : 'closed';
  return (
    <span className={`live ${className}`} data-state={state} aria-live="polite">
      <span className="live-dot" aria-hidden="true" />
      <span>{status ? status.label : 'Abierto desde las 10 AM'}</span>
    </span>
  );
}
