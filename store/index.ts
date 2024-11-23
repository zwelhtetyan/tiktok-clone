import { create, StateCreator } from 'zustand';
import { User } from '../types';
import { RefObject } from 'react';

// interfaces
interface ThemeSlice {
  theme: string;
  setTheme: (theme: string) => void;
}

interface UsersSlice {
  suggestedUsers: User[];
  setSuggestedUsers: (users: User[]) => void;
}

interface VideoSlice {
  currentVideo: {
    prevScroll: number;
    isPlaying: boolean;
    videoRef: RefObject<HTMLVideoElement> | null;
  };
  setCurrentVideo: (
    scrollTop: number,
    isPlaying: boolean,
    videoRef: RefObject<HTMLVideoElement> | null,
  ) => void;
}

// temporary manage client state to be sync
interface UserFollowSlide {
  followLoadingIds: string[];
  currentFollowedUserIds: string[];
  currentUnFollowedUserIds: string[];

  setFollowLoadingId: (id: string) => void;
  removeFollowLoadingId: (id: string) => void;

  setCurrentFollowedUserIds: (id: string) => void;
  removeCurrentFollowedUserIds: (id: string) => void;

  setCurrentUnFollowedUserIds: (id: string) => void;
  removeCurrentUnFollowedUserIds: (id: string) => void;
}

// slices
const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
  theme: '',
  setTheme: (theme: string) => set(() => ({ theme })),
});

const createUsersSlice: StateCreator<UsersSlice> = (set) => ({
  suggestedUsers: [],
  setSuggestedUsers: (users: User[]) => set(() => ({ suggestedUsers: users })),
});

const createUserFollowSlide: StateCreator<UserFollowSlide> = (set) => ({
  followLoadingIds: [],
  currentFollowedUserIds: [],
  currentUnFollowedUserIds: [],

  setFollowLoadingId: (id) =>
    set((prev) => ({ followLoadingIds: [...prev.followLoadingIds, id] })),
  removeFollowLoadingId: (id) =>
    set((prev) => ({
      followLoadingIds: prev.followLoadingIds.filter((_id) => _id !== id),
    })),
  setCurrentFollowedUserIds: (id) =>
    set((prev) => ({
      currentFollowedUserIds: [...prev.currentFollowedUserIds, id],
    })),
  removeCurrentFollowedUserIds: (id) =>
    set((prev) => ({
      currentFollowedUserIds: prev.currentFollowedUserIds.filter(
        (_id) => _id !== id,
      ),
    })),
  setCurrentUnFollowedUserIds: (id) =>
    set((prev) => ({
      currentUnFollowedUserIds: [...prev.currentUnFollowedUserIds, id],
    })),
  removeCurrentUnFollowedUserIds: (id) =>
    set((prev) => ({
      currentUnFollowedUserIds: prev.currentUnFollowedUserIds.filter(
        (_id) => _id !== id,
      ),
    })),
});

const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  currentVideo: { prevScroll: 0, isPlaying: false, videoRef: null },
  setCurrentVideo: (
    scrollTop: number,
    isPlaying: boolean,
    videoRef: RefObject<HTMLVideoElement> | null,
  ) =>
    set(() => ({
      currentVideo: { prevScroll: scrollTop, isPlaying, videoRef },
    })),
});

// store
const useStore = create<
  ThemeSlice & UsersSlice & VideoSlice & UserFollowSlide
>()((...a) => ({
  ...createThemeSlice(...a),
  ...createUsersSlice(...a),
  ...createUserFollowSlide(...a),
  ...createVideoSlice(...a),
}));

export default useStore;
