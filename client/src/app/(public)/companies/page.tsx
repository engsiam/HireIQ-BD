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
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import axiosInstance from '@/lib/axiosInstance';
import { Company } from '@/types';
import { Search, X, Funnel, Building2, MapPin, Globe, Users, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const industries = [
  'All Industries',
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Media',
  'Consulting',
  'Real Estate',
  'Hospitality',
  'Other',
];

const companySizes = ['All Sizes', '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const districts = ['All Locations', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
];

function CompanyCard({ company, index }: { company: Company; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl hover:shadow-[#EB4C4C]/5 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#EB4C4C]/10 to-[#FF7070]/10 flex items-center justify-center overflow-hidden shrink-0">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[#EB4C4C] font-black text-xl">{company.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#EB4C4C] transition-colors truncate">
            {company.name}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
            {company.industry && (
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {company.industry}
              </span>
            )}
            {company.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {company.location}
              </span>
            )}
            {company.size && (
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {company.size} employees
              </span>
            )}
          </div>
        </div>
      </div>
      
      {company.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 line-clamp-2">
          {company.description}
        </p>
      )}
      
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-[#EB4C4C] hover:underline"
          >
            <Globe className="w-4 h-4" />
            Website
          </a>
        )}
        <a
          href={`/jobs?company=${company.id}`}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-[#EB4C4C] transition-colors"
        >
          <Briefcase className="w-4 h-4" />
          View Jobs
        </a>
      </div>
    </motion.div>
  );
}

function CompaniesContent() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [industry, setIndustry] = useState(searchParams.get('industry') || '');
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const debouncedSearch = useDebounce(search, 300);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (industry && industry !== 'All Industries') params.set('industry', industry.toLowerCase());
      if (size && size !== 'All Sizes') params.set('size', size);
      if (district && district !== 'All Locations') params.set('district', district);
      if (sort) params.set('sort', sort);
      params.set('page', currentPage.toString());
      params.set('limit', '12');

      const response = await axiosInstance.get(`/companies?${params.toString()}`);
      setCompanies(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch, industry, size, district, sort, currentPage]);

  const clearFilters = () => {
    setSearch('');
    setIndustry('');
    setSize('');
    setDistrict('');
    setSort('newest');
    setCurrentPage(1);
  };

  const activeFiltersCount = [industry, size, district].filter(Boolean).length;

  const FilterSection = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Industry</label>
        <Select value={industry} onValueChange={(val) => setIndustry(val || '')}>
          <SelectTrigger className="h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700">
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind === 'All Industries' ? '' : ind.toLowerCase()} className="cursor-pointer">
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Company Size</label>
        <Select value={size} onValueChange={(val) => setSize(val || '')}>
          <SelectTrigger className="h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl">
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700">
            {companySizes.map((s) => (
              <SelectItem key={s} value={s === 'All Sizes' ? '' : s} className="cursor-pointer">
                {s === 'All Sizes' ? s : `${s} employees`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
        <Select value={district} onValueChange={(val) => setDistrict(val || '')}>
          <SelectTrigger className="h-11 bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 rounded-xl">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700">
            {districts.map((dist) => (
              <SelectItem key={dist} value={dist === 'All Locations' ? '' : dist} className="cursor-pointer">
                {dist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
        <div className="py-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Discover Top <span className="text-[#EB4C4C]">Companies</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Explore leading companies hiring in Bangladesh</p>
        </div>

        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full h-12 border-gray-200 dark:border-gray-700 rounded-xl"
          >
            <Funnel className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#EB4C4C] text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Funnel className="w-5 h-5 text-[#EB4C4C]" />
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h2>
              </div>
              <FilterSection />
            </div>
          </div>

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

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {loading ? 'Searching...' : `${companies.length} companies found`}
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

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#EB4C4C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-[#EB4C4C]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Companies Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} className="bg-[#EB4C4C] hover:bg-[#FF7070] text-white">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.map((company, index) => (
                  <CompanyCard key={company.id} company={company} index={index} />
                ))}
              </div>
            )}

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

export default function CompaniesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="flex gap-6">
            <Skeleton className="w-72 h-96 rounded-2xl" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <CompaniesContent />
    </Suspense>
  );
}