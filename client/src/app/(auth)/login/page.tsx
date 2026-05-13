'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { BASE_URL } from '@/lib/config';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";


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
    window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[440px]"
    >
      <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#EB4C4C] via-[#FF7070] to-[#EB4C4C]" />
        
        <CardHeader className="space-y-2 text-center pt-10 pb-6">
          <div className="flex justify-center mb-4">
            <Link href="/" className="group">
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Hire<span className="text-[#EB4C4C]">IQ</span> BD</span>
                <span className="text-[10px] block text-gray-400">AI-Powered Jobs</span>
              </div>
            </Link>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Continue your journey with HireIQ BD
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 px-8 pb-10">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 text-center">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              {(['jobseeker', 'employer', 'admin'] as const).map((role) => (
                <button 
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  className="text-[10px] font-bold py-2 rounded-lg transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white dark:bg-gray-900 px-3 text-gray-500 dark:text-gray-400">Or Secure Login</span></div>
          </div>

          {(localError || error) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold text-center"
            >
              {localError || error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                  <Mail size={18} />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#EB4C4C]/20 focus:border-[#EB4C4C] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</Label>
                <Link href="#" className="text-[11px] text-[#EB4C4C] hover:text-[#FF7070] font-bold transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                  <Lock size={18} />
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#EB4C4C]/20 focus:border-[#EB4C4C] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#EB4C4C] hover:bg-[#d43f3f] text-white font-bold rounded-xl shadow-lg shadow-[#EB4C4C]/20 hover:shadow-[#EB4C4C]/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">Processing...</span>
              ) : (
                <span className="flex items-center gap-2">Sign In <LogIn size={18} /></span>
              )}
            </Button>
          </form>

          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full h-12 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200" 
          >
            <FaGoogle size={18} className="text-red-500" />
            Continue with Google
          </Button>

          <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 pt-2">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#EB4C4C] hover:text-[#FF7070] font-bold">
              Sign up free
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}