'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/lib/axiosInstance';
import { useUser } from '@/store/useAuthStore';
import {
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  ArrowUpRight,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  Send,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalJobs: number;
  totalUsers: number;
  totalApplications: number;
  hiredCount: number;
}

const statCards = [
  { title: 'Total Jobs',    key: 'totalJobs',         icon: Briefcase,  gradient: 'from-blue-500 to-cyan-400',        iconBg: 'bg-blue-500/10'      },
  { title: 'Total Users',   key: 'totalUsers',        icon: Users,      gradient: 'from-green-500 to-emerald-400',    iconBg: 'bg-green-500/10'     },
  { title: 'Applications',  key: 'totalApplications', icon: Building2,  gradient: 'from-purple-500 to-pink-400',      iconBg: 'bg-purple-500/10'    },
  { title: 'Hired',         key: 'hiredCount',        icon: TrendingUp, gradient: 'from-[#EB4C4C] to-[#FF7070]',     iconBg: 'bg-[#EB4C4C]/10'    },
];

const quickActions = [
  { label: 'Manage Users',  icon: Users,         href: '/dashboard/admin/users',        color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 dark:border-blue-500/30'       },
  { label: 'Manage Jobs',   icon: Briefcase,     href: '/dashboard/admin/jobs',         color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 dark:border-green-500/30' },
  { label: 'Applications',  icon: Building2,     href: '/dashboard/admin/applications', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 dark:border-purple-500/30' },
  { label: 'Messages',      icon: MessageSquare, href: '/dashboard/admin/messages',     color: 'from-[#EB4C4C]/20 to-[#FF7070]/20 border-[#EB4C4C]/30'                           },
];

const STATUS_STYLES: Record<string, string> = {
  SHORTLISTED: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20',
  INTERVIEW:   'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
  PENDING:     'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalJobs: 0, totalUsers: 0, totalApplications: 0, hiredCount: 0 });
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/stats/overview');
        if (res.data.success) setStats(res.data.data);
      } catch {
        setStats({ totalJobs: 500, totalUsers: 2500, totalApplications: 1200, hiredCount: 350 });
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
            Welcome back, <span className="text-[#EB4C4C]">{user?.name?.split(' ')[0] || 'Admin'}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your platform today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/analytics">
            <Button variant="outline" className="border-border">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Button className="bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] hover:from-[#FF7070] hover:to-[#EB4C4C] text-white font-semibold">
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border shadow-sm rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-foreground/70" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <p className="text-muted-foreground text-xs">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '...' : stats[stat.key as keyof Stats]?.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Quick Actions */}
        <Card className="bg-card border-border shadow-sm rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} border hover:scale-[1.02] transition-transform cursor-pointer`}>
                    <action.icon className="w-5 h-5 text-foreground/70 mb-1.5" />
                    <span className="text-xs font-semibold text-foreground/80">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="bg-card border-border shadow-sm rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-4 pt-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">Recent Applications</CardTitle>
            <Link href="/dashboard/admin/applications">
              <span className="text-xs text-[#EB4C4C] hover:underline font-medium">View all</span>
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {[
                { name: 'John Doe',     job: 'Software Engineer', status: 'PENDING'     },
                { name: 'Jane Smith',   job: 'Product Manager',   status: 'SHORTLISTED' },
                { name: 'Mike Johnson', job: 'UX Designer',       status: 'INTERVIEW'   },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-muted rounded-xl border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EB4C4C] to-[#FF7070] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
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