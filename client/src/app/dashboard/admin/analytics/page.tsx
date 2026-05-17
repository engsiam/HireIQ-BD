'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/lib/axiosInstance';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Send,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface Stats {
  totalJobs: number;
  totalUsers: number;
  totalApplications: number;
  totalHired: number;
  jobsByCategory: { category: string; count: number }[];
  applicationsByStatus: { status: string; count: number }[];
  monthlyData: { month: string; jobs: number; applications: number }[];
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/stats/overview');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: 'from-blue-500 to-cyan-400', bgColor: 'bg-blue-500/10', change: '+12%' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-green-500 to-emerald-400', bgColor: 'bg-green-500/10', change: '+8%' },
    { title: 'Applications', value: stats?.totalApplications || 0, icon: Send, color: 'from-purple-500 to-pink-400', bgColor: 'bg-purple-500/10', change: '+15%' },
    { title: 'Hired', value: stats?.totalHired || 0, icon: TrendingUp, color: 'from-[#EB4C4C] to-[#FF7070]', bgColor: 'bg-[#EB4C4C]/10', change: '+22%' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500',
      SHORTLISTED: 'bg-green-500',
      REJECTED: 'bg-red-500',
      HIRED: 'bg-purple-500',
      INTERVIEW: 'bg-blue-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">Deep insights into your platform performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-foreground/80" />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                  <ArrowUpRight size={12} />
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-muted-foreground text-xs">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{loading ? '...' : stat.value.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <BarChart3 size={18} />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : stats?.monthlyData ? (
              <div className="space-y-3">
                {stats.monthlyData.map((month, index) => {
                  const maxJobs = Math.max(...stats.monthlyData.map(m => m.jobs), 1);
                  const maxApps = Math.max(...stats.monthlyData.map(m => m.applications), 1);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{month.month}</span>
                        <span className="text-muted-foreground/60 text-xs">{month.jobs} jobs / {month.applications} apps</span>
                      </div>
                      <div className="flex gap-1 h-2">
                        <div 
                          className="bg-blue-500 rounded-full" 
                          style={{ width: `${(month.jobs / maxJobs) * 100}%` }}
                        />
                        <div 
                          className="bg-purple-500 rounded-full" 
                          style={{ width: `${(month.applications / maxApps) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">No data available</div>
            )}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-muted-foreground">Jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-muted-foreground">Applications</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs by Category */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Briefcase size={18} />
              Jobs by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : stats?.jobsByCategory && stats.jobsByCategory.length > 0 ? (
              <div className="space-y-3">
                {stats.jobsByCategory.map((cat, index) => {
                  const maxCount = Math.max(...stats.jobsByCategory.map(c => c.count), 1);
                  const percentage = (cat.count / maxCount) * 100;
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-cyan-500', 'bg-amber-500', 'bg-pink-500'];
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground/80">{cat.category}</span>
                        <span className="text-muted-foreground text-xs">{cat.count} jobs</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors[index % colors.length]} rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Send size={18} />
              Applications by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : stats?.applicationsByStatus && stats.applicationsByStatus.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {stats.applicationsByStatus.map((item, index) => {
                  const total = stats.applicationsByStatus.reduce((sum, s) => sum + s.count, 0);
                  const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  return (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                        <span className="text-sm text-foreground/80">{item.status}</span>
                      </div>
                      <p className="text-xl font-bold text-foreground">{item.count}</p>
                      <p className="text-xs text-muted-foreground">{percentage}% of total</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <TrendingUp size={18} />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="text-green-600 dark:text-green-400 font-bold">
                  {stats ? Math.round((stats.totalHired / (stats.totalApplications || 1)) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Avg. Applications per Job</span>
                <span className="text-foreground font-bold">
                  {stats && stats.totalJobs > 0 ? Math.round(stats.totalApplications / stats.totalJobs) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Active Jobs Rate</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {stats ? Math.round((stats.totalJobs / (stats.totalUsers || 1)) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}