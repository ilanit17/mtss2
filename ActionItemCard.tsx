
import React from 'react';
import { CoreAction } from '../types';
import { ACTION_CATEGORIES, TIER_OPTIONS, TARGET_AUDIENCE_OPTIONS, FREQUENCY_OPTIONS } from '../constants';

interface ActionItemCardProps {
  action: CoreAction;
  onUpdate: (id: string, field: keyof CoreAction, value: string) => void;
  onRemove: (id: string) => void;
}

const ActionItemCard: React.FC<ActionItemCardProps> = ({ action, onUpdate, onRemove }) => {
  const cardClasses = `item-card p-4 border rounded-lg shadow-sm space-y-3 fade-in ${
    action.isAutoSelected ? 'bg-teal-50 border-teal-300' : 'bg-white'
  }`;

  return (
    <div className={cardClasses}>
      {action.isAutoSelected && (
        <div className="mb-2 p-2 bg-teal-100 text-teal-700 text-xs rounded-md">
          <p><strong>💡 נבחר אוטומטית</strong></p>
          {action.sourceOutcome && <p>מקור: "{action.sourceOutcome.length > 50 ? `${action.sourceOutcome.substring(0,47)}...` : action.sourceOutcome}"</p>}
        </div>
      )}
      <div className="flex justify-between items-center">
        <input
          type="text"
          className="text-lg font-semibold border-b-2 border-transparent focus:border-teal-500 outline-none w-full bg-transparent"
          value={action.name}
          onChange={(e) => onUpdate(action.id, 'name', e.target.value)}
        />
        <button onClick={() => onRemove(action.id)} className="text-red-500 hover:text-red-700 font-bold text-xl">
          &times;
        </button>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-600">תיאור הפעולה</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white"
          rows={3}
          value={action.description}
          onChange={(e) => onUpdate(action.id, 'description', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"> {/* Adjusted to 2 cols for better fit */}
        <div>
          <label className="text-sm font-medium text-gray-600">קטגוריה</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white"
            value={action.category}
            onChange={(e) => onUpdate(action.id, 'category', e.target.value)}
          >
            {ACTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">שכבת MTSS</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white"
            value={action.tier}
            onChange={(e) => onUpdate(action.id, 'tier', e.target.value)}
          >
            {TIER_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">קהל יעד</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white"
            value={action.targetAudience}
            onChange={(e) => onUpdate(action.id, 'targetAudience', e.target.value)}
          >
            {TARGET_AUDIENCE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">תדירות</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white"
            value={action.frequency}
            onChange={(e) => onUpdate(action.id, 'frequency', e.target.value)}
          >
            {FREQUENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ActionItemCard;
