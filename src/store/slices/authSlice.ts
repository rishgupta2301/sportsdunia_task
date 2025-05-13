import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';

const USERS_STORAGE_KEY = 'registeredUsers';

interface StoredUser extends User {
  password: string;
}

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]') as StoredUser[];
      
      // Check if user already exists
      if (existingUsers.some(user => user.email === email)) {
        return rejectWithValue('User with this email already exists');
      }

      const newUser: StoredUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'viewer',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        password // Store password for local auth
      };

      // Add new user to storage
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...existingUsers, newUser]));

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue('Signup failed. Please try again.');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Check for demo admin account
      if (email === 'admin@example.com' && password === 'password') {
        const adminUser: User = {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?u=admin',
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        return adminUser;
      }

      // Get registered users
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]') as StoredUser[];
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return rejectWithValue('Invalid credentials');
      }

      // Store user without password
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  return null;
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user) as User;
  }
  return null;
});

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;