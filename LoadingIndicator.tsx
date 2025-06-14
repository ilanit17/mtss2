
import React from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-white text-xl p-6 bg-teal-600 rounded-lg shadow-xl animate-pulse">
        טוען נתונים...
      </div>
    </div>
  );
};

export default LoadingIndicator;
