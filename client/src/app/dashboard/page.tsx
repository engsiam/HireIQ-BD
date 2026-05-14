'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUser } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useUser();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    // Wait for initialization AND auth check
    if (!isInitialized) return;
    
    // Give a small delay to ensure cookies are processed
    const timer = setTimeout(() => {
      if (!isAuthenticated || !user) {
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
    }, 500);

    return () => clearTimeout(timer);
  }, [isInitialized, isAuthenticated, user, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB4C4C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#EB4C4C]" />
    </div>
  );
}