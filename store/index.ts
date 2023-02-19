import { create, StateCreator } from 'zustand';
import { User, Video } from '../types';

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
  viewedVideoDetail: { prevScroll: number; videoRef: HTMLVideoElement | null };
  setViewedVideoDetail: (
    scrollTop: number,
    videoRef: HTMLVideoElement | null
  ) => void;
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

const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  viewedVideoDetail: { prevScroll: 0, videoRef: null },
  setViewedVideoDetail: (
    scrollTop: number,
    videoRef: HTMLVideoElement | null
  ) => set(() => ({ viewedVideoDetail: { prevScroll: scrollTop, videoRef } })),
});

// store
const useStore = create<ThemeSlice & UsersSlice & VideoSlice>()((...a) => ({
  ...createThemeSlice(...a),
  ...createUsersSlice(...a),
  ...createVideoSlice(...a),
}));

export default useStore;
