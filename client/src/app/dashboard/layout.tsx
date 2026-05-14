'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/useAuthStore';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const { initialize, logout } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (!isInitialized) return;
    
    // Small delay to ensure cookies are processed after Google auth redirect
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB4C4C]" />
      </div>
    );
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

  const currentPath = pathname.split('/')[2];
  const expectedPath = getDashboardPath().split('/')[2];

  if (currentPath && currentPath !== expectedPath && !pathname.includes('/dashboard/admin') && !pathname.includes('/dashboard/employer') && !pathname.includes('/dashboard/jobseeker')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB4C4C]" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar role={user?.role || 'JOBSEEKER'} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user!} onLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-5">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}