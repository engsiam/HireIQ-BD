'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/dashboard/UserTable';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '@/types';
import { toast } from 'sonner';
import { Users, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Pagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const data = response.data.data;
      const meta = response.data.meta;
      
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(meta?.totalPages || 1);
        setTotalItems(meta?.total || data.length);
      } else {
        setUsers([]);
        setTotalPages(1);
        setTotalItems(0);
      }
      setError(null);
    } catch {
      setError('Failed to synchronize user directory');
      toast.error('Directory synchronization failed');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditRole = async (id: string) => {
    const newRole = prompt('Assign new Privilege Level (ADMIN, AGENT, USER):')?.toUpperCase();
    if (!newRole || !['ADMIN', 'AGENT', 'USER'].includes(newRole)) {
      if (newRole) toast.error('Invalid role assignment');
      return;
    }

    try {
      await axiosInstance.patch(`/users/${id}`, { role: newRole });
      toast.success(`User elevated to ${newRole} status`);
      setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole as any } : u)));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authorization update failed');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    try {
      await axiosInstance.patch(`/users/${id}`, {
        isActive: !user.isActive
      });
      setUsers(users.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      ));
      toast.success(user.isActive ? 'Account restricted' : 'Account access restored');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Status modification failed');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4 p-8 bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-400 font-medium text-sm">{error}</p>
          <Button onClick={() => fetchUsers(currentPage)} variant="outline" className="border-white/10 text-white hover:bg-white/10">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Users</h1>
          <p className="text-white/50 text-sm mt-1">Manage user accounts and permissions</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-[0_0_280px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#EB4C4C] transition-colors" size={16} />
            <Input 
              placeholder="Search users..." 
              className="h-11 pl-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#EB4C4C] transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden p-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-10">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-primary/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                <Users size={24} className="lg:w-8 lg:h-8" />
              </div>
              <div>
                <h2 className="text-lg lg:text-2xl font-black text-white tracking-tight">Active Accounts</h2>
                <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold">
                  {loading ? 'Analyzing...' : `${totalItems} identities (Page ${currentPage} of ${totalPages})`}
                </p>
              </div>
            </div>
            
            {loading && (
              <div className="flex items-center gap-3 bg-white/5 px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-white/10">
                <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 text-primary animate-spin" />
                <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-white/60">Syncing</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <UserTable
              users={filteredUsers}
              loading={loading}
              onEditRole={handleEditRole}
              onDeactivate={handleToggleStatus}
            />
          </div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange}
            totalItems={totalItems}
            limit={ITEMS_PER_PAGE}
            showLimitSelector={false}
          />
        </div>
      </div>
    </div>
  );
}