
import React from 'react';
import { InterventionPlan, ExtractedData } from '../types';

interface Step3ReportProps {
  interventionPlan: InterventionPlan;
  extractedData: ExtractedData | null;
}

const Step3Report: React.FC<Step3ReportProps> = ({ interventionPlan, extractedData }) => {
  if (!extractedData) {
    return <p className="text-center text-red-500">שגיאה: יש להעלות קבצים תחילה.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg tailwind-configured-prose">
        <h2 className="text-3xl font-semibold text-center text-teal-700 mb-6 pb-2 border-b-2 border-teal-300">
          סיכום תוכנית ההתערבות
        </h2>
        <p className="text-center text-gray-600">
          זהו סיכום תוכנית ההתערבות. בשלב הבא, נבנה על בסיס זה את תוכנית הליווי האופרטיבית.
        </p>
        
        <div className="p-4 mt-6 mb-4 bg-gray-50 rounded-lg border-l-4 rtl:border-l-0 rtl:border-r-4 border-teal-500">
          <h3 className="text-xl font-semibold">שאלת הסוגייה:</h3>
          <p className="text-gray-700">{extractedData.main_issue_question || 'לא הוגדרה.'}</p>
        </div>

        <div className="p-4 mb-4 bg-gray-50 rounded-lg border-l-4 rtl:border-l-0 rtl:border-r-4 border-teal-500">
          <h3 className="text-xl font-semibold">מטרה מרכזית:</h3>
          <p className="text-gray-700">{interventionPlan.mainGoal || 'לא הוגדרה.'}</p>
        </div>

        <div className="p-4 mb-4 bg-gray-50 rounded-lg border-l-4 rtl:border-l-0 rtl:border-r-4 border-teal-500">
          <h3 className="text-xl font-semibold">יעדים תפעוליים (SMART):</h3>
          {interventionPlan.smartObjectives && interventionPlan.smartObjectives.length > 0 ? (
            <ul className="list-disc pl-5 rtl:pr-5">
              {interventionPlan.smartObjectives.filter(o => o.trim()).map((objective, index) => (
                <li key={index} className="text-gray-700">{objective}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">לא הוגדרו יעדים.</p>
          )}
        </div>
        
        <div className="p-4 mb-4 bg-gray-50 rounded-lg border-l-4 rtl:border-l-0 rtl:border-r-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-700">Tier 1: אוניברסלי - תוצרים/פעולות</h3>
            {interventionPlan.tier1.outcomes && interventionPlan.tier1.outcomes.length > 0 ? (
            <ul className="list-disc pl-5 rtl:pr-5">
                {interventionPlan.tier1.outcomes.filter(o => o.trim()).map((outcome, index) => (
                <li key={index} className="text-gray-700">{outcome}</li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-700">לא הוגדרו תוצרים.</p>
            )}
        </div>

        {interventionPlan.tier2Groups && interventionPlan.tier2Groups.length > 0 && (
            <div className="p-4 mb-4 bg-gray-50 rounded-lg border-l-4 rtl:border-l-0 rtl:border-r-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-yellow-700">Tier 2: קבוצתי - קבוצות התערבות</h3>
                {interventionPlan.tier2Groups.map(group => (
                    <div key={group.id} className="mt-3 pt-3 border-t border-yellow-200 first:mt-0 first:border-t-0">
                        <h4 className="font-medium text-yellow-600">{group.name}</h4>
                        <p className="text-sm text-gray-600">בתי ספר: {group.schools.join(', ') || "לא שויכו"}</p>
                        <h5 className="text-sm font-medium mt-1">תוצרים/פעולות:</h5>
                        {group.outcomes && group.outcomes.length > 0 ? (
                             <ul className="list-disc pl-5 rtl:pr-5 text-sm">
                                {group.outcomes.filter(o => o.trim()).map((outcome, idx) => <li key={idx}>{outcome}</li>)}
                            </ul>
                        ) : <p className="text-sm text-gray-500 italic">אין תוצרים מוגדרים לקבוצה זו.</p>}
                    </div>
                ))}
            </div>
        )}
        
        <div className="p-4 bg-gray-50 rounded-lg border-l-4 rtl:border-l-0 rtl:border-r-4 border-red-500">
            <h3 className="text-xl font-semibold text-red-700">Tier 3: אינטנסיבי - תוצרים/פעולות</h3>
            {interventionPlan.tier3.outcomes && interventionPlan.tier3.outcomes.length > 0 ? (
            <ul className="list-disc pl-5 rtl:pr-5">
                {interventionPlan.tier3.outcomes.filter(o => o.trim()).map((outcome, index) => (
                <li key={index} className="text-gray-700">{outcome}</li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-700">לא הוגדרו תוצרים.</p>
            )}
        </div>

      </div>
    </div>
  );
};

export default Step3Report;
