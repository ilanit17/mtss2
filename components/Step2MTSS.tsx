
import React, { useState, useEffect, useCallback } from 'react';
import SuggestionTextarea from './SuggestionTextarea';
import SchoolTag from './SchoolTag';
import { InterventionPlan, ExtractedData, Tier2Group, School, ChallengeDetail, SchoolChallenge, CategorizedTier3Schools } from '../types';
import { ISSUE_KEYWORDS_MAP } from '../constants'; // ALL_SUGGESTIONS removed

interface Step2MTSSProps {
  interventionPlan: InterventionPlan;
  extractedData: ExtractedData | null;
  tier1Suggestions: string[]; // Dynamic
  tier3Suggestions: string[]; // Dynamic
  categorizedTier3Schools: CategorizedTier3Schools;
  onTier1OutcomesChange: (value: string) => void;
  onTier3OutcomesChange: (value: string) => void;
  onUpdateTier2Group: (updatedGroup: Tier2Group) => void;
  onAddTier2Group: (newGroup: Tier2Group) => void;
  onRemoveTier2Group: (groupId: string) => void;
}

const Tier2GroupItem: React.FC<{
  group: Tier2Group;
  allSchoolNames: string[];
  onUpdate: (updatedGroup: Tier2Group) => void;
  onRemove: (groupId: string) => void;
}> = ({ group, allSchoolNames, onUpdate, onRemove }) => {
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...group, name: e.target.value });
  };

  const handleOutcomesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...group, outcomes: e.target.value.split('\n').filter(o => o.trim()) });
  };

  const handleSchoolToggle = (schoolName: string) => {
    const newSchools = group.schools.includes(schoolName)
      ? group.schools.filter(s => s !== schoolName)
      : [...group.schools, schoolName];
    onUpdate({ ...group, schools: newSchools });
  };

  return (
    <div className="p-5 border border-yellow-400 bg-white rounded-lg shadow-sm space-y-4">
      <div className="form-group">
        <label htmlFor={`${group.id}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          שם הקבוצה
        </label>
        <input
          type="text"
          id={`${group.id}-name`}
          value={group.name}
          onChange={handleNameChange}
          placeholder="לדוגמה: קבוצת תמיכה בשפה"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div className="form-group">
        <label htmlFor={`${group.id}-outcomes`} className="block text-sm font-medium text-gray-700 mb-1">
          תוצרים/פעולות
        </label>
        <textarea
          id={`${group.id}-outcomes`}
          rows={3}
          value={group.outcomes.join('\n')}
          onChange={handleOutcomesChange}
          placeholder="הגדר תוצרים או פעולות ספציפיות לקבוצה זו."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">שיוך בתי ספר:</label>
        {allSchoolNames.length > 0 ? (
          <div className="max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-md bg-gray-50 space-y-1">
            {allSchoolNames.map(schoolName => (
              <label key={schoolName} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer p-1 hover:bg-yellow-100 rounded">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                  checked={group.schools.includes(schoolName)}
                  onChange={() => handleSchoolToggle(schoolName)}
                />
                <span className="text-sm text-gray-700">{schoolName}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">לא נמצאו בתי ספר.</p>
        )}
      </div>
      <button
        onClick={() => onRemove(group.id)}
        className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 shadow"
      >
        - הסר קבוצה
      </button>
    </div>
  );
};


const Step2MTSS: React.FC<Step2MTSSProps> = ({
  interventionPlan,
  extractedData,
  tier1Suggestions,
  tier3Suggestions,
  categorizedTier3Schools,
  onTier1OutcomesChange,
  onTier3OutcomesChange,
  onUpdateTier2Group,
  onAddTier2Group,
  onRemoveTier2Group
}) => {
  const [suggestedTier2Groups, setSuggestedTier2Groups] = useState<Tier2Group[]>([]);
  const [showAllChallengesForTier2, setShowAllChallengesForTier2] = useState(false);
  const [mainIssueKeywordsForTier2, setMainIssueKeywordsForTier2] = useState<string[]>([]);
  const [allChallengesCountForTier2, setAllChallengesCountForTier2] = useState(0);
  const [relevantChallengesCountForTier2, setRelevantChallengesCountForTier2] = useState(0);
  const [showOtherTier3Details, setShowOtherTier3Details] = useState(false);


  const getKeywordsForMainIssue = useCallback((mainIssueName: string, mainIssueQuestion: string): string[] => {
      const searchString = `${mainIssueName.toLowerCase()} ${mainIssueQuestion.toLowerCase()}`;
      let activeKeywords: string[] = [];

      for (const categoryKey in ISSUE_KEYWORDS_MAP) {
          if (mainIssueName.toLowerCase().includes(categoryKey.toLowerCase()) || categoryKey.toLowerCase().includes(mainIssueName.toLowerCase())) {
              activeKeywords = ISSUE_KEYWORDS_MAP[categoryKey];
              break; 
          }
      }

      if (activeKeywords.length === 0) {
          const allKeywordsFromMap = Object.values(ISSUE_KEYWORDS_MAP).flat();
          activeKeywords = allKeywordsFromMap.filter(kw => searchString.includes(kw.toLowerCase()));
      }
      
      if (activeKeywords.length === 0 && mainIssueName.trim() !== '') {
          activeKeywords = mainIssueName.toLowerCase().split(/\s+/).filter(w => w.length > 2 && isNaN(Number(w)));
      }
      
      return [...new Set(activeKeywords.map(kw => kw.toLowerCase()))];
  }, []);


  const filterChallengesByKeywords = useCallback((challenges: ChallengeDetail[], keywords: string[]): ChallengeDetail[] => {
      if (!keywords || keywords.length === 0) return challenges; 
      return challenges.filter(challenge => 
          keywords.some(keyword => 
              challenge.text.toLowerCase().includes(keyword) || 
              challenge.category.toLowerCase().includes(keyword)
          )
      );
  }, []);

  useEffect(() => {
    if (extractedData && extractedData.schools) {
      const allSchoolChallenges: ChallengeDetail[] = extractedData.schools.flatMap(school =>
        school.challenges.map(c => ({ ...c, schoolName: school.name }))
      );
      setAllChallengesCountForTier2(new Set(allSchoolChallenges.map(c => c.text)).size);

      const keywords = getKeywordsForMainIssue(extractedData.challenge, extractedData.main_issue_question);
      setMainIssueKeywordsForTier2(keywords);
      
      const challengesToProcess = showAllChallengesForTier2 
        ? allSchoolChallenges 
        : filterChallengesByKeywords(allSchoolChallenges, keywords);
      
      setRelevantChallengesCountForTier2(new Set(filterChallengesByKeywords(allSchoolChallenges, keywords).map(c => c.text)).size);

      const challengeCounts: { [key: string]: string[] } = {};
      challengesToProcess.forEach(challenge => {
        if (!challengeCounts[challenge.text]) {
          challengeCounts[challenge.text] = [];
        }
        if(!challengeCounts[challenge.text].includes(challenge.schoolName)) { 
            challengeCounts[challenge.text].push(challenge.schoolName);
        }
      });

      const sortedChallenges = Object.entries(challengeCounts)
        .map(([text, schools]) => ({ text, schools, count: schools.length }))
        .sort((a, b) => b.count - a.count);
      
      const newSuggestions = sortedChallenges
        .slice(0, 5) 
        .filter(c => c.schools.length >= 1) 
        .map(c => ({
          id: `sugg-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
          name: `קבוצה לטיפול ב: ${c.text}`,
          schools: c.schools,
          challengeText: c.text,
          outcomes: [`התמודדות ממוקדת עם "${c.text}"`],
        }));
      setSuggestedTier2Groups(newSuggestions);
    }
  }, [extractedData, showAllChallengesForTier2, getKeywordsForMainIssue, filterChallengesByKeywords]);

  if (!extractedData) {
    return <p className="text-center text-red-500">שגיאה: יש להעלות קבצים בשלב 0.</p>;
  }

  const allSchoolNames = extractedData.schools.map(s => s.name);

  const handleAddSuggestedGroup = (suggestion: Tier2Group) => {
    onAddTier2Group({ ...suggestion, id: `group-${Date.now()}` }); 
    setSuggestedTier2Groups(prev => prev.filter(s => s.id !== suggestion.id));
  };
  
  const handleAddNewTier2Group = () => {
    onAddTier2Group({
        id: `group-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
        name: `קבוצת התערבות ${interventionPlan.tier2Groups.length + 1}`,
        outcomes: [],
        schools: []
    });
  };

  const relevantTier3Total = categorizedTier3Schools.relevant.length;
  const otherTier3Total = categorizedTier3Schools.other.length;
  const totalTier3Schools = relevantTier3Total + otherTier3Total;
  const focusPercentage = totalTier3Schools > 0 ? Math.round((relevantTier3Total / totalTier3Schools) * 100) : 0;

  return (
    <div className="space-y-10">
      {/* Tier 1 */}
      <div className="p-6 border-2 border-green-500 bg-green-50 rounded-xl shadow-md">
        <h3 className="flex items-center gap-3 text-2xl font-semibold text-green-700 mb-4">
          <span className="text-3xl">🌍</span> Tier 1: אוניברסלי - כל המנהלים (100%)
        </h3>
         <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
            <p className="text-green-800 text-sm">
                <strong>עקרון:</strong> כל מנהל זכאי לתמיכה בסיסית איכותית בסוגייה המרכזית, 
                ללא קשר לרמת הביצועים הנוכחית שלו.
            </p>
        </div>
        <SuggestionTextarea
          id="tier1Outcomes"
          label="תוצרים/פעולות"
          value={interventionPlan.tier1.outcomes.join('\n')}
          rows={3}
          placeholder="הגדר תוצרים או פעולות לכל בתי הספר."
          suggestions={tier1Suggestions}
          onChange={onTier1OutcomesChange}
        />
      </div>

      {/* Tier 2 */}
      <div className="p-6 border-2 border-yellow-500 bg-yellow-50 rounded-xl shadow-md">
        <h3 className="flex items-center gap-3 text-2xl font-semibold text-yellow-700 mb-4">
          <span className="text-3xl">🎯</span> Tier 2: קבוצתי
        </h3>

        <div className="mb-4 p-3 bg-blue-50 border-r-4 border-blue-400 rounded-md text-sm">
            <p className="font-semibold text-blue-700">הצעות לקבוצות ממוקדות בסוגייה המרכזית:</p>
            <p className="text-blue-600"><strong>הסוגייה:</strong> {extractedData.challenge}</p>
            {!showAllChallengesForTier2 && mainIssueKeywordsForTier2.length > 0 && (
                 <p className="text-blue-600 text-xs"><strong>מילות מפתח רלוונטיות:</strong> {mainIssueKeywordsForTier2.join(', ')}</p>
            )}
            <p className="text-blue-600">
                {showAllChallengesForTier2 
                    ? `מוצגים הצעות מתוך ${allChallengesCountForTier2} אתגרים שזוהו בכלל בתי הספר.`
                    : `מוצגים הצעות מתוך ${relevantChallengesCountForTier2} אתגרים רלוונטיים (מתוך ${allChallengesCountForTier2} סה"כ).`
                }
            </p>
            <button 
                onClick={() => setShowAllChallengesForTier2(!showAllChallengesForTier2)}
                className="text-xs text-blue-500 hover:text-blue-700 underline mt-1"
            >
                {showAllChallengesForTier2 ? "הצג הצעות ממוקדות בלבד" : "הצג הצעות לכלל האתגרים"}
            </button>
        </div>

        {suggestedTier2Groups.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xl font-medium text-yellow-600 mb-3">הצעות לקבוצות התערבות ({showAllChallengesForTier2 ? 'כלליות' : 'ממוקדות סוגייה'}):</h4>
            <div className="space-y-4">
              {suggestedTier2Groups.map(sugg => (
                <div key={sugg.id} className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="font-semibold">{sugg.name}</p>
                  <div className="my-2 flex flex-wrap gap-2">
                    <span className="font-medium text-sm text-yellow-700">בתי ספר ({sugg.schools.length}):</span>
                    {sugg.schools.map(sName => <SchoolTag key={sName} name={sName} color="yellow" />)}
                  </div>
                  <button
                    onClick={() => handleAddSuggestedGroup(sugg)}
                    className="mt-2 px-4 py-1.5 bg-yellow-500 text-white text-sm font-semibold rounded-md hover:bg-yellow-600"
                  >
                    + הוסף קבוצה
                  </button>
                </div>
              ))}
            </div>
            <hr className="my-6 border-yellow-300" />
          </div>
        )}
         {suggestedTier2Groups.length === 0 && (
            <p className="text-gray-500 italic mb-4">לא נמצאו הצעות מתאימות לקבוצות התערבות {showAllChallengesForTier2 ? 'נוספות.' : 'ממוקדות בסוגייה זו. ניתן להציג הצעות לכלל האתגרים.'}</p>
        )}

        <h4 className="text-xl font-medium text-yellow-600 mb-3">קבוצות מוגדרות:</h4>
        <div className="space-y-6 mb-6">
          {interventionPlan.tier2Groups.length > 0 ? (
            interventionPlan.tier2Groups.map(group => (
              <Tier2GroupItem
                key={group.id}
                group={group}
                allSchoolNames={allSchoolNames}
                onUpdate={onUpdateTier2Group}
                onRemove={onRemoveTier2Group}
              />
            ))
          ) : (
            <p className="text-gray-500 italic">לא הוגדרו קבוצות.</p>
          )}
        </div>
        <button
          onClick={handleAddNewTier2Group}
          className="px-5 py-2.5 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600"
        >
          + הוסף קבוצה
        </button>
      </div>

      {/* Tier 3 */}
      <div className="p-6 border-2 border-red-500 bg-red-50 rounded-xl shadow-md">
        <h3 className="flex items-center gap-3 text-2xl font-semibold text-red-700 mb-4">
          <span className="text-3xl">🔍</span> 
          Tier 3: אינטנסיבי - ממוקד בסוגיית {extractedData.challenge || "הסוגייה המרכזית"}
        </h3>

        {totalTier3Schools > 0 && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm border border-red-300">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div><strong>רלוונטי לסוגייה:</strong> {relevantTier3Total} בתי ספר</div>
                    <div><strong>אתגרים אחרים:</strong> {otherTier3Total} בתי ספר</div>
                    <div><strong>סה"כ ב-Tier 3:</strong> {totalTier3Schools} בתי ספר</div>
                    <div><strong>% מיקוד בסוגייה:</strong> {focusPercentage}%</div>
                </div>
            </div>
        )}
        
        {categorizedTier3Schools.relevant.length > 0 && (
            <div className="mb-6 p-4 bg-red-100 border-r-4 border-red-400 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600 font-semibold">🎯 טיפול מיידי בסוגייה ({categorizedTier3Schools.relevant.length} בתי ספר):</span>
                    <span className="text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded-full">עדיפות עליונה</span>
                </div>
                {categorizedTier3Schools.relevant.map(school => (
                    <div key={school.name} className="mt-2 text-sm">
                        <SchoolTag name={school.name} color="red" />
                        {school.relevantChallenges && school.relevantChallenges.length > 0 && (
                            <ul className="list-disc pr-5 text-xs text-red-700 mt-1">
                                {school.relevantChallenges.map((rc, idx) => <li key={idx}>{rc.text} ({rc.category})</li>)}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        )}

        {categorizedTier3Schools.other.length > 0 && (
            <div className="mb-6 p-4 bg-gray-100 border-r-4 border-gray-400 rounded-md">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-semibold">⚠️ אתגרים נוספים (לא בהקשר הסוגייה הנוכחית):</span>
                    <button className="text-xs text-gray-500 underline hover:text-gray-700" onClick={() => setShowOtherTier3Details(!showOtherTier3Details)}>
                        {showOtherTier3Details ? 'הסתר פרטים' : `הצג פרטי ${categorizedTier3Schools.other.length} בתי ספר`}
                    </button>
                </div>
                {showOtherTier3Details && (
                    <div className="mt-2 text-sm text-gray-600 space-y-2">
                        {categorizedTier3Schools.other.map(school => (
                             <div key={school.name} className="mt-1">
                                <SchoolTag name={school.name} color="gray" />
                                {school.challenges && school.challenges.length > 0 && (
                                    <ul className="list-disc pr-5 text-xs text-gray-500 mt-1">
                                        {school.challenges.map((c, idx) => <li key={idx}>{c.text} ({c.category})</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                         <p className="mt-2 text-xs italic">בתי ספר אלו יטופלו בנפרד או יועברו לתוכניות התערבות מתאימות אחרות.</p>
                    </div>
                )}
            </div>
        )}
        
        <div className="form-group">
            <label htmlFor="tier3Outcomes" className="block text-lg font-semibold text-red-700 mb-2">
                תוצרים/פעולות - {categorizedTier3Schools.relevant.length > 0 ? `ממוקדות ב-${categorizedTier3Schools.relevant.length} בתי הספר הרלוונטיים` : "כלליות ל-Tier 3"}
            </label>
            {categorizedTier3Schools.relevant.length > 0 && (
                <p className="text-sm text-red-600 mb-3">
                    התמקד בפעולות שיטפלו בבתי הספר עם אתגרי {extractedData.challenge || "הסוגייה המרכזית"}.
                </p>
            )}
             <SuggestionTextarea
                id="tier3Outcomes"
                label="" // Label is now part of the form-group label above
                value={interventionPlan.tier3.outcomes.join('\n')}
                rows={3}
                placeholder={`הגדר תוצרים עבור בתי הספר ב-Tier 3 ${categorizedTier3Schools.relevant.length > 0 ? 'הרלוונטיים לסוגייה.' : 'הזקוקים לתמיכה אינטנסיבית.' }`}
                suggestions={tier3Suggestions}
                onChange={onTier3OutcomesChange}
            />
        </div>
      </div>
    </div>
  );
};

export default Step2MTSS;
