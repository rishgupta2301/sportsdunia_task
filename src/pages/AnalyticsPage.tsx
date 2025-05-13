import React from 'react';
import ArticleChart from '../components/dashboard/ArticleChart';
import useNews from '../hooks/useNews';

const AnalyticsPage: React.FC = () => {
  const { articles, isLoading } = useNews();
  
  if (isLoading) {
    return (
      <div className="min-h-screen-minus-header flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading analytics data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Articles by Author</h2>
          <div className="h-80">
            <ArticleChart articles={articles} type="author" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Content Type Distribution</h2>
          <div className="h-80">
            <ArticleChart articles={articles} type="type" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Publishing Trend</h2>
        <div className="h-80">
          <ArticleChart articles={articles} type="date" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;