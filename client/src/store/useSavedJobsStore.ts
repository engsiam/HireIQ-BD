import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedJobsStore {
  savedJobs: string[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  toggleSavedJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  removeSavedJob: (jobId: string) => void;
  clearSavedJobs: () => void;
}

export const useSavedJobsStore = create<SavedJobsStore>()(
  persist(
    (set, get) => ({
      savedJobs: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      toggleSavedJob: (jobId) =>
        set((state) => ({
          savedJobs: state.savedJobs.includes(jobId)
            ? state.savedJobs.filter((id) => id !== jobId)
            : [...state.savedJobs, jobId],
        })),
      isJobSaved: (jobId) => get().savedJobs.includes(jobId),
      removeSavedJob: (jobId) =>
        set((state) => ({
          savedJobs: state.savedJobs.filter((id) => id !== jobId),
        })),
      clearSavedJobs: () => set({ savedJobs: [] }),
    }),
    {
      name: 'hireiq-saved-jobs',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);