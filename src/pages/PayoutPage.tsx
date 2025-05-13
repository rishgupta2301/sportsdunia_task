import React from 'react';
import PayoutTable from '../components/payout/PayoutTable';
import ExportOptions from '../components/payout/ExportOptions';
import usePayout from '../hooks/usePayout';

const PayoutPage: React.FC = () => {
  const { isLoading, error } = usePayout();
  
  if (isLoading) {
    return (
      <div className="min-h-screen-minus-header flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading payout data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen-minus-header flex items-center justify-center">
        <div className="bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 p-4 rounded-md max-w-lg">
          <h3 className="font-semibold mb-2">Error loading payout data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PayoutTable />
      <ExportOptions />
    </div>
  );
};

export default PayoutPage;