import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types';

const getInitialTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

const initialState: UIState = {
  theme: getInitialTheme(),
  sidebarOpen: window.innerWidth >= 1024, // Open by default on larger screens
  currentView: 'dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
  },
});

export const { toggleTheme, toggleSidebar, setCurrentView } = uiSlice.actions;
export default uiSlice.reducer;