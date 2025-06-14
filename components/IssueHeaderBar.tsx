
import React from 'react';
import { ExtractedData } from '../types';

interface IssueHeaderBarProps {
  extractedData: ExtractedData | null;
}

const IssueHeaderBar: React.FC<IssueHeaderBarProps> = ({ extractedData }) => {
  if (!extractedData) return null;

  const tierCounts = { 1: 0, 2: 0, 3: 0 };
  extractedData.schools.forEach(school => {
    tierCounts[school.tier]++;
  });

  return (
    <div className="mb-6 p-4 bg-teal-50 border-r-4 border-teal-500 rounded-lg shadow-md text-teal-800">
      <h2 className="text-lg font-semibold mb-2">תמונת מצב הסוגייה:</h2>
      <p className="text-sm mb-3">
        <strong>שאלת הסוגייה המרכזית:</strong> {extractedData.main_issue_question}
      </p>
      <div className="flex items-center space-i-4 rtl:space-x-reverse">
        <strong className="text-sm">התפלגות בתי ספר לפי שכבות MTSS:</strong>
        <div className="flex items-center space-i-2 rtl:space-x-reverse">
          <span className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1 rtl:ml-1"></span>
            Tier 1: {tierCounts[1]}
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1 rtl:ml-1"></span>
            Tier 2: {tierCounts[2]}
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-1 rtl:ml-1"></span>
            Tier 3: {tierCounts[3]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IssueHeaderBar;
