
import React from 'react';
import { STEP_DESCRIPTIONS } from '../constants';
import { InterventionPlan, SupportPlan } from '../types';

interface ActionButtonsProps {
  currentStep: number;
  interventionPlan: InterventionPlan;
  supportPlan: SupportPlan;
  onGoBack: () => void;
  onProceed: () => void;
  onStartNew: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentStep,
  interventionPlan,
  supportPlan,
  onGoBack,
  onProceed,
  onStartNew
}) => {
  if (currentStep === 0) return null;

  let nextStepButtonText = `המשך לשלב הבא →`;
  if (currentStep === 2) nextStepButtonText = 'המשך לבניית תוכנית ליווי →';
  if (currentStep === 6) nextStepButtonText = 'המשך לסיכום סופי →';

  let disabled = false;
  if (currentStep === 1 && (interventionPlan.mainGoal.trim() === '' || interventionPlan.smartObjectives.every(s => s.trim() === ''))) {
    disabled = true;
  }
  if (currentStep === 4 && supportPlan.coreActions.length === 0) {
    disabled = true;
  }
  if (currentStep === 5 && (supportPlan.partners.length === 0 || supportPlan.resources.length === 0)) {
    disabled = true;
  }
  if (currentStep === 6 && supportPlan.operationalPlan.length === 0) {
    disabled = true;
  }

  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        onClick={onGoBack}
        className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition transform hover:scale-105"
      >
        חזור ←
      </button>
      {currentStep < STEP_DESCRIPTIONS.length - 1 && (
        <button
          onClick={onProceed}
          disabled={disabled}
          className="px-8 py-3 bg-gradient-to-r from-teal-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-green-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {nextStepButtonText}
        </button>
      )}
      {currentStep === STEP_DESCRIPTIONS.length - 1 && (
        <button
          onClick={onStartNew}
          className="px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition transform hover:scale-105"
        >
          🔄 התחל תוכנית חדשה
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
