'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Search, TrendingUp, Users, Briefcase, Award, ChevronDown, X } from 'lucide-react';

interface Stats {
  totalJobs: number;
  totalUsers: number;
  totalApplications: number;
  totalHired: number;
}

interface Suggestion {
  id: string;
  title: string;
  companyName?: string;
  location?: string;
  district?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: string;
}

const DISTRICTS = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Remote'];

const SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
];

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  REMOTE: 'Remote',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return '';
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
  if (min && max) return `$${fmt(min)} - $${fmt(max)}`;
  return min ? `From $${fmt(min)}` : `Up to $${fmt(max!)}`;
};

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [stats, setStats] = useState<Stats>({ totalJobs: 0, totalUsers: 0, totalApplications: 0, totalHired: 0 });
  const [current, setCurrent] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [locationOpen, setLocationOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/jobs?searchTerm=${encodeURIComponent(searchTerm)}&limit=5`);
        if (res.data.success) {
          setSuggestions(res.data.data || []);
          setShowDropdown(true);
          setSelectedIndex(-1);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm);
    if (location) params.set('district', location);
    setShowDropdown(false);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleSelect = (job: Suggestion) => {
    setShowDropdown(false);
    setSearchTerm('');
    router.push(`/jobs/${job.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const statsData = [
    { icon: Briefcase, value: stats.totalJobs || '5000+', label: 'Active Jobs', color: 'text-[#EB4C4C]' },
    { icon: Users, value: stats.totalUsers || '1200+', label: 'Companies', color: 'text-blue-400' },
    { icon: TrendingUp, value: stats.totalHired || '2500+', label: 'Hired', color: 'text-green-400' },
    { icon: Award, value: '98%', label: 'Success Rate', color: 'text-purple-400' },
  ];

  const companies = ['Pathao', 'bKash', 'Daraz', 'Grameenphone', 'BRAC', 'Shohoz', 'Chaldal', 'ShajGoj'];

  return (
    <>
      <section className="relative min-h-[65vh] flex items-center">
        {/* Background Slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${SLIDE_IMAGES[current]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {SLIDE_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-[#EB4C4C] w-6'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full pt-24 pb-16">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30"
              >
                <Sparkles className="w-4 h-5 text-[#EB4C4C]" />
                <span className="text-sm font-semibold text-white">AI-Powered Job Matching</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white"
              >
                Find Your Dream Job in <span className="text-[#EB4C4C]">Bangladesh</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-white/80 max-w-xl"
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
                className="relative z-20"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/20 flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="flex items-center px-4 gap-3 bg-white/10 backdrop-blur-md rounded-xl">
                      <Search className="text-white/60 w-5 h-5 shrink-0" />
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Job title, skills, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 w-full text-white placeholder-white/50 py-4"
                      />
                      {searchTerm && (
                        <button type="button" onClick={() => { setSearchTerm(''); setSuggestions([]); setShowDropdown(false); }} className="text-white/40 hover:text-white/80 transition-colors">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative md:w-48">
                    <div
                      onClick={() => setLocationOpen(!locationOpen)}
                      className="flex items-center px-4 gap-3 bg-white/10 backdrop-blur-md rounded-xl h-full cursor-pointer select-none"
                    >
                      <MapPin className="text-white/60 w-5 h-5 shrink-0" />
                      <span className={`flex-1 text-sm py-4 ${location ? 'text-white' : 'text-white/50'}`}>
                        {location || 'All Locations'}
                      </span>
                      <ChevronDown size={14} className={`text-white/40 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {locationOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setLocationOpen(false)} />
                        <div className="absolute right-0 top-full mt-1 w-full z-50 bg-[#0F172A] rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => { setLocation(''); setLocationOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${!location ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                          >
                            All Locations
                          </button>
                          {DISTRICTS.map(d => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => { setLocation(d); setLocationOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${location === d ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-[#EB4C4C] hover:bg-[#d43e3e] text-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-[#EB4C4C]/20 flex items-center justify-center gap-2 shrink-0"
                  >
                    Search Jobs
                  </button>
                </div>

                {/* Live Search Dropdown — full form width */}
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#0F172A] rounded-xl shadow-2xl border border-white/10 overflow-hidden"
                  >
                    {loading ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">
                        <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-[#EB4C4C] rounded-full animate-spin" />
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div>
                        {suggestions.map((job, i) => (
                          <button
                            key={job.id}
                            type="button"
                            onClick={() => handleSelect(job)}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-white/5 last:border-0 transition-colors ${
                              i === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#EB4C4C]/15 flex items-center justify-center shrink-0">
                              <Briefcase size={16} className="text-[#EB4C4C]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{job.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {job.companyName && (
                                  <span className="text-xs text-gray-400 truncate">{job.companyName}</span>
                                )}
                                {job.district && (
                                  <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin size={10} />
                                    {job.district}
                                  </span>
                                )}
                              </div>
                            </div>
                            {formatSalary(job.salaryMin, job.salaryMax) && (
                              <span className="text-xs font-semibold text-[#EB4C4C] shrink-0">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                            )}
                          </button>
                        ))}
                        <button
                          type="submit"
                          onClick={handleSearch}
                          className="w-full text-center text-xs font-semibold text-gray-400 hover:text-white py-2.5 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          View all results →
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-5 text-center text-sm text-gray-500">
                        <Search size={18} className="mx-auto mb-1 text-gray-600" />
                        No jobs for &ldquo;{searchTerm}&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </motion.form>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {statsData.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm font-bold text-white">{stat.value}</span>
                    <span className="text-xs text-white/70">{stat.label}</span>
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
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-10 right-10 w-64 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#EB4C4C]/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-[#EB4C4C]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Senior Developer</p>
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
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-20 left-5 w-56 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">98% Match</p>
                      <p className="text-xs text-gray-500">AI Score</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-1/2 -left-5 w-48 bg-gradient-to-br from-[#EB4C4C] to-[#c43a3a] rounded-2xl p-4 text-white shadow-2xl"
                >
                  <p className="text-3xl font-bold">40K+</p>
                  <p className="text-sm opacity-80">Jobs Available</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
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
