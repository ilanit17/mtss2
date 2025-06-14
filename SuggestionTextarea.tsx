
import React, { useState } from 'react';

interface SuggestionTextareaProps {
  id: string;
  label: string;
  value: string;
  rows: number;
  placeholder: string;
  suggestions: string[];
  onChange: (value: string) => void;
}

const SuggestionTextarea: React.FC<SuggestionTextareaProps> = ({
  id,
  label,
  value,
  rows,
  placeholder,
  suggestions,
  onChange,
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const handleAddSuggestion = () => {
    if (!selectedSuggestion) return;
    const currentText = value;
    const newText = (currentText.trim() ? currentText + '\n' : '') + `• ${selectedSuggestion}`;
    onChange(newText);
    setSelectedSuggestion(''); // Reset select
  };

  return (
    <div className="form-group space-y-2">
      <label htmlFor={id} className="block mb-2 text-lg font-semibold text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex shadow-sm rounded-lg">
        <button
          type="button"
          onClick={handleAddSuggestion}
          className="px-4 py-3 bg-teal-500 text-white font-semibold rounded-l-lg hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          הוסף הצעה
        </button>
        <select
          value={selectedSuggestion}
          onChange={(e) => setSelectedSuggestion(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500 outline-none"
        >
          <option value="" disabled>
            בחר הצעה מהרשימה...
          </option>
          {suggestions.map((sugg, index) => (
            <option key={index} value={sugg}>
              {sugg.length > 70 ? sugg.substring(0, 67) + "..." : sugg}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SuggestionTextarea;
