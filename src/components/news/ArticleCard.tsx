import React from 'react';
import { Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { Article } from '../../types';
import { format } from 'date-fns';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const {
    title,
    description,
    author,
    source,
    url,
    urlToImage,
    publishedAt,
    type,
  } = article;
  
  const formattedDate = format(new Date(publishedAt), 'MMM dd, yyyy');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col animate-scale-in">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {urlToImage ? (
          <img
            src={urlToImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-400 dark:text-gray-500">No image</span>
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium text-white ${
          type === 'news' ? 'bg-primary-600' : 'bg-secondary-600'
        }`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
          {description}
        </p>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <User size={16} className="mr-1" />
            <span>{author}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={16} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Tag size={16} className="mr-1" />
            <span>{source}</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          Read full article
          <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;