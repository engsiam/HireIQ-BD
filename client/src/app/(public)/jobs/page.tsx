'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobCardWrapper } from '@/components/jobs/JobCardWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import axiosInstance from '@/lib/axiosInstance';
import { Job } from '@/types';
import { Search, X, Funnel, MapPin, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  'All Categories',
  'Technology',
  'Finance',
  'Marketing',
  'Healthcare',
  'Education',
  'Engineering',
  'Design',
  'Sales',
  'HR',
  'Legal',
  'Other',
];

const districts = ['All Districts', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

const jobTypes = ['All Types', 'FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'salary_high', label: 'Salary: High to Low' },
  { value: 'salary_low', label: 'Salary: Low to High' },
  { value: 'most_viewed', label: 'Most Viewed' },
];

function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salaryMin') || '');
  const [salaryMax, setSalaryMax] = useState(searchParams.get('salaryMax') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const debouncedSearch = useDebounce(search, 300);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category && category !== 'All Categories') params.set('category', category.toLowerCase());
      if (jobType && jobType !== 'All Types') params.set('jobType', jobType);
      if (district && district !== 'All Districts') params.set('district', district);
      if (salaryMin) params.set('salaryMin', salaryMin);
      if (salaryMax) params.set('salaryMax', salaryMax);
      if (sort) params.set('sort', sort);
      params.set('page', currentPage.toString());
      params.set('limit', '10');

      const response = await axiosInstance.get(`/jobs?${params.toString()}`);
      setJobs(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, category, jobType, district, salaryMin, salaryMax, sort, currentPage]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axiosInstance.get(`/jobs?search=${encodeURIComponent(debouncedSearch)}&limit=5`);
        const jobsData = response.data.data || [];
        const titles = jobsData.map((j: Job) => j.title);
        setSuggestions(titles.slice(0, 6));
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearch]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setJobType('');
    setDistrict('');
    setSalaryMin('');
    setSalaryMax('');
    setSort('newest');
    setCurrentPage(1);
  };

  const activeFiltersCount = [category, jobType, district, salaryMin, salaryMax].filter(Boolean).length;

  const jobTypeLabels: Record<string, string> = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    REMOTE: 'Remote',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
  };

  const FilterSection = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Job title, skills..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="h-11 pl-10 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
        <Select value={category} onValueChange={(val) => setCategory(val || '')}>
          <SelectTrigger className="h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat === 'All Categories' ? '' : cat.toLowerCase()} className="cursor-pointer">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Type</label>
        <Select value={jobType} onValueChange={(val) => setJobType(val || '')}>
          <SelectTrigger className="h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700">
            {jobTypes.map((type) => (
              <SelectItem key={type} value={type === 'All Types' ? '' : type} className="cursor-pointer">
                {type === 'All Types' ? type : jobTypeLabels[type] || type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
        <Select value={district} onValueChange={(val) => setDistrict(val || '')}>
          <SelectTrigger className="h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl">
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700">
            {districts.map((dist) => (
              <SelectItem key={dist} value={dist === 'All Districts' ? '' : dist} className="cursor-pointer">
                {dist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Salary Range */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Salary Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            className="h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl"
          />
          <Input
            placeholder="Max"
            type="number"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            className="h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button onClick={clearFilters} variant="outline" className="w-full h-11 border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
          <X className="w-4 h-4 mr-2" />
          Clear Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="py-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Find Your <span className="text-[#EB4C4C]">Dream Job</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Browse thousands of job opportunities in Bangladesh</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full h-12 border-gray-200 dark:border-gray-700 rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#EB4C4C] text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Funnel className="w-5 h-5 text-[#EB4C4C]" />
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h2>
              </div>
              <FilterSection />
            </div>
          </div>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 mb-4"
              >
                <FilterSection isMobile />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort & Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {loading ? 'Searching...' : `${jobs.length} jobs found`}
              </p>
              <Select value={sort} onValueChange={(val) => setSort(val || 'newest')}>
                <SelectTrigger className="w-full sm:w-48 h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Jobs List - Single Column */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#EB4C4C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-[#EB4C4C]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Jobs Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} className="bg-[#EB4C4C] hover:bg-[#FF7070] text-white">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <JobCardWrapper key={job.id} job={job} index={index} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-10 px-4 rounded-xl border-gray-200 dark:border-gray-700"
                >
                  Prev
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl ${currentPage === page ? 'bg-[#EB4C4C] text-white' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-10 px-4 rounded-xl border-gray-200 dark:border-gray-700"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="flex gap-6">
            <Skeleton className="w-72 h-96 rounded-2xl" />
            <div className="flex-1 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}