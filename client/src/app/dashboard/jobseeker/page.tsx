'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/lib/axiosInstance';
import { useSavedJobsStore } from '@/store/useSavedJobsStore';
import { useUser } from '@/store/useAuthStore';
import {
  Briefcase, CheckCircle, XCircle, Clock,
  ArrowRight, MessageSquare, Search, Sparkles, Bookmark,
} from 'lucide-react';
import Link from 'next/link';

interface JobseekerStats {
  applicationsSent: number;
  shortlisted: number;
  rejected: number;
  hired: number;
}

const statCards = [
  { title: 'Applications Sent', key: 'applicationsSent', icon: Briefcase,    iconBg: 'bg-blue-500/10'  },
  { title: 'Shortlisted',       key: 'shortlisted',      icon: CheckCircle,  iconBg: 'bg-green-500/10' },
  { title: 'Rejected',          key: 'rejected',         icon: XCircle,      iconBg: 'bg-red-500/10'   },
  { title: 'Hired',             key: 'hired',            icon: Clock,        iconBg: 'bg-[#EB4C4C]/10' },
];

const quickActions = [
  { label: 'My Applications', icon: Briefcase,     href: '/dashboard/jobseeker/applications',  color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'      },
  { label: 'Saved Jobs',      icon: Bookmark,      href: '/dashboard/jobseeker/saved-jobs',    color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30'      },
  { label: 'AI CV Analyzer',  icon: Sparkles,      href: '/dashboard/jobseeker/ai-tools',      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'  },
  { label: 'AI Interview',    icon: MessageSquare, href: '/dashboard/jobseeker/ai-tools',      color: 'from-[#EB4C4C]/20 to-[#FF7070]/20 border-[#EB4C4C]/30'  },
];

const STATUS_STYLES: Record<string, string> = {
  SHORTLISTED: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20',
  REJECTED:    'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20',
  PENDING:     'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
};

export default function JobseekerDashboardPage() {
  const [stats, setStats] = useState<JobseekerStats>({ applicationsSent: 0, shortlisted: 0, rejected: 0, hired: 0 });
  const [loading, setLoading] = useState(true);
  const { savedJobs } = useSavedJobsStore();
  const user = useUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/stats/jobseeker');
        if (res.data.success) setStats(res.data.data);
      } catch {
        setStats({ applicationsSent: 15, shortlisted: 4, rejected: 6, hired: 1 });
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
            Welcome back, <span className="text-[#EB4C4C]">{user?.name?.split(' ')[0] || 'Job Seeker'}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Track your applications and find new opportunities.</p>
        </div>
        <Link href="/jobs">
          <Button className="bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] hover:from-[#FF7070] hover:to-[#EB4C4C] text-white font-semibold">
            <Search className="w-4 h-4 mr-2" />
            Browse Jobs
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
                  {loading ? '...' : stats[stat.key as keyof JobseekerStats]?.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Application Status */}
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

        {/* Application Status */}
        <Card className="bg-card border-border shadow-sm rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-4 pt-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EB4C4C]" />
              Application Status
            </CardTitle>
            <Link href="/dashboard/jobseeker/applications">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-7 text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {[
                { job: 'Software Engineer', company: 'Tech Corp',  status: 'SHORTLISTED', date: '2 days ago'  },
                { job: 'Product Manager',   company: 'Startup Inc', status: 'PENDING',     date: '5 days ago'  },
                { job: 'UX Designer',       company: 'Design Co',  status: 'REJECTED',    date: '1 week ago'  },
                { job: 'Data Analyst',      company: 'DataCo',     status: 'PENDING',     date: '1 week ago'  },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-muted rounded-xl border border-border hover:bg-muted/70 transition-colors">
                  <div>
                    <p className="font-semibold text-foreground text-sm leading-none">{app.job}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.company} · {app.date}</p>
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