
import React from 'react';
import { InterventionPlan, SupportPlan, ExtractedData } from '../types';

interface Step7FinalReportProps {
  interventionPlan: InterventionPlan;
  supportPlan: SupportPlan;
  extractedData: ExtractedData | null;
  onDownloadReport: () => void;
}

const Step7FinalReport: React.FC<Step7FinalReportProps> = ({
  onDownloadReport
}) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-semibold text-teal-700">✅ כל השלבים הושלמו!</h2>
      <p className="text-lg text-gray-600">
        התוכנית המלאה, הכוללת את הגדרת ההתערבות ואת תוכנית הליווי, מוכנה להורדה.
      </p>
      <button
        onClick={onDownloadReport}
        className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-blue-700 transition duration-150 transform hover:scale-105"
      >
        📄 הורד דוח מסכם ומלא
      </button>
    </div>
  );
};

export default Step7FinalReport;
