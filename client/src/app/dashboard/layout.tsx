'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/useAuthStore';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import FullScreenLoading from '@/components/shared/FullScreenLoading';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const { hydrate, logout } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
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
    router.push('/login');
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