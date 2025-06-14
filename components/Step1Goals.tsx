
import React from 'react';
import SuggestionTextarea from './SuggestionTextarea';
import { InterventionPlan } from '../types';
// Removed ALL_SUGGESTIONS import, as suggestions will be passed via props

interface Step1GoalsProps {
  interventionPlan: InterventionPlan;
  mainGoalSuggestions: string[];
  smartObjectivesSuggestions: string[];
  onMainGoalChange: (value: string) => void;
  onSmartObjectivesChange: (value: string) => void;
}

const Step1Goals: React.FC<Step1GoalsProps> = ({
  interventionPlan,
  mainGoalSuggestions,
  smartObjectivesSuggestions,
  onMainGoalChange,
  onSmartObjectivesChange,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <SuggestionTextarea
          id="mainGoal"
          label="מטרה מרכזית (מה נרצה להשיג?)"
          value={interventionPlan.mainGoal}
          rows={3}
          placeholder="תאר את המטרה המרכזית של תוכנית ההתערבות."
          suggestions={mainGoalSuggestions}
          onChange={onMainGoalChange}
        />
      </div>
      <div>
        <SuggestionTextarea
          id="smartObjectives"
          label="יעדים תפעוליים (SMART)"
          value={interventionPlan.smartObjectives.join('\n')}
          rows={4}
          placeholder="הגדר 2-3 יעדים ספציפיים, מדידים, ברי השגה, רלוונטיים ומוגדרים בזמן."
          suggestions={smartObjectivesSuggestions}
          onChange={onSmartObjectivesChange}
        />
      </div>
    </div>
  );
};

export default Step1Goals;
