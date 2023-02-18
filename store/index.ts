import { create, StateCreator } from 'zustand';
import { User } from '../types';

// interfaces
interface ThemeSlice {
  theme: string;
  setTheme(theme: string): void;
}

interface UsersSlice {
  suggestedUsers: User[];
  setSuggestedUsers: (users: User[]) => void;
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

// store
const useStore = create<ThemeSlice & UsersSlice>()((...a) => ({
  ...createThemeSlice(...a),
  ...createUsersSlice(...a),
}));

export default useStore;
