'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
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

    router.push(getDashboardPath());
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}