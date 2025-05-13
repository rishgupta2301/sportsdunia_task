import React from 'react';
import ArticleFilters from '../components/news/ArticleFilters';
import ArticleCard from '../components/news/ArticleCard';
import useNews from '../hooks/useNews';

const NewsPage: React.FC = () => {
  const { filteredArticles, isLoading, error } = useNews();
  
  if (isLoading) {
    return (
      <div className="min-h-screen-minus-header flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading articles...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen-minus-header flex items-center justify-center">
        <div className="bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 p-4 rounded-md max-w-lg">
          <h3 className="font-semibold mb-2">Error loading articles</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <ArticleFilters />
      
      {filteredArticles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-8 text-center animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;