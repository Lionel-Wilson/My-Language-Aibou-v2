import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animate-pulse"></div>
      </div>
      <span className="ml-3 text-slate-400 font-medium">Processing...</span>
    </div>
  );
};