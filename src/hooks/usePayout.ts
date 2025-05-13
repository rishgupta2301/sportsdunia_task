import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { 
  initializePayoutRates, 
  updatePayoutRate, 
  calculateAuthorPayouts 
} from '../store/slices/payoutSlice';

export const usePayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rates, authorPayouts, isLoading, error } = useSelector(
    (state: RootState) => state.payout
  );
  const { articles } = useSelector((state: RootState) => state.news);
  
  // Initialize rates only once when the hook is first mounted
  useEffect(() => {
    const shouldInitialize = rates.length === 0;
    if (shouldInitialize) {
      dispatch(initializePayoutRates());
    }
  }, []); // Empty dependency array to run only once
  
  // Calculate payouts only when articles or rates actually change
  useEffect(() => {
    const shouldCalculate = articles.length > 0 && rates.length > 0;
    if (shouldCalculate) {
      dispatch(calculateAuthorPayouts());
    }
  }, [articles.length, rates.map(r => r.rate).join(',')]); // Only depend on relevant values
  
  const setRate = (type: 'news' | 'blog', rate: number) => {
    dispatch(updatePayoutRate({ type, rate }));
  };
  
  return {
    rates,
    authorPayouts,
    isLoading,
    error,
    setRate,
  };
};

export default usePayout;