'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, LogOut, LayoutDashboard, X, Bell, ChevronDown, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/useAuthStore';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { logout, hydrate } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    hydrate();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return <div className="h-20" />;

  const userRole = user?.role || 'JOBSEEKER';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/jobs', label: 'Find Jobs' },
    { href: '/ai-tools', label: 'AI Tools' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const getDashboardLink = () => {
    if (userRole === 'ADMIN') return '/dashboard/admin';
    if (userRole === 'EMPLOYER') return '/dashboard/employer';
    return '/dashboard/jobseeker';
  };

  const getDashboardTitle = () => {
    if (userRole === 'ADMIN') return 'Admin Dashboard';
    if (userRole === 'EMPLOYER') return 'Employer Dashboard';
    return 'My Dashboard';
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/95 dark:bg-[#0B1120]/95 shadow-lg backdrop-blur-xl border-b border-gray-200/20" : "bg-white/90 dark:bg-[#0B1120]/90"
    )}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">

            <span className="text-xl font-bold text-gray-900 dark:text-white">Hire<span className="text-[#EB4C4C]">IQ</span> BD</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href} className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  isActive ? "text-[#EB4C4C] bg-[#EB4C4C]/10" : "text-gray-600 dark:text-gray-300 hover:text-[#EB4C4C]"
                )}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
              <ThemeToggle />
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EB4C4C] rounded-full"></span>
                </button>

                {/* Simple User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-xl">
                    <Avatar className="w-9 h-9 border-2 border-[#EB4C4C]/30">
                      <AvatarImage src={user.avatar || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-[#EB4C4C] to-[#c43a3a] text-white text-sm font-bold">
                        {getInitials(user.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] pointer-events-none group-hover:pointer-events-auto">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button onClick={() => router.push(getDashboardLink())} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <LayoutDashboard size={16} className="text-[#EB4C4C]" />
                        {getDashboardTitle()}
                      </button>
                      <button onClick={() => router.push(`${getDashboardLink()}/profile`)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        My Profile
                      </button>
                      <hr className="my-2 border-gray-100 dark:border-gray-700" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#EB4C4C]">
                  Sign In
                </Link>
                <Link href="/register">
                  <Button className="px-6 py-2.5 text-sm font-bold bg-[#EB4C4C] hover:bg-[#d43e3e] text-white rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg">
              {mobileMenuOpen ? <X size={24} className="text-gray-900 dark:text-white" /> : <Menu size={24} className="text-gray-900 dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white dark:bg-[#0B1120] border-t">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                    isActive ? "text-[#EB4C4C] bg-[#EB4C4C]/10" : "text-gray-700 dark:text-gray-200"
                  )}>
                    {link.label}
                  </Link>
                );
              })}
              {!isAuthenticated && (
                <div className="pt-4 flex flex-col gap-3">
                  <Link href="/login" className="text-center px-4 py-3 rounded-xl border">Sign In</Link>
                  <Link href="/register" className="text-center px-4 py-3 rounded-xl bg-[#EB4C4C] text-white">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}