import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Article } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

interface ArticleChartProps {
  articles: Article[];
  type: 'author' | 'type' | 'date';
}

const ArticleChart: React.FC<ArticleChartProps> = ({ articles, type }) => {
  // Get chart data based on type
  const getChartData = () => {
    if (type === 'author') {
      // Group by author
      const authorData: Record<string, number> = {};
      articles.forEach((article) => {
        if (!authorData[article.author]) {
          authorData[article.author] = 0;
        }
        authorData[article.author] += 1;
      });
      
      return {
        labels: Object.keys(authorData),
        datasets: [
          {
            label: 'Articles',
            data: Object.values(authorData),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      };
    } else if (type === 'type') {
      // Group by type
      const typeData: Record<string, number> = {
        news: 0,
        blog: 0,
      };
      
      articles.forEach((article) => {
        typeData[article.type] += 1;
      });
      
      return {
        labels: Object.keys(typeData).map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
        datasets: [
          {
            label: 'Articles',
            data: Object.values(typeData),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(139, 92, 246, 0.7)',
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(139, 92, 246, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    } else {
      // Group by date (last 7 days)
      const today = new Date();
      const dates: string[] = [];
      const dateCounts: number[] = [];
      
      // Create array of the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
        });
        dates.push(dateString);
        dateCounts.push(0);
      }
      
      // Count articles for each date
      articles.forEach((article) => {
        const articleDate = new Date(article.publishedAt);
        const diffTime = Math.abs(today.getTime() - articleDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) {
          const dayIndex = 6 - (diffDays - 1);
          if (dayIndex >= 0) {
            dateCounts[dayIndex] += 1;
          }
        }
      });
      
      return {
        labels: dates,
        datasets: [
          {
            label: 'Articles',
            data: dateCounts,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      };
    }
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: true,
        text: `Articles by ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };
  
  return (
    <div className="h-72">
      <Bar data={getChartData()} options={options} />
    </div>
  );
};

export default ArticleChart;