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
import { Job, JobFilterParams, JobType } from '@/types';
import { Search, X, Funnel, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const districts = ['All Districts', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
const jobTypes = ['All Types', 'FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'salary_high', label: 'Salary: High to Low' },
  { value: 'most_viewed', label: 'Most Viewed' },
];

function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
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
      if (category) params.set('category', category);
      if (jobType) params.set('jobType', jobType);
      if (district) params.set('district', district);
      if (salaryMin) params.set('salaryMin', salaryMin);
      if (salaryMax) params.set('salaryMax', salaryMax);
      if (sort) params.set('sort', sort);
      params.set('page', currentPage.toString());
      params.set('limit', '12');

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
        const response = await axiosInstance.get(`/jobs?search=${encodeURIComponent(debouncedSearch)}&limit=5&fields=title`);
        const jobsData: Array<{title: string}> = response.data.data || [];
        const titles = jobsData.map(j => j.title);
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

  return (
    <div className="bg-background min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="space-y-4 mb-8">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Career Opportunities</span>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">
            Find Your <span className="text-primary italic">Dream Job</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-xl">
            Explore thousands of job opportunities from top companies in Bangladesh.
          </p>
        </div>

        <div className="bg-card p-3 rounded-2xl border border-border flex flex-col gap-3 relative">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
              <Input
                placeholder="Search job title, skills, or company..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="h-12 bg-secondary border-border rounded-xl pl-11 pr-10 text-foreground text-sm w-full"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSuggestions([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-1 md:flex-none">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 flex-1 md:flex-none px-4 rounded-xl border-border flex items-center justify-center gap-2 text-sm font-bold ${showFilters ? 'bg-primary text-white border-primary' : 'text-foreground'}`}
              >
                <Funnel size={16} />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center text-xs font-black">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              <Select value={sort} onValueChange={(val) => setSort(val || 'newest')}>
                <SelectTrigger className="h-12 px-4 rounded-xl border-border bg-card text-foreground text-sm font-bold w-full md:w-44">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-foreground focus:bg-primary/10 cursor-pointer h-12">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary/10 transition-colors"
                >
                  <Search size={16} className="text-primary shrink-0" />
                  <span className="text-foreground text-sm font-medium truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {(category || jobType || district || salaryMin || salaryMax) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
              {category && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setCategory('')}>
                  {category}
                  <X size={12} />
                </span>
              )}
              {jobType && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setJobType('')}>
                  {jobTypeLabels[jobType] || jobType}
                  <X size={12} />
                </span>
              )}
              {district && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setDistrict('')}>
                  <MapPin size={12} />
                  {district}
                  <X size={12} />
                </span>
              )}
              {salaryMin && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setSalaryMin('')}>
                  ৳{Number(salaryMin).toLocaleString()}+
                  <X size={12} />
                </span>
              )}
              {salaryMax && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setSalaryMax('')}>
                  ৳{Number(salaryMax).toLocaleString()}
                  <X size={12} />
                </span>
              )}
              <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground text-xs font-bold hover:text-foreground h-auto py-1 px-2">
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 mb-8">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-7xl mx-4 mb-8"
            >
              <div className="bg-card p-5 rounded-2xl border border-border grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1">Category</label>
                  <Select value={category} onValueChange={(val: string | null) => setCategory(val || '')}>
                    <SelectTrigger className="h-12 bg-secondary border-border rounded-xl text-foreground text-sm">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="" className="text-foreground focus:bg-primary/10">All Categories</SelectItem>
                      {['Technology', 'Finance', 'Healthcare', 'Marketing', 'Education', 'Engineering'].map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()} className="text-foreground focus:bg-primary/10">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1">Job Type</label>
                  <Select value={jobType} onValueChange={(val: string | null) => setJobType(val || '')}>
                    <SelectTrigger className="h-12 bg-secondary border-border rounded-xl text-foreground text-sm">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="" className="text-foreground focus:bg-primary/10">All Types</SelectItem>
                      {jobTypes.slice(1).map((t) => (
                        <SelectItem key={t} value={t} className="text-foreground focus:bg-primary/10">{jobTypeLabels[t] || t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1">Min Salary</label>
                  <Input
                    placeholder="Min (BDT)"
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="h-12 bg-secondary border-border rounded-xl text-foreground px-4 font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1">Max Salary</label>
                  <Input
                    placeholder="Max (BDT)"
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="h-12 bg-secondary border-border rounded-xl text-foreground px-4 font-bold text-sm"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl bg-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <JobCardWrapper key={job.id} job={job} index={index} />
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-32 space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Search size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-foreground">No Jobs Found</h3>
                  <p className="text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
                </div>
                <Button onClick={clearFilters} className="bg-primary text-white font-black px-10 h-14 rounded-2xl">
                  Clear All Filters
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-10 px-4 rounded-xl border-border text-foreground hover:bg-muted disabled:opacity-30 text-sm font-bold"
                >
                  Prev
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm ${currentPage === page ? 'bg-primary text-white' : 'border-border text-foreground hover:bg-muted'}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-10 px-4 rounded-xl border-border text-foreground hover:bg-muted disabled:opacity-30 text-sm font-bold"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-8 bg-card" />
          <Skeleton className="h-20 w-full mb-12 rounded-2xl bg-card" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-[280px] rounded-2xl bg-card" />
            ))}
          </div>
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}