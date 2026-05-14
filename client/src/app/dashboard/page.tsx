'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const { initialize } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const getDashboardPath = () => {
      if (!user) return '/dashboard/jobseeker';
      switch (user.role) {
        case 'ADMIN':
          return '/dashboard/admin';
        case 'EMPLOYER':
          return '/dashboard/employer';
        case 'JOBSEEKER':
        default:
          return '/dashboard/jobseeker';
      }
    };

    router.replace(getDashboardPath());
  }, [isInitialized, isAuthenticated, user, router]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB4C4C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}