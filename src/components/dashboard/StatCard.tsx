import React from 'react';
import { ArrowUp, ArrowDown, DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactElement;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change ? change >= 0 : null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 transition-all duration-300 hover:shadow-md animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</h3>
          
          {typeof change === 'number' && (
            <div className="mt-2 flex items-center">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isPositive
                    ? 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-300'
                    : 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-300'
                }`}
              >
                {isPositive ? (
                  <ArrowUp size={14} className="mr-1" />
                ) : (
                  <ArrowDown size={14} className="mr-1" />
                )}
                {Math.abs(change)}%
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">from last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;