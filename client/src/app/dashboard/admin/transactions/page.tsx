'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockTransactions = [
  { id: '1', user: 'John Doe', amount: 15000, type: 'PREMIUM', status: 'COMPLETED', date: '2025-05-10' },
  { id: '2', user: 'Jane Smith', amount: 8000, type: 'BASIC', status: 'COMPLETED', date: '2025-05-09' },
  { id: '3', user: 'Mike Johnson', amount: 25000, type: 'ENTERPRISE', status: 'PENDING', date: '2025-05-08' },
  { id: '4', user: 'Sarah Wilson', amount: 12000, type: 'PREMIUM', status: 'COMPLETED', date: '2025-05-07' },
  { id: '5', user: 'David Brown', amount: 5000, type: 'BASIC', status: 'FAILED', date: '2025-05-06' },
];

export default function AdminTransactionsPage() {
  const stats = [
    { title: 'Total Revenue', value: '৳4.2M', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { title: 'Success Rate', value: '94.2%', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Transactions', value: '1,247', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return <Badge className={styles[status] || ''}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-white/50 text-sm">Financial overview and transaction history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-white/50 text-xs">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions Table */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        <CardHeader className="border-b border-white/5 pb-3 px-4">
          <CardTitle className="text-base font-semibold text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-white/5">
                <TableHead className="text-white/60">User</TableHead>
                <TableHead className="text-white/60">Amount</TableHead>
                <TableHead className="text-white/60">Type</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{tx.user}</TableCell>
                  <TableCell className="text-white/70">৳{tx.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20 text-white/70">{tx.type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="text-white/70">{tx.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}