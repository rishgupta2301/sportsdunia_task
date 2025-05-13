import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchNews, setFilter, clearFilters } from '../store/slices/newsSlice';

export const useNews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { articles, filteredArticles, isLoading, error, filters } = useSelector(
    (state: RootState) => state.news
  );

  useEffect(() => {
    if (articles.length === 0) {
      dispatch(fetchNews());
    }
  }, [dispatch, articles.length]);

  const updateFilter = (key: string, value: string) => {
    dispatch(setFilter({ key, value }));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  const getUniqueAuthors = () => {
    const authors = new Set(articles.map((article) => article.author));
    return Array.from(authors);
  };

  return {
    articles,
    filteredArticles,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    getUniqueAuthors,
    fetchNews: () => dispatch(fetchNews()),
  };
};

export default useNews;