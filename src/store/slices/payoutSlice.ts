import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PayoutRate, AuthorPayout, PayoutState } from '../../types';
import { RootState } from '../store';

// Memoize the last calculation to prevent unnecessary recalculations
let lastCalculation = {
  articles: [] as any[],
  rates: [] as PayoutRate[],
  result: [] as AuthorPayout[]
};

export const initializePayoutRates = createAsyncThunk(
  'payout/initializeRates',
  async (_, { rejectWithValue }) => {
    try {
      const savedRates = localStorage.getItem('payoutRates');
      if (savedRates) {
        return JSON.parse(savedRates) as PayoutRate[];
      }
      
      const defaultRates: PayoutRate[] = [
        { type: 'news', rate: 50 },
        { type: 'blog', rate: 75 },
      ];
      
      localStorage.setItem('payoutRates', JSON.stringify(defaultRates));
      return defaultRates;
    } catch (error) {
      return rejectWithValue('Failed to initialize payout rates');
    }
  }
);

export const updatePayoutRate = createAsyncThunk(
  'payout/updateRate',
  async (payload: { type: 'news' | 'blog'; rate: number }, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const updatedRates = state.payout.rates.map((rate) =>
        rate.type === payload.type ? { ...rate, rate: payload.rate } : rate
      );
      
      localStorage.setItem('payoutRates', JSON.stringify(updatedRates));
      return updatedRates;
    } catch (error) {
      throw new Error('Failed to update payout rate');
    }
  }
);

export const calculateAuthorPayouts = createAsyncThunk(
  'payout/calculatePayouts',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { articles } = state.news;
    const { rates } = state.payout;
    
    // Check if calculation is necessary
    const articlesChanged = JSON.stringify(articles) !== JSON.stringify(lastCalculation.articles);
    const ratesChanged = JSON.stringify(rates) !== JSON.stringify(lastCalculation.rates);
    
    if (!articlesChanged && !ratesChanged) {
      return lastCalculation.result;
    }
    
    if (!articles.length || !rates.length) {
      lastCalculation = {
        articles: [],
        rates: [],
        result: []
      };
      return [];
    }
    
    const newsRate = rates.find((r) => r.type === 'news')?.rate || 0;
    const blogRate = rates.find((r) => r.type === 'blog')?.rate || 0;
    
    const authorArticles: Record<string, { news: number; blog: number }> = {};
    
    articles.forEach((article) => {
      if (!authorArticles[article.author]) {
        authorArticles[article.author] = { news: 0, blog: 0 };
      }
      
      if (article.type === 'news') {
        authorArticles[article.author].news += 1;
      } else if (article.type === 'blog') {
        authorArticles[article.author].blog += 1;
      }
    });
    
    const authorPayouts: AuthorPayout[] = Object.entries(authorArticles).map(([author, counts]) => ({
      author,
      articles: counts.news + counts.blog,
      totalPayout: (counts.news * newsRate) + (counts.blog * blogRate),
      breakdown: {
        news: counts.news,
        blog: counts.blog,
      },
    }));
    
    // Update memoization
    lastCalculation = {
      articles: [...articles],
      rates: [...rates],
      result: authorPayouts
    };
    
    return authorPayouts;
  }
);

const initialState: PayoutState = {
  rates: [],
  authorPayouts: [],
  isLoading: false,
  error: null,
};

const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    clearPayoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePayoutRates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializePayoutRates.fulfilled, (state, action: PayloadAction<PayoutRate[]>) => {
        state.isLoading = false;
        state.rates = action.payload;
        state.error = null;
      })
      .addCase(initializePayoutRates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePayoutRate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePayoutRate.fulfilled, (state, action: PayloadAction<PayoutRate[]>) => {
        state.isLoading = false;
        state.rates = action.payload;
        state.error = null;
      })
      .addCase(updatePayoutRate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Failed to update payout rate';
      })
      .addCase(calculateAuthorPayouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(calculateAuthorPayouts.fulfilled, (state, action: PayloadAction<AuthorPayout[]>) => {
        state.isLoading = false;
        state.authorPayouts = action.payload;
        state.error = null;
      })
      .addCase(calculateAuthorPayouts.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Failed to calculate payouts';
      });
  },
});

export const { clearPayoutError } = payoutSlice.actions;
export default payoutSlice.reducer;