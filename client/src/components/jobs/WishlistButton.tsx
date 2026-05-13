'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSavedJobsStore } from '@/store/useSavedJobsStore';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  jobId: string;
}

export default function WishlistButton({ jobId }: WishlistButtonProps) {
  const { savedJobs, toggleSavedJob } = useSavedJobsStore();
  const isSaved = savedJobs.includes(jobId);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSavedJob(jobId);
      }}
      className={cn(
        'w-9 h-9 rounded-full shrink-0 transition-all',
        isSaved 
          ? 'bg-primary/10 text-primary hover:bg-primary/20' 
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Heart 
        size={18} 
        className={cn('transition-all', isSaved && 'fill-primary')} 
      />
    </Button>
  );
}