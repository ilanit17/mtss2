
import React from 'react';
import ActionItemCard from './ActionItemCard';
import { SupportPlan, CoreAction, CoreActionSuggestion } from '../types';
import { SUGGESTED_ACTIONS_BANK } from '../constants';

interface Step4ActionsProps {
  supportPlan: SupportPlan;
  onAddAction: (suggestion?: CoreActionSuggestion) => void;
  onUpdateAction: (id: string, field: keyof CoreAction, value: string) => void;
  onRemoveAction: (id: string) => void;
}

const Step4Actions: React.FC<Step4ActionsProps> = ({
  supportPlan,
  onAddAction,
  onUpdateAction,
  onRemoveAction,
}) => {
  const selectedActionsHtml = supportPlan.coreActions.map(action => (
    <ActionItemCard
      key={action.id}
      action={action}
      onUpdate={onUpdateAction}
      onRemove={onRemoveAction}
    />
  ));

  const suggestionsHtml = SUGGESTED_ACTIONS_BANK.map(sugg => (
    <div key={sugg.name} className="p-3 border-b hover:bg-teal-50 flex justify-between items-center">
      <div>
        <p className="font-semibold text-teal-700">{sugg.name}</p>
        <p className="text-sm text-gray-600">{sugg.category} - {sugg.tier}</p>
      </div>
      <button
        onClick={() => onAddAction(sugg)}
        className="bg-teal-500 text-white px-3 py-1 rounded-md text-sm hover:bg-teal-600"
      >
        + הוסף
      </button>
    </div>
  ));

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">פעולות הליבה בתוכנית</h3>
        <div id="selected-actions" className="space-y-4">
          {supportPlan.coreActions.length > 0 ? selectedActionsHtml : <p className="text-gray-500 italic">לא נוספו פעולות.</p>}
        </div>
        <button
          onClick={() => onAddAction()}
          className="mt-6 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
        >
          + הוסף פעולה חדשה
        </button>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">מאגר הצעות לפעולות</h3>
        <div className="suggestion-bank">{suggestionsHtml}</div>
      </div>
    </div>
  );
};

export default Step4Actions;
