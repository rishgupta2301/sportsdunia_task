import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { NewsState, Article } from '../../types';

// Use a direct API key for now, but in a production environment
// this should be handled through environment variables and a backend proxy
const API_KEY = 'f22693e6c8014ea08e6eb02fe9eb85a9';
const API_URL = 'https://newsapi.org/v2/top-headlines';

// Added fallback data in case API fails
const fallbackArticles: Article[] = [
  {
    id: 'fallback-1',
    title: 'API Currently Unavailable',
    description: 'The news API might be experiencing issues. This is fallback content.',
    author: 'System',
    source: 'Local',
    url: '#',
    urlToImage: 'https://picsum.photos/id/30/600/400',
    publishedAt: new Date().toISOString(),
    content: 'Unable to fetch live news at the moment. Please try again later.',
    type: 'news',
  },
  // Add more fallback articles if desired
];

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (_, { rejectWithValue }) => {
    try {
      // Add timeout to prevent hanging requests
      const response = await axios.get(
        `${API_URL}?country=us&apiKey=${API_KEY}`,
        {
          headers: {
            'User-Agent': 'NewsAdmin/1.0',
            'Accept': 'application/json',
          },
          timeout: 10000 // 10 seconds timeout
        }
      );
      
      console.log('API Response Status:', response.status);
      
      // Check if the response contains articles
      if (!response.data?.articles || response.data.articles.length === 0) {
        console.warn('API returned no articles');
        return fallbackArticles;
      }
      
      // Transform the API response to match our Article type
      const articles: Article[] = response.data.articles.map((article: any, index: number) => ({
        id: `article-${index + 1}`,
        title: article.title || 'Untitled',
        description: article.description || 'No description available',
        author: article.author || 'Unknown Author',
        source: article.source?.name || 'Unknown Source',
        url: article.url || '#',
        urlToImage: article.urlToImage || `https://picsum.photos/id/${30 + index}/600/400`,
        publishedAt: article.publishedAt || new Date().toISOString(),
        content: article.content || 'No content available',
        type: Math.random() > 0.3 ? 'news' : 'blog', // Randomly assign type since API doesn't provide this
      }));
      
      return articles;
    } catch (error) {
      console.error('News API Error:', error);
      
      if (axios.isAxiosError(error)) {
        // Check for specific error conditions
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('API Error Response:', error.response.data);
          console.error('Status Code:', error.response.status);
          
          // Handle rate limiting
          if (error.response.status === 429) {
            return rejectWithValue('API rate limit exceeded. Please try again later.');
          }
          
          // Handle API key issues
          if (error.response.status === 401) {
            return rejectWithValue('API authentication failed. Please check your API key.');
          }
          
          return rejectWithValue(error.response.data?.message || `Error ${error.response.status}: Failed to fetch news`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          return rejectWithValue('No response from news server. Please check your connection.');
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
          return rejectWithValue(`Request setup error: ${error.message}`);
        }
      }
      
      // Try to use fallback articles instead of failing completely
      console.warn('Using fallback news articles');
      return fallbackArticles;
    }
  }
);

const initialState: NewsState = {
  articles: [],
  filteredArticles: [],
  isLoading: false,
  error: null,
  filters: {
    author: '',
    startDate: '',
    endDate: '',
    type: '',
    searchQuery: '',
  },
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: string; value: string }>) => {
      const { key, value } = action.payload;
      state.filters = {
        ...state.filters,
        [key]: value,
      };
      
      // Apply filters
      state.filteredArticles = state.articles.filter((article) => {
        const authorMatch = !state.filters.author || article.author.toLowerCase().includes(state.filters.author.toLowerCase());
        const typeMatch = !state.filters.type || article.type === state.filters.type;
        
        // Safely handle date parsing
        let startDateMatch = true;
        let endDateMatch = true;
        
        if (state.filters.startDate) {
          try {
            const articleDate = new Date(article.publishedAt);
            const startDate = new Date(state.filters.startDate);
            startDateMatch = articleDate >= startDate;
          } catch (e) {
            console.error('Date parsing error:', e);
          }
        }
        
        if (state.filters.endDate) {
          try {
            const articleDate = new Date(article.publishedAt);
            const endDate = new Date(state.filters.endDate);
            endDateMatch = articleDate <= endDate;
          } catch (e) {
            console.error('Date parsing error:', e);
          }
        }
        
        const searchMatch = !state.filters.searchQuery || 
          article.title.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
          article.author.toLowerCase().includes(state.filters.searchQuery.toLowerCase());
        
        return authorMatch && typeMatch && startDateMatch && endDateMatch && searchMatch;
      });
    },
    clearFilters: (state) => {
      state.filters = {
        author: '',
        startDate: '',
        endDate: '',
        type: '',
        searchQuery: '',
      };
      state.filteredArticles = state.articles;
    },
    // Add ability to refresh news
    refreshNews: (state) => {
      state.isLoading = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.isLoading = false;
        state.articles = action.payload;
        state.filteredArticles = action.payload;
        // Clear any previous errors
        state.error = null;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('News fetch rejected:', action.payload);
      });
  },
});

export const { setFilter, clearFilters, refreshNews } = newsSlice.actions;
export default newsSlice.reducer;