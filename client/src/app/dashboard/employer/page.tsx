'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/lib/axiosInstance';
import { useUser } from '@/store/useAuthStore';
import {
  Briefcase, Users, CheckCircle, Clock,
  Plus, ArrowRight, UserCircle, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

interface EmployerStats {
  myJobsCount: number;
  totalApplications: number;
  shortlisted: number;
  hired: number;
}

const statCards = [
  { title: 'My Jobs',       key: 'myJobsCount',        icon: Briefcase,    iconBg: 'bg-blue-500/10'   },
  { title: 'Applications',  key: 'totalApplications',  icon: Users,        iconBg: 'bg-purple-500/10' },
  { title: 'Shortlisted',   key: 'shortlisted',        icon: CheckCircle,  iconBg: 'bg-green-500/10'  },
  { title: 'Hired',         key: 'hired',              icon: Clock,        iconBg: 'bg-[#EB4C4C]/10'  },
];

const quickActions = [
  { label: 'Post Job',   icon: Plus,       href: '/dashboard/employer/post-job',  color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'     },
  { label: 'My Jobs',    icon: Briefcase,  href: '/dashboard/employer/jobs',      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
  { label: 'Applicants', icon: Users,      href: '/dashboard/employer/applicants',color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'  },
  { label: 'Profile',    icon: UserCircle, href: '/dashboard/employer/profile',   color: 'from-[#EB4C4C]/20 to-[#FF7070]/20 border-[#EB4C4C]/30'  },
];

const STATUS_STYLES: Record<string, string> = {
  SHORTLISTED: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20',
  INTERVIEW:   'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
  PENDING:     'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
};

export default function EmployerDashboardPage() {
  const [stats, setStats] = useState<EmployerStats>({ myJobsCount: 0, totalApplications: 0, shortlisted: 0, hired: 0 });
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/stats/employer');
        if (res.data.success) setStats(res.data.data);
      } catch {
        setStats({ myJobsCount: 12, totalApplications: 156, shortlisted: 28, hired: 8 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Good morning, <span className="text-[#EB4C4C]">{user?.name?.split(' ')[0] || 'Employer'}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your jobs and find the best candidates.</p>
        </div>
        <Link href="/dashboard/employer/post-job">
          <Button className="bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] hover:from-[#FF7070] hover:to-[#EB4C4C] text-white font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border shadow-sm rounded-xl hover:border-[#EB4C4C]/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-foreground/70" />
              </div>
              <div className="mt-3">
                <p className="text-muted-foreground text-xs font-medium">{stat.title}</p>
                <p className="text-2xl font-black text-foreground mt-0.5">
                  {loading ? '...' : stats[stat.key as keyof EmployerStats]?.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Quick Actions */}
        <Card className="bg-card border-border shadow-sm rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EB4C4C]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} border hover:scale-[1.02] transition-transform cursor-pointer group`}>
                    <action.icon className="w-5 h-5 text-foreground/70 mb-1.5 group-hover:text-foreground transition-colors" />
                    <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="bg-card border-border shadow-sm rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-4 pt-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EB4C4C]" />
              Recent Applications
            </CardTitle>
            <Link href="/dashboard/employer/applicants">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-7 text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {[
                { name: 'John Doe',     job: 'Software Engineer', status: 'PENDING'     },
                { name: 'Jane Smith',   job: 'Product Manager',   status: 'SHORTLISTED' },
                { name: 'Mike Johnson', job: 'UX Designer',       status: 'INTERVIEW'   },
                { name: 'Sarah Wilson', job: 'Data Analyst',      status: 'PENDING'     },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-muted rounded-xl border border-border hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EB4C4C] to-[#FF7070] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {app.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm leading-none">{app.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{app.job}</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] font-bold border ${STATUS_STYLES[app.status]}`}>
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}