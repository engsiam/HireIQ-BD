'use client';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col relative overflow-x-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-[#EB4C4C]/10 dark:bg-[#EB4C4C]/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-[10%] w-[50%] h-[50%] bg-violet-600/10 dark:bg-violet-600/10 rounded-full blur-[100px]"></div>
        
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#EB4C4C]/5 via-transparent to-transparent rounded-full blur-3xl opacity-30 dark:opacity-20"></div>
      </div>

      <Navbar />

      <main className="flex-1 relative z-10 flex items-center justify-center py-20 lg:py-32 px-4">
        {children}
      </main>

      <Footer />
    </div>
  );
}