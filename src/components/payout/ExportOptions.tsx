import React from 'react';
import { CSVLink } from 'react-csv';
import { File as FilePdf, FileSpreadsheet, FileText } from 'lucide-react';
import usePayout from '../../hooks/usePayout';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportOptions: React.FC = () => {
  const { authorPayouts, rates } = usePayout();
  
  // Format data for CSV export
  const csvData = [
    ['Author', 'News Articles', 'Blog Articles', 'Total Articles', 'Total Payout'],
    ...authorPayouts.map((payout) => [
      payout.author,
      payout.breakdown.news,
      payout.breakdown.blog,
      payout.articles,
      `$${payout.totalPayout.toFixed(2)}`,
    ]),
  ];
  
  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Author Payout Report', 14, 22);
    
    // Payout rates
    doc.setFontSize(12);
    doc.text('Payout Rates:', 14, 35);
    doc.setFontSize(10);
    doc.text(`News Rate: $${rates.find((r) => r.type === 'news')?.rate || 0}`, 20, 45);
    doc.text(`Blog Rate: $${rates.find((r) => r.type === 'blog')?.rate || 0}`, 20, 52);
    
    // Payout table
    autoTable(doc, {
      head: [['Author', 'News', 'Blogs', 'Total Articles', 'Total Payout']],
      body: authorPayouts.map((payout) => [
        payout.author,
        payout.breakdown.news,
        payout.breakdown.blog,
        payout.articles,
        `$${payout.totalPayout.toFixed(2)}`,
      ]),
      startY: 65,
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }
    
    doc.save('author-payouts.pdf');
  };
  
  // Google Sheets export (mock implementation - would need Google API in a real app)
  const exportToGoogleSheets = () => {
    // In a real app, this would use the Google Sheets API
    alert('This feature would export to Google Sheets using their API.');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Payout Report</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={generatePDF}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FilePdf size={18} className="text-error-600" />
          <span>Export as PDF</span>
        </button>
        
        <CSVLink
          data={csvData}
          filename="author-payouts.csv"
          className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FileText size={18} className="text-success-600" />
          <span>Export as CSV</span>
        </CSVLink>
        
        <button
          onClick={exportToGoogleSheets}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FileSpreadsheet size={18} className="text-primary-600" />
          <span>Export to Google Sheets</span>
        </button>
      </div>
    </div>
  );
};

export default ExportOptions;