import React from 'react';
import { 
  Newspaper, 
  DollarSign, 
  Users, 
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ArticleChart from '../components/dashboard/ArticleChart';
import useNews from '../hooks/useNews';
import usePayout from '../hooks/usePayout';

const DashboardPage: React.FC = () => {
  const { articles, isLoading: newsLoading } = useNews();
  const { authorPayouts, isLoading: payoutLoading } = usePayout();
  
  // Calculate some stats for display
  const totalArticles = articles.length;
  const totalAuthors = new Set(articles.map((article) => article.author)).size;
  const newsCount = articles.filter((article) => article.type === 'news').length;
  const blogCount = articles.filter((article) => article.type === 'blog').length;
  
  // Calculate total payout across all authors
  const totalPayout = authorPayouts.reduce((total, author) => total + author.totalPayout, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Articles"
          value={totalArticles}
          change={8}
          icon={<Newspaper size={24} className="text-white" />}
          color="bg-primary-600"
        />
        <StatCard
          title="Total Authors"
          value={totalAuthors}
          icon={<Users size={24} className="text-white" />}
          color="bg-secondary-600"
        />
        <StatCard
          title="News / Blogs"
          value={`${newsCount} / ${blogCount}`}
          icon={<Newspaper size={24} className="text-white" />}
          color="bg-accent-600"
        />
        <StatCard
          title="Total Payouts"
          value={`$${totalPayout.toFixed(2)}`}
          change={12}
          icon={<DollarSign size={24} className="text-white" />}
          color="bg-success-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 md:p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Articles by Author</h2>
          {newsLoading ? (
            <div className="h-72 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
            </div>
          ) : (
            <ArticleChart articles={articles} type="author" />
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 md:p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Article Trend</h2>
          {newsLoading ? (
            <div className="h-72 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
            </div>
          ) : (
            <ArticleChart articles={articles} type="date" />
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 md:p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Distribution</h2>
        {newsLoading ? (
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <ArticleChart articles={articles} type="type" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;