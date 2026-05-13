'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleDemoLogin = (role: 'jobseeker' | 'employer' | 'admin') => {
    const demoCredentials = {
      jobseeker: { email: 'user@hireiq.com', password: 'User@123' },
      employer: { email: 'employer@hireiq.com', password: 'Employer@123' },
      admin: { email: 'admin@hireiq.com', password: 'Admin@123' },
    };
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setLocalError(error || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || ''}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden mx-auto w-full max-w-7xl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#EB4C4C]/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#EB4C4C]/10 via-transparent to-transparent rounded-full blur-3xl"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* Glow effect behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#EB4C4C]/30 via-[#EB4C4C]/10 to-transparent rounded-full blur-[80px] pointer-events-none"></div>

      <Card className="w-full max-w-md relative z-10 bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30 rounded-3xl overflow-hidden">
        {/* Card top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#EB4C4C] via-[#FF7070] to-[#EB4C4C]"></div>
        
        <CardHeader className="space-y-1 text-center pb-4 pt-10 px-8">
          <div className="flex justify-center mb-6">
            <Link href="/" className="group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EB4C4C] to-[#FF7070] flex items-center justify-center shadow-xl shadow-[#EB4C4C]/40 group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
              </div>
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400 text-base">Sign in to continue your journey</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 px-8 pb-8">
          {/* Demo Login Buttons */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
            {(['jobseeker', 'employer', 'admin'] as const).map((role) => (
              <Button 
                key={role}
                variant="ghost" 
                size="sm"
                onClick={() => handleDemoLogin(role)}
                className="text-xs font-medium py-2.5 hover:bg-white/10 rounded-lg transition-all text-gray-300 hover:text-white"
              >
                {role === 'jobseeker' ? 'Job Seeker' : role === 'employer' ? 'Employer' : 'Admin'}
              </Button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-transparent px-3 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Error Message */}
          {(localError || error) && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {localError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">Email</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-[#EB4C4C]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-[#EB4C4C] focus:border-transparent focus:bg-white/10 transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300 ml-1">Password</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-[#EB4C4C]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-[#EB4C4C] focus:border-transparent focus:bg-white/10 transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#EB4C4C] focus:ring-[#EB4C4C] focus:ring-offset-0 accent-[#EB4C4C]" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-[#EB4C4C] hover:text-[#FF7070] font-medium transition-colors">Forgot password?</Link>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#EB4C4C] to-[#d43f3f] hover:from-[#FF7070] hover:to-[#EB4C4C] text-white font-semibold rounded-xl shadow-lg shadow-[#EB4C4C]/30 hover:shadow-[#EB4C4C]/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Google Login */}
          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full h-12 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 rounded-xl text-white transition-all" 
            type="button"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="white"/>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-gray-200">Continue with Google</span>
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#EB4C4C] hover:text-[#FF7070] font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}