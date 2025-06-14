
import React from 'react';
import FileUploadButton from './FileUploadButton';
import { ExtractedData } from '../types';

interface Step0UploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>, fileType: number) => void;
  onLoadDemoData: () => void;
  onProceed: () => void;
  issueFileUploaded: boolean;
  dataFileUploaded: boolean;
  extractedData: ExtractedData | null;
}

const Step0Upload: React.FC<Step0UploadProps> = ({
  onFileSelect,
  onLoadDemoData,
  onProceed,
  issueFileUploaded,
  dataFileUploaded,
  extractedData,
}) => {
  const allFilesProcessed = issueFileUploaded && dataFileUploaded && extractedData;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <FileUploadButton
          id="issueFile"
          label="1. העלה קובץ סוגייה"
          description="קובץ HTML שנוצר בכלי ניתוח סוגייה."
          icon="📜"
          uploaded={issueFileUploaded}
          accept=".html,.htm"
          fileTypeIdentifier={1}
          onFileSelect={onFileSelect}
        />
        <FileUploadButton
          id="dataFile"
          label="2. העלה קובץ נתונים"
          description="קובץ HTML שנוצר בכלי ניתוח נתונים."
          icon="📊"
          uploaded={dataFileUploaded}
          accept=".html,.htm"
          fileTypeIdentifier={2}
          onFileSelect={onFileSelect}
        />
      </div>
      <div className="text-center">
        <button
          onClick={onLoadDemoData}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
        >
          טען נתוני הדגמה
        </button>
      </div>
      {allFilesProcessed && extractedData && (
        <div className="mt-6 p-6 bg-green-50 border-r-4 border-green-500 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-green-700 mb-3">✅ סיכום נתונים:</h3>
          <p className="text-gray-700">
            <strong>שאלת הסוגייה:</strong> {extractedData.main_issue_question}
          </p>
          <p className="text-gray-700">
            <strong>בתי ספר:</strong> {extractedData.schools.length}
          </p>
        </div>
      )}
      <div className="text-center mt-8">
        <button
          onClick={onProceed}
          disabled={!allFilesProcessed}
          className="px-8 py-4 bg-gradient-to-r from-teal-500 to-green-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:from-teal-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          המשך לשלב 1 →
        </button>
      </div>
    </div>
  );
};

export default Step0Upload;
