import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import DashboardPage from './pages/DashboardPage';
import NewsPage from './pages/NewsPage';
import PayoutPage from './pages/PayoutPage';
import AnalyticsPage from './pages/AnalyticsPage';
import useAuth from './hooks/useAuth';

// Authentication guard
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// App router with providers
const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />} />
        
        <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<DashboardPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/payouts" element={<PayoutPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;