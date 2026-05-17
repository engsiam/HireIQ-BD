'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { Calendar, RefreshCw, Users, CheckCircle, Clock } from 'lucide-react';

interface Booking {
  id: string;
  user: { name: string; email: string };
  property?: { title: string };
  job?: { title: string };
  status: string;
  date: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/bookings/all');
      setBookings(response.data.data || []);
      setError(null);
    } catch {
      setError('Failed to fetch bookings');
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const mockBookings = [
    { id: '1', user: { name: 'John Doe', email: 'john@example.com' }, job: { title: 'Software Engineer' }, status: 'CONFIRMED', date: '2025-05-15' },
    { id: '2', user: { name: 'Jane Smith', email: 'jane@example.com' }, job: { title: 'Product Manager' }, status: 'PENDING', date: '2025-05-14' },
    { id: '3', user: { name: 'Mike Johnson', email: 'mike@example.com' }, job: { title: 'UX Designer' }, status: 'CONFIRMED', date: '2025-05-13' },
    { id: '4', user: { name: 'Sarah Wilson', email: 'sarah@example.com' }, job: { title: 'Data Analyst' }, status: 'CANCELLED', date: '2025-05-12' },
  ];

  const displayBookings = bookings.length > 0 ? bookings : mockBookings;

  const stats = [
    { title: 'Total Bookings', value: displayBookings.length, icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/10' },
    { title: 'Confirmed', value: displayBookings.filter(b => b.status === 'CONFIRMED').length, icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10 dark:bg-green-500/10' },
    { title: 'Pending', value: displayBookings.filter(b => b.status === 'PENDING').length, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10 dark:bg-yellow-500/10' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 dark:border-green-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 dark:border-yellow-500/30',
      CANCELLED: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 dark:border-red-500/30',
    };
    return <Badge className={styles[status] || ''}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground text-sm">Manage job bookings and appointments</p>
        </div>
        <Button variant="outline" onClick={fetchBookings} className="border-border text-foreground hover:bg-muted">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border rounded-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      {error ? (
        <Card className="bg-card border-border rounded-xl">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchBookings} variant="outline" className="border-border text-foreground hover:bg-muted">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted">
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Job</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  displayBookings.map((booking) => (
                    <TableRow key={booking.id} className="border-border hover:bg-muted">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{booking.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{booking.job?.title || '-'}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{booking.date || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}