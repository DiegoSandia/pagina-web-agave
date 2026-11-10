'use client';

import { useEffect, useState } from 'react';
import { getStatus, type OpenStatus } from './hours';

// Null on the server and first paint: status depends on the visitor's clock.
export function useOpenStatus() {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const update = () => setStatus(getStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}
