'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Search, TrendingUp, Users, Briefcase, Award, ArrowRight } from 'lucide-react';

interface Stats {
  totalJobs: number;
  totalUsers: number;
  totalApplications: number;
  totalHired: number;
}

const DISTRICTS = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Remote'];

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [stats, setStats] = useState<Stats>({ totalJobs: 0, totalUsers: 0, totalApplications: 0, totalHired: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/stats/overview');
        if (response.data.success) setStats(response.data.data);
      } catch {
        setStats({ totalJobs: 5000, totalUsers: 1200, totalApplications: 30000, totalHired: 2500 });
      }
    };
    fetchStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm);
    if (location) params.set('district', location);
    router.push(`/jobs?${params.toString()}`);
  };

  const statsData = [
    { icon: Briefcase, value: stats.totalJobs || '5000+', label: 'Active Jobs', color: 'text-[#EB4C4C]' },
    { icon: Users, value: stats.totalUsers || '1200+', label: 'Companies', color: 'text-blue-500' },
    { icon: TrendingUp, value: stats.totalHired || '2500+', label: 'Hired', color: 'text-green-500' },
    { icon: Award, value: '98%', label: 'Success Rate', color: 'text-purple-500' },
  ];

  const companies = ['Pathao', 'bKash', 'Daraz', 'Grameenphone', 'BRAC', 'Shohoz', 'Chaldal', 'ShajGoj'];

  return (
    <>
      {/* Hero Section - 65% height */}
      <section className="relative min-h-[65vh] flex items-center justify-center px-6 md:px-12 overflow-hidden pt-20 pb-16 bg-gradient-to-b from-white to-[#FFF5F5] dark:from-[#0B1120] dark:to-[#111827]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(235,76,76,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(235,76,76,0.1),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(0,0,0,0.03)_1px,transparent_0)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EB4C4C]/10 border border-[#EB4C4C]/20"
              >
                <Sparkles className="w-4 h-4 text-[#EB4C4C]" />
                <span className="text-sm font-semibold text-[#EB4C4C]">AI-Powered Job Matching</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white"
              >
                Find Your Dream Job in <span className="text-[#EB4C4C]">Bangladesh</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-xl"
              >
                Connect with top companies through our AI-driven platform. 
                40,000+ jobs waiting for you across all 64 districts.
              </motion.p>

              {/* Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSearch}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-2 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-2"
              >
                <div className="flex-1 flex items-center px-4 gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <Search className="text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Job title, skills, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full text-gray-900 dark:text-white placeholder-gray-400 py-4"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl md:w-48">
                  <MapPin className="text-gray-400 w-5 h-5" />
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full text-gray-900 dark:text-white py-4 cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="bg-[#EB4C4C] hover:bg-[#d43e3e] text-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-[#EB4C4C]/20 flex items-center justify-center gap-2"
                >
                  Search Jobs
                </button>
              </motion.form>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {statsData.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 dark:border-gray-700">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{stat.value}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square">
                {/* Floating Cards */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 w-64 bg-white dark:bg-[#1E293B] rounded-2xl p-5 shadow-2xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#EB4C4C]/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-[#EB4C4C]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Senior Developer</p>
                      <p className="text-xs text-gray-500">Pathao Ltd</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#EB4C4C] font-bold">৳ 80k-120k</span>
                    <span className="text-gray-400">Dhaka</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-20 left-5 w-56 bg-white dark:bg-[#1E293B] rounded-2xl p-5 shadow-2xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">98% Match</p>
                      <p className="text-xs text-gray-500">AI Score</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 -left-5 w-48 bg-gradient-to-br from-[#EB4C4C] to-[#c43a3a] rounded-2xl p-4 text-white shadow-2xl"
                >
                  <p className="text-3xl font-bold">40K+</p>
                  <p className="text-sm opacity-80">Jobs Available</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#EB4C4C]/5 blur-[120px] rounded-full" />
        <div className="absolute top-20 -left-32 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />
      </section>

      {/* Trusted By Section */}
      <section className="py-10 bg-[#FFF5F5] dark:bg-[#111827] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <p className="text-center text-xs font-bold uppercase mb-8 tracking-[0.3em] text-gray-500 dark:text-gray-400">
            Trusted by Bangladesh's Top Companies
          </p>
          <div className="flex flex-nowrap justify-evenly items-center gap-4 md:gap-8 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {companies.map((company, i) => (
              <motion.span 
                key={company}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-lg md:text-2xl font-bold text-[#94A3B8] hover:text-[#EB4C4C] transition-colors cursor-pointer whitespace-nowrap px-4"
              >
                {company}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}