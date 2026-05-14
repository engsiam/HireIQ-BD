'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import FullScreenLoading from '@/components/shared/FullScreenLoading';

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isInitialized) {
      initialize();
    }
  }, [mounted, isInitialized, initialize]);

  if (!mounted || (mounted && !isInitialized)) {
    return <FullScreenLoading message="Loading" subMessage="Initializing..." />;
  }

  return <>{children}</>;
}