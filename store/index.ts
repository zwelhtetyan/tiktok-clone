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
  isMute: boolean;
  isRestore: boolean;
  prevScroll: number;
  videoContainerRef: RefObject<HTMLElement> | null;
  currentVideo: {
    videoRef: RefObject<HTMLVideoElement> | null;
    isPlaying: boolean;
  };
  toggleMute: () => void;
  setIsMute: (muted: boolean) => void;
  setIsRestore: (isRestore: boolean) => void;
  setPrevScroll: (scrollHeight: number) => void;
  setVideoContainerRef: (ref: RefObject<HTMLElement> | null) => void;
  setCurrentVideo: (
    videoRef: RefObject<HTMLVideoElement> | null,
    isPlaying: boolean,
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
  isMute: true,
  isRestore: false,
  prevScroll: 0,
  videoContainerRef: null,
  currentVideo: { isPlaying: false, videoRef: null },
  toggleMute: () => set(({ isMute: _isMute }) => ({ isMute: !_isMute })),
  setIsMute: (muted) => set(() => ({ isMute: muted })),
  setIsRestore: (isRestore) => set(() => ({ isRestore })),
  setPrevScroll: (scrollHeight) => set(() => ({ prevScroll: scrollHeight })),
  setVideoContainerRef: (ref) => set(() => ({ videoContainerRef: ref })),
  setCurrentVideo: (videoRef, isPlaying) =>
    set(() => ({ currentVideo: { isPlaying, videoRef } })),
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
