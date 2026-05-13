'use client';

import { Card, CardContent } from '@/components/ui/card';

interface DashboardPageWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function DashboardPageWrapper({ children, title, description }: DashboardPageWrapperProps) {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-white/50 text-sm mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function DashboardCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl ${className}`}>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}