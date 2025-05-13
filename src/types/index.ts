// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// News article types
export interface Article {
  id: string;
  title: string;
  description: string;
  author: string;
  source: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content: string;
  type: 'news' | 'blog';
}

export interface NewsState {
  articles: Article[];
  filteredArticles: Article[];
  isLoading: boolean;
  error: string | null;
  filters: {
    author: string;
    startDate: string;
    endDate: string;
    type: string;
    searchQuery: string;
  };
}

// Payout types
export interface PayoutRate {
  type: 'news' | 'blog';
  rate: number;
}

export interface AuthorPayout {
  author: string;
  articles: number;
  totalPayout: number;
  breakdown: {
    news: number;
    blog: number;
  };
}

export interface PayoutState {
  rates: PayoutRate[];
  authorPayouts: AuthorPayout[];
  isLoading: boolean;
  error: string | null;
}

// UI state types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentView: string;
}