'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import { toast } from 'sonner';
import { GOOGLE_AUTH_URL } from '@/lib/config';
import { useAuthStore } from '@/store/useAuthStore';

export const dynamic = 'force-dynamic';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['JOBSEEKER', 'EMPLOYER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, initialize } = useAuthStore();
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'JOBSEEKER',
    },
  });

  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setMounted(true);
    initialize();
  }, []);

  useEffect(() => {
    if (mounted && user) {
      router.replace('/dashboard');
    }
  }, [mounted, user, router]);

  const onSubmit = async (data: RegisterFormValues) => {
    setLocalError('');
    
    try {
      const success = await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (success) {
        toast.success('Registration successful! Please login.');
        window.location.href = '/login';
      } else {
        setLocalError(error || 'Registration failed');
        toast.error(error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('[Register] Failed:', error);
      const message = error.message || 'Registration failed';
      setLocalError(message);
      toast.error(message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[480px]"
    >
      <Card className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl overflow-hidden">
        <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#EB4C4C] via-[#FF7070] to-[#EB4C4C]" />
        <CardHeader className="space-y-2 text-center pt-10 pb-6">
          <div className="flex justify-center mb-4">
            <Link href="/" className="group">
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Hire<span className="text-[#EB4C4C]">IQ</span> BD</span>
                <span className="text-[10px] block text-gray-400">AI-Powered Jobs</span>
              </div>
            </Link>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Join thousands of job seekers and employers
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5 px-8 pb-10">
          {(localError || error) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold text-center"
            >
              {localError || error}
            </motion.div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                  <User size={18} />
                </div>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe"
                  {...form.register('name')}
                  className="h-12 pl-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#EB4C4C]/20 focus:border-[#EB4C4C] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-xs text-red-500 ml-1">{form.formState.errors.name.message}</p>
              )}
            </div>

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
                  {...form.register('email')}
                  className="h-12 pl-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#EB4C4C]/20 focus:border-[#EB4C4C] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 ml-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Password</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                  <Lock size={18} />
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  {...form.register('password')}
                  className="h-12 pl-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#EB4C4C]/20 focus:border-[#EB4C4C] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500 ml-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Confirm Password</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                  <Lock size={18} />
                </div>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  {...form.register('confirmPassword')}
                  className="h-12 pl-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#EB4C4C]/20 focus:border-[#EB4C4C] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500 ml-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">I am a</Label>
              <div className="relative">
                <Select 
                  onValueChange={(value) => form.setValue('role', value as 'JOBSEEKER' | 'EMPLOYER')}
                  defaultValue="JOBSEEKER"
                >
                  <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#EB4C4C]/20 focus:border-[#EB4C4C]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JOBSEEKER">Job Seeker</SelectItem>
                    <SelectItem value="EMPLOYER">Employer</SelectItem>
                  </SelectContent>
                </Select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <UserPlus size={18} />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#EB4C4C] hover:bg-[#d43f3f] text-white font-bold rounded-xl shadow-lg shadow-[#EB4C4C]/20 hover:shadow-[#EB4C4C]/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">Creating Account...</span>
              ) : (
                <span className="flex items-center gap-2">Create Account</span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white dark:bg-gray-900 px-3 text-gray-500 dark:text-gray-400">Or</span></div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full h-12 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200" 
          >
            <FaGoogle size={18} className="text-red-500" />
            Sign up with Google
          </Button>

          <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-[#EB4C4C] hover:text-[#FF7070] font-bold">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}