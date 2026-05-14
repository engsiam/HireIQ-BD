'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUser } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const user = useUser();
  const [checking, setChecking] = useState(true);
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Only initialize once
    if (!isInitialized) {
      initialize().finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!checking && isInitialized) {
      // Double check after a short delay to ensure cookies are set
      const timer = setTimeout(() => {
        const stillAuthenticated = useAuthStore.getState().isAuthenticated;
        const stillUser = useAuthStore.getState().user;
        
        if (!stillAuthenticated || !stillUser) {
          router.replace('/login');
        } else {
          const getDashboardPath = () => {
            if (!stillUser) return '/dashboard/jobseeker';
            switch (stillUser.role) {
              case 'ADMIN': return '/dashboard/admin';
              case 'EMPLOYER': return '/dashboard/employer';
              default: return '/dashboard/jobseeker';
            }
          };
          router.replace(getDashboardPath());
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [checking, isInitialized, router]);

  if (checking || !isInitialized) {
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