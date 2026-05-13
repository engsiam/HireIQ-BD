'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

  const onSubmit = (data: RegisterFormValues) => {
    console.log('Register:', data);
  };

return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[480px]"
    >
      <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#EB4C4C] via-[#FF7070] to-[#EB4C4C]" />
        
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="flex justify-center mb-4">
            <Link href="/" className="relative group">
              <div className="absolute inset-0 bg-[#EB4C4C]/20 blur-xl rounded-2xl group-hover:bg-[#EB4C4C]/30 transition-all"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EB4C4C] to-[#FF7070] flex items-center justify-center shadow-xl shadow-[#EB4C4C]/20 group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
              </div>
            </Link>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Join HireIQ BD to find your dream job or hire talent
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5 px-8 pb-10">
          <Button 
            variant="outline" 
            className="w-full h-11 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200" 
          >
            <FaGoogle size={18} className="text-red-500" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white dark:bg-gray-900 px-3 text-gray-500 dark:text-gray-400">Or Sign Up With Email</span></div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                    <User size={16} />
                  </div>
                  <Input 
                    id="name" 
                    placeholder="John Doe"
                    {...form.register('name')}
                    className="h-11 pl-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#EB4C4C]/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                {form.formState.errors.name && <p className="text-xs text-red-500 dark:text-red-400 ml-1 font-medium">{form.formState.errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Account Type</Label>
                <Select 
                  onValueChange={(val) => form.setValue('role', val as 'JOBSEEKER' | 'EMPLOYER')}
                  defaultValue={form.getValues('role')}
                >
                  <SelectTrigger className="h-11 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#EB4C4C]/20 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                    <SelectItem value="JOBSEEKER" className="text-gray-900 dark:text-white">Job Seeker</SelectItem>
                    <SelectItem value="EMPLOYER" className="text-gray-900 dark:text-white">Employer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</Label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                  <Mail size={16} />
                </div>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="name@example.com"
                  {...form.register('email')}
                  className="h-11 pl-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#EB4C4C]/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              {form.formState.errors.email && <p className="text-xs text-red-500 dark:text-red-400 ml-1 font-medium">{form.formState.errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Password</Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                    <Lock size={16} />
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    {...form.register('password')}
                    className="h-11 pl-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#EB4C4C]/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Confirm</Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#EB4C4C] transition-colors">
                    <Lock size={16} />
                  </div>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    placeholder="••••••••"
                    {...form.register('confirmPassword')}
                    className="h-11 pl-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#EB4C4C]/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
            {(form.formState.errors.password || form.formState.errors.confirmPassword) && (
              <p className="text-xs text-red-500 dark:text-red-400 ml-1 font-medium">
                {form.formState.errors.password?.message || form.formState.errors.confirmPassword?.message}
              </p>
            )}

            <Button type="submit" className="w-full h-11 bg-[#EB4C4C] hover:bg-[#d43f3f] text-white font-bold rounded-xl shadow-lg shadow-[#EB4C4C]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-2">
              <span className="flex items-center gap-2">Create Account <UserPlus size={16} /></span>
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
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