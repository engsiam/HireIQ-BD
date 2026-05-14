'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/useDashboardStore';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Globe,
  PlusCircle,
  Bookmark,
  UserCircle,
  ChevronRight,
  X,
  Menu,
  TrendingUp,
  Search,
  BarChart3,
  Send,
} from 'lucide-react';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function DashboardSidebar({ role = 'JOBSEEKER', onLogout }: { role?: string; onLogout?: () => void }) {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useDashboardStore();

  const adminItems: SidebarItem[] = [
    { href: '/dashboard/admin',              label: 'Overview',     icon: <LayoutDashboard size={18} /> },
    { href: '/dashboard/admin/users',        label: 'All Users',    icon: <Users size={18} /> },
    { href: '/dashboard/admin/jobs',         label: 'Manage Jobs',  icon: <Briefcase size={18} /> },
    { href: '/dashboard/admin/applications', label: 'Applications', icon: <Send size={18} /> },
    { href: '/dashboard/admin/blogs',        label: 'Blog Manager', icon: <FileText size={18} /> },
    { href: '/dashboard/admin/messages',     label: 'Messages',     icon: <MessageSquare size={18} /> },
    { href: '/dashboard/admin/analytics',    label: 'Analytics',    icon: <BarChart3 size={18} /> },
    { href: '/dashboard/admin/settings',     label: 'Settings',     icon: <Settings size={18} /> },
  ];

  const employerItems: SidebarItem[] = [
    { href: '/dashboard/employer',             label: 'Overview',    icon: <LayoutDashboard size={18} /> },
    { href: '/dashboard/employer/jobs',        label: 'My Jobs',     icon: <Briefcase size={18} /> },
    { href: '/dashboard/employer/post-job',    label: 'Post Job',    icon: <PlusCircle size={18} /> },
    { href: '/dashboard/employer/applicants',  label: 'Applicants',  icon: <Users size={18} /> },
    { href: '/dashboard/employer/profile',     label: 'Profile',     icon: <UserCircle size={18} /> },
    { href: '/dashboard/employer/settings',    label: 'Settings',    icon: <Settings size={18} /> },
  ];

  const jobseekerItems: SidebarItem[] = [
    { href: '/dashboard/jobseeker',               label: 'Overview',     icon: <LayoutDashboard size={18} /> },
    { href: '/jobs',                              label: 'Browse Jobs',  icon: <Search size={18} /> },
    { href: '/dashboard/jobseeker/applications',  label: 'Applications', icon: <Send size={18} /> },
    { href: '/dashboard/jobseeker/saved-jobs',    label: 'Saved Jobs',   icon: <Bookmark size={18} /> },
    { href: '/dashboard/jobseeker/ai-tools',      label: 'AI Tools',     icon: <TrendingUp size={18} /> },
    { href: '/dashboard/jobseeker/profile',       label: 'Profile',      icon: <UserCircle size={18} /> },
  ];

  const items = role === 'ADMIN' ? adminItems : role === 'EMPLOYER' ? employerItems : jobseekerItems;

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  /* ── Logo block ── */
  const LogoBlock = ({ size = 'md' }: { size?: 'sm' | 'md' }) => (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="flex flex-col leading-none">
        <span className={`${size === 'sm' ? 'text-base' : 'text-lg'} font-bold tracking-tighter text-foreground`}>
          Hire<span className="text-[#EB4C4C]">IQ</span> BD
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">AI-Powered Jobs</span>
      </div>
    </Link>
  );

  /* ── Nav items (shared between desktop + mobile) ── */
  const SidebarNav = () => (
    <>
      <nav className="flex-1 py-2 overflow-y-auto px-3">
        <div className="mb-3 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            {role === 'ADMIN' ? 'Admin' : role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'} Panel
          </p>
        </div>

        <div className="space-y-0.5">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`flex items-center gap-3 h-10 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] text-white shadow-md shadow-[#EB4C4C]/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <div className={isActive ? 'text-white' : 'text-muted-foreground'}>
                    {item.icon}
                  </div>
                  <span className="tracking-tight text-sm font-medium">{item.label}</span>
                  {isActive && <ChevronRight size={13} className="ml-auto" />}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout + version */}
      <div className="p-3 border-t border-border mt-auto bg-muted/30">
        <button
          onClick={() => { onLogout?.(); setMobileMenuOpen(false); }}
          className="w-full flex items-center gap-3 h-10 px-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
        <div className="mt-2 flex items-center gap-2 text-muted-foreground/50 px-3">
          <Globe size={11} />
          <span className="text-[10px] font-medium uppercase tracking-widest">HireIQ v1.0</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-3 left-3 z-[110] w-9 h-9 bg-card border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all"
        aria-label="Toggle menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[260px] h-full bg-background border-r border-border flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <LogoBlock size="sm" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground w-8 h-8"
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col">
                <SidebarNav />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-background border-r border-border h-screen sticky top-0 flex-col z-50">
        <div className="px-4 py-3 border-b border-border">
          <LogoBlock />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <SidebarNav />
        </div>
      </aside>
    </>
  );
}