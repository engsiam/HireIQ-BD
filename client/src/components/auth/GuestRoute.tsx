'use client';

import { useIsAuthenticated, useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface GuestRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function GuestRoute({ children, fallback }: GuestRouteProps) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isInitialized) return;
    
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [mounted, isInitialized, isAuthenticated, router]);

  if (!mounted || !isInitialized) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#EB4C4C]" />
        </div>
      )
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}