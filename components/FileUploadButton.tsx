
import React from 'react';

interface FileUploadButtonProps {
  id: string;
  label: string;
  description: string;
  icon: string;
  uploaded: boolean;
  accept: string;
  fileTypeIdentifier: number; // To differentiate handlers if needed, matches original 'fileType' param
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>, fileTypeIdentifier: number) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  id,
  label,
  description,
  icon,
  uploaded,
  accept,
  fileTypeIdentifier,
  onFileSelect,
}) => {
  const uniqueInputId = `file-input-${id}-${fileTypeIdentifier}`;

  return (
    <div
      onClick={() => document.getElementById(uniqueInputId)?.click()}
      className={`p-6 border-3 rounded-xl text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
        uploaded
          ? 'border-green-500 bg-green-50 shadow-lg'
          : 'border-dashed border-teal-500 bg-teal-50 hover:border-teal-600 hover:bg-teal-100'
      }`}
    >
      <input
        type="file"
        id={uniqueInputId}
        onChange={(e) => onFileSelect(e, fileTypeIdentifier)}
        className="hidden"
        accept={accept}
      />
      <div className={`text-5xl mb-3 ${uploaded ? 'text-green-600' : 'text-teal-600'}`}>{icon}</div>
      <h3 className={`text-xl font-semibold mb-1 ${uploaded ? 'text-green-700' : 'text-teal-700'}`}>{label}</h3>
      <p className={`text-sm ${uploaded ? 'text-green-600' : 'text-gray-600'}`}>{description}</p>
      {uploaded && (
        <span className="mt-2 inline-block text-xs font-semibold text-green-700 bg-green-200 px-2 py-0.5 rounded-full">
          הקובץ הועלה
        </span>
      )}
    </div>
  );
};

export default FileUploadButton;
