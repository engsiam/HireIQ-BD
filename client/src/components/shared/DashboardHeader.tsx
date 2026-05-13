'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useThemeStore } from '@/stores/theme-store';
import {
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  ExternalLink,
  ChevronDown,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    image?: string;
  };
  onLogout: () => void;
}

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  ADMIN:     { label: 'Admin',      className: 'bg-[#EB4C4C]/15 text-[#EB4C4C]' },
  EMPLOYER:  { label: 'Employer',   className: 'bg-blue-500/15 text-blue-500 dark:text-blue-400' },
  JOBSEEKER: { label: 'Job Seeker', className: 'bg-green-500/15 text-green-600 dark:text-green-400' },
};

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const role = user?.role || 'JOBSEEKER';
  const badge = ROLE_BADGE[role] || ROLE_BADGE.JOBSEEKER;
  const avatarSrc = user?.image || user?.avatar || '';
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const getDashboardLink = () => {
    if (role === 'ADMIN')    return '/dashboard/admin';
    if (role === 'EMPLOYER') return '/dashboard/employer';
    return '/dashboard/jobseeker';
  };

  const getProfileLink = () => {
    if (role === 'ADMIN')    return '/dashboard/admin/settings';
    if (role === 'EMPLOYER') return '/dashboard/employer/profile';
    return '/dashboard/jobseeker/profile';
  };

  /* Resolve whether currently in dark mode */
  const isDark =
    typeof window !== 'undefined'
      ? theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      : true;

  /* Avatar element — reused in trigger + dropdown */
  const AvatarEl = ({ size }: { size: number }) => (
    <div
      style={{ width: size, height: size }}
      className="rounded-lg overflow-hidden flex-shrink-0 border border-border"
    >
      {avatarSrc ? (
        <Image src={avatarSrc} alt={user?.name || 'User'} width={size} height={size} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#EB4C4C] to-[#FF7070] flex items-center justify-center text-white font-black" style={{ fontSize: size * 0.35 }}>
          {initials}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-[100] flex items-center justify-between px-4 lg:px-6 h-14 border-b border-border bg-background/80 backdrop-blur-xl">

      {/* Left — spacer for mobile hamburger */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-10" />
      </div>

      {/* Center — flex-1 spacer on desktop */}
      <div className="hidden lg:flex flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground text-xs font-medium transition-all"
        >
          <ExternalLink size={13} />
          View Site
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-lg border border-border bg-card hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EB4C4C]" />
        </button>

        {/* Profile dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-2 h-9 rounded-xl border border-border bg-card hover:bg-accent transition-all cursor-pointer"
          >
            <AvatarEl size={28} />
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-xs font-semibold text-foreground">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-wide mt-0.5 px-1 rounded ${badge.className}`}>
                {badge.label}
              </span>
            </div>
            <ChevronDown
              size={12}
              className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <>
              <div className="fixed inset-0 z-[110]" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-60 z-[120] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">

                {/* User info */}
                <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                  <AvatarEl size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded mt-0.5 ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2 space-y-0.5">
                  <button
                    onClick={() => { setOpen(false); router.push(getDashboardLink()); }}
                    className="w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-all text-left"
                  >
                    <LayoutDashboard size={14} className="text-muted-foreground" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => { setOpen(false); router.push(getProfileLink()); }}
                    className="w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-all text-left"
                  >
                    <UserIcon size={14} className="text-muted-foreground" />
                    My Profile
                  </button>

                </div>

                {/* Logout */}
                <div className="p-2 border-t border-border space-y-0.5">
                  <button
                    onClick={() => { setOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all text-left"
                  >
                    <LogOut size={14} />
                    Log Out
                  </button>

                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex"
                  >
                    <ExternalLink size={12} className="mr-2.5" />
                    View Public Site
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}