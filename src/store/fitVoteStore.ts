import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FitStats, FitVote } from '../data/sizeGuides';

interface FitVoteState {
  votes: Record<string, FitStats>;
  userVotes: Record<string, FitVote>;
  vote: (productId: string, vote: FitVote) => void;
  getStats: (productId: string) => FitStats;
  getUserVote: (productId: string) => FitVote | null;
}

const empty: FitStats = { small: 0, true: 0, large: 0 };

export const useFitVoteStore = create<FitVoteState>()(
  persist(
    (set, get) => ({
      votes: {},
      userVotes: {},

      vote: (productId, vote) => {
        const prevUser = get().userVotes[productId];
        const stats = { ...(get().votes[productId] ?? empty) };

        if (prevUser) {
          stats[prevUser] = Math.max(0, stats[prevUser] - 1);
        }
        stats[vote] = (stats[vote] ?? 0) + 1;

        set({
          votes: { ...get().votes, [productId]: stats },
          userVotes: { ...get().userVotes, [productId]: vote },
        });
      },

      getStats: (productId) => get().votes[productId] ?? empty,

      getUserVote: (productId) => get().userVotes[productId] ?? null,
    }),
    {
      name: 'noir-fit-votes-v1',
      partialize: (state) => ({
        votes: state.votes,
        userVotes: state.userVotes,
      }),
    }
  )
);
