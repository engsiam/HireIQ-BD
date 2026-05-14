'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, Bell, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore, useUser } from '@/store/useAuthStore';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const { logout, initialize } = useAuthStore();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isInitialized) {
      initialize();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return <div className="h-20" />;

  const userRole = user?.role || 'JOBSEEKER';

  const getDashboardTitle = () => {
    if (userRole === 'ADMIN') return 'Admin Dashboard';
    if (userRole === 'EMPLOYER') return 'Employer Dashboard';
    return 'My Dashboard';
  };

  const getDashboardLink = () => {
    if (userRole === 'ADMIN') return '/dashboard/admin';
    if (userRole === 'EMPLOYER') return '/dashboard/employer';
    return '/dashboard/jobseeker';
  };

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 overflow-visible",
      scrolled ? "bg-white/95 dark:bg-[#0B1120]/95 shadow-lg backdrop-blur-xl border-b border-gray-200/20" : "bg-white/90 dark:bg-[#0B1120]/90"
    )}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EB4C4C] to-[#FF7070] flex items-center justify-center shadow-lg shadow-[#EB4C4C]/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg">H</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#EB4C4C] transition-colors">Hire<span className="text-[#EB4C4C]">IQ</span> BD</span>
              <span className="text-[10px] block text-gray-400 -mt-1">AI-Powered Jobs</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#EB4C4C] transition-colors">Find Jobs</Link>
            <Link href="/companies" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#EB4C4C] transition-colors">Companies</Link>
            <Link href="/ai-tools" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#EB4C4C] transition-colors">AI Tools</Link>
            <Link href="/about" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#EB4C4C] transition-colors">About</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
              <ThemeToggle />
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EB4C4C] rounded-full"></span>
                </button>

                <div className="relative group">
                  <button className="flex cursor-pointer items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-[#1E293B]">
                    <Avatar className="h-9 w-9 border-2 border-[#EB4C4C]/30">
                      <AvatarImage src={user.avatar || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-[#EB4C4C] to-[#c43a3a] text-sm font-bold text-white">
                        {getInitials(user.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown size={14} className="text-gray-500 transition-transform duration-200 group-hover:rotate-180 dark:text-gray-400" />
                  </button>

                  <div className="absolute right-0 top-full h-3 w-full" />

                  <div className="absolute right-0 top-[calc(100%+10px)] z-[9999] w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white opacity-0 shadow-2xl invisible transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-gray-700 dark:bg-[#111827]">
                    <div className="border-b border-gray-100 p-4 dark:border-gray-700">
                      <p className="truncate font-bold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>

                    <div className="p-2">
                      <button onClick={() => router.push(getDashboardLink())} className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#1E293B]">
                        <LayoutDashboard size={16} className="text-[#EB4C4C]" />
                        {getDashboardTitle()}
                      </button>
                      <button onClick={() => router.push(`${getDashboardLink()}/profile`)} className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#1E293B]">
                        My Profile
                      </button>
                      <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                      <button onClick={handleLogout} className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#EB4C4C]">Sign In</Link>
                <Link href="/register">
                  <Button className="px-6 py-2.5 text-sm font-bold bg-[#EB4C4C] hover:bg-[#d43e3e] text-white rounded-xl">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t dark:border-gray-800 bg-white dark:bg-[#0B1120] px-6 py-4 space-y-4">
          <Link href="/jobs" className="block py-2 text-gray-700 dark:text-gray-200">Find Jobs</Link>
          <Link href="/companies" className="block py-2 text-gray-700 dark:text-gray-200">Companies</Link>
          <Link href="/ai-tools" className="block py-2 text-gray-700 dark:text-gray-200">AI Tools</Link>
          {user ? (
            <button onClick={handleLogout} className="block py-2 text-red-500 font-medium">Sign Out</button>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/login" className="text-center px-4 py-3 rounded-xl border">Sign In</Link>
              <Link href="/register" className="text-center px-4 py-3 rounded-xl bg-[#EB4C4C] text-white">Get Started</Link>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
}