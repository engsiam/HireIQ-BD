import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  change?: string;
  index?: number;
}

export function OverviewCard({ title, value, icon: Icon, color = 'bg-primary', change, index = 0 }: OverviewCardProps) {
  const isPositiveChange = change?.startsWith('+');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group border-border bg-card shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white`}>
            <Icon size={18} />
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-4xl font-black tracking-tighter text-foreground mb-1">{value}</div>
          {change && (
            <div className="flex items-center gap-1 text-xs font-bold">
              {isPositiveChange ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={isPositiveChange ? 'text-green-500' : 'text-red-500'}>
                {change}
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}