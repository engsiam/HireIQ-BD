export const dynamic = 'force-dynamic';

import HeroSection from '@/components/home/HeroSection';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import CategoriesSection from '@/components/home/CategoriesSection';
import HowItWorks from '@/components/home/HowItWorks';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import NewsletterSection from '@/components/home/NewsletterSection';
import AIFeaturesSection from '@/components/home/AIFeaturesSection';

export default function HomePage() {
  return (
    <>
      {/* 1. HeroSection - bg-white dark:bg-[#0B1120] */}
      <HeroSection />
      
      {/* 2. FeaturedJobs - bg-[#FFF5F5] dark:bg-[#111827] */}
      <FeaturedJobs />
      
      {/* 3. CategoriesSection - bg-white dark:bg-[#0B1120] */}
      <CategoriesSection />
      
      {/* 4. HowItWorks - bg-[#FFF5F5] dark:bg-[#111827] */}
      <HowItWorks />
      
      {/* 5. StatsSection - bg-[#EB4C4C] text-white */}
      <StatsSection />
      
      {/* 6. AIFeaturesSection - bg-white dark:bg-[#0B1120] */}
      <AIFeaturesSection />
      
      {/* 7. TestimonialsSection - bg-[#FFF5F5] dark:bg-[#111827] */}
      <TestimonialsSection />
      
      {/* 8. BlogPreview - bg-white dark:bg-[#0B1120] */}
      <BlogPreview />
      
      {/* 9. FAQSection - bg-[#FFF5F5] dark:bg-[#111827] */}
      <FAQSection />
      
      {/* 10. CTASection - bg-[#EB4C4C] text-white */}
      <CTASection />
      
      {/* 11. NewsletterSection - bg-[#FFEDC7] dark:bg-[#111827] */}
      <NewsletterSection />
    </>
  );
}