import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import usePayout from '../../hooks/usePayout';
import { AuthorPayout } from '../../types';

const PayoutTable: React.FC = () => {
  const { authorPayouts, rates, setRate } = usePayout();
  const [editingRate, setEditingRate] = useState<'news' | 'blog' | null>(null);
  const [rateValue, setRateValue] = useState<number>(0);
  
  const startEditing = (type: 'news' | 'blog') => {
    const currentRate = rates.find((r) => r.type === type)?.rate || 0;
    setEditingRate(type);
    setRateValue(currentRate);
  };
  
  const cancelEditing = () => {
    setEditingRate(null);
  };
  
  const saveRate = () => {
    if (editingRate && rateValue >= 0) {
      setRate(editingRate, rateValue);
      setEditingRate(null);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Sort payouts by total amount (highest first)
  const sortedPayouts = [...authorPayouts].sort((a, b) => b.totalPayout - a.totalPayout);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payout Management</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure payout rates and view author earnings
        </p>
      </div>
      
      {/* Payout Rates */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Payout Rates</h3>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">News Rate:</span>
            
            {editingRate === 'news' ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={rateValue}
                  onChange={(e) => setRateValue(Number(e.target.value))}
                  min="0"
                  className="w-24 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button onClick={saveRate} className="text-success-600 hover:text-success-700">
                  <Check size={18} />
                </button>
                <button onClick={cancelEditing} className="text-error-600 hover:text-error-700">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {formatCurrency(rates.find((r) => r.type === 'news')?.rate || 0)}
                </span>
                <button
                  onClick={() => startEditing('news')}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blog Rate:</span>
            
            {editingRate === 'blog' ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={rateValue}
                  onChange={(e) => setRateValue(Number(e.target.value))}
                  min="0"
                  className="w-24 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button onClick={saveRate} className="text-success-600 hover:text-success-700">
                  <Check size={18} />
                </button>
                <button onClick={cancelEditing} className="text-error-600 hover:text-error-700">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {formatCurrency(rates.find((r) => r.type === 'blog')?.rate || 0)}
                </span>
                <button
                  onClick={() => startEditing('blog')}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Payout Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Author
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Total Articles
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                News
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Blogs
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Total Payout
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedPayouts.map((payout) => (
              <tr key={payout.author} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{payout.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{payout.articles}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{payout.breakdown.news}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{payout.breakdown.blog}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {formatCurrency(payout.totalPayout)}
                  </div>
                </td>
              </tr>
            ))}
            
            {authorPayouts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No payout data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutTable;