
import React, { useState, useEffect, useCallback } from 'react';
import {
  ExtractedData, InterventionPlan, SupportPlan, AppMessage, SchoolChallenge, School,
  Tier2Group, CoreAction, Partner, Resource, OperationalTask, CoreActionSuggestion, PartnerSuggestion, ResourceSuggestion,
  ChallengeDetail, TaskType, CategorizedTier3Schools, GoalSuggestions
} from './types';
import {
  DEMO_EXTRACTED_DATA, INITIAL_INTERVENTION_PLAN, INITIAL_SUPPORT_PLAN, STEP_DESCRIPTIONS,
  ACTION_CATEGORIES, TIER_OPTIONS, TARGET_AUDIENCE_OPTIONS, FREQUENCY_OPTIONS, SUGGESTED_ACTIONS_BANK,
  ISSUE_KEYWORDS_MAP, SUPERVISOR_ROLE_NAME, DEFAULT_PARTNER_FOR_EXECUTION, RESPONSIBLE_TO_BE_ASSIGNED, TASK_STATUSES,
  EXPANDED_GENERAL_GOALS, GOALS_BY_ISSUE_TYPE, TIER3_SUGGESTIONS_BY_ISSUE
} from './constants';

import LoadingIndicator from './components/LoadingIndicator';
import MessageDisplay from './components/MessageDisplay';
import IssueHeaderBar from './components/IssueHeaderBar';
import Step0Upload from './components/Step0Upload';
import Step1Goals from './components/Step1Goals';
import Step2MTSS from './components/Step2MTSS';
import Step3Report from './components/Step3Report';
import Step4Actions from './components/Step4Actions';
import Step5PartnersResources from './components/Step5PartnersResources';
import Step6OperationalPlan from './components/Step6OperationalPlan';
import Step7FinalReport from './components/Step7FinalReport';
import ActionButtons from './components/ActionButtons';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [interventionPlan, setInterventionPlan] = useState<InterventionPlan>(JSON.parse(JSON.stringify(INITIAL_INTERVENTION_PLAN)));
  const [supportPlan, setSupportPlan] = useState<SupportPlan>(JSON.parse(JSON.stringify(INITIAL_SUPPORT_PLAN)));
  
  const [tempExtractedData, setTempExtractedData] = useState<{ issueFile: boolean, dataFile: boolean, schools: School[], challenge?: string, main_issue_question?: string, vision?: string }>({ issueFile: false, dataFile: false, schools: [] });
  const [issueFileUploaded, setIssueFileUploaded] = useState(false);
  const [dataFileUploaded, setDataFileUploaded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<AppMessage>({ type: null, text: null });

  const [identifiedActionsForStep4, setIdentifiedActionsForStep4] = useState<CoreAction[]>([]);

  // State for dynamic suggestions
  const [dynamicMainGoalSuggestions, setDynamicMainGoalSuggestions] = useState<string[]>(EXPANDED_GENERAL_GOALS.mainGoalSuggestions);
  const [dynamicSmartObjectivesSuggestions, setDynamicSmartObjectivesSuggestions] = useState<string[]>(EXPANDED_GENERAL_GOALS.smartObjectivesSuggestions);
  const [dynamicTier1Suggestions, setDynamicTier1Suggestions] = useState<string[]>(EXPANDED_GENERAL_GOALS.tier1Suggestions);
  const [dynamicTier3Suggestions, setDynamicTier3Suggestions] = useState<string[]>(EXPANDED_GENERAL_GOALS.tier3Suggestions);
  const [categorizedTier3Schools, setCategorizedTier3Schools] = useState<CategorizedTier3Schools>({ relevant: [], other: [] });


  const displayMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    const timer = setTimeout(() => {
      setMessage({ type: null, text: null });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const resetMessages = () => setMessage({ type: null, text: null });

  // --- Suggestion and Categorization Logic ---
  const extractKeywordsForIssueType = (mainIssueQuestion: string, challengeName: string): string[] => {
    const combinedText = `${challengeName.toLowerCase()} ${mainIssueQuestion.toLowerCase()}`;
    const foundKeywords = new Set<string>();

    for (const categoryKey in ISSUE_KEYWORDS_MAP) {
        const keywordsInCategory = ISSUE_KEYWORDS_MAP[categoryKey];
        if (challengeName.toLowerCase().includes(categoryKey.toLowerCase())) {
            keywordsInCategory.forEach(kw => foundKeywords.add(kw.toLowerCase()));
        }
        keywordsInCategory.forEach(kw => {
            if (combinedText.includes(kw.toLowerCase())) {
                keywordsInCategory.forEach(kkw => foundKeywords.add(kkw.toLowerCase())); // Add all keywords from matching category
            }
        });
    }
    if (foundKeywords.size === 0 && challengeName.trim()) {
        challengeName.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !isNaN(Number(w))).forEach(w => foundKeywords.add(w));
    }
    return Array.from(foundKeywords);
  };

  const determineIssueType = (keywords: string[], challengeName: string): string | null => {
      const lowerChallengeName = challengeName.toLowerCase();
      if (keywords.some(kw => kw === 'שפה' || kw === 'קריאה' || kw === 'כתיבה' || kw === 'הבעה') || lowerChallengeName.includes('שפה')) return 'שפה';
      if (keywords.some(kw => kw === 'מתמטיקה' || kw === 'חשבון') || lowerChallengeName.includes('מתמטיקה')) return 'מתמטיקה';
      if (keywords.some(kw => kw === 'אקלים' || kw === 'משמעת' || kw === 'התנהגות') || lowerChallengeName.includes('אקלים')|| lowerChallengeName.includes('ניהול')) return 'אקלים';
      // Add more specific mappings if needed
      return null;
  };

  useEffect(() => {
    if (extractedData) {
        const keywords = extractKeywordsForIssueType(extractedData.main_issue_question, extractedData.challenge);
        const issueType = determineIssueType(keywords, extractedData.challenge);

        // Update goal suggestions (Step 1 & Tier 1 for Step 2)
        const specificGoals = issueType ? GOALS_BY_ISSUE_TYPE[issueType] : null;
        setDynamicMainGoalSuggestions(specificGoals?.mainGoalSuggestions || EXPANDED_GENERAL_GOALS.mainGoalSuggestions);
        setDynamicSmartObjectivesSuggestions(specificGoals?.smartObjectivesSuggestions || EXPANDED_GENERAL_GOALS.smartObjectivesSuggestions);
        setDynamicTier1Suggestions(specificGoals?.tier1Suggestions || EXPANDED_GENERAL_GOALS.tier1Suggestions);

        // Update Tier 3 suggestions (Step 2)
        setDynamicTier3Suggestions( (issueType ? TIER3_SUGGESTIONS_BY_ISSUE[issueType] : null) || EXPANDED_GENERAL_GOALS.tier3Suggestions );
        
        // Categorize Tier 3 schools
        const allTier3Raw = extractedData.schools.filter(s => s.tier === 3);
        const relevant: School[] = [];
        const other: School[] = [];

        allTier3Raw.forEach(school => {
            const schoolRelevantChallenges = school.challenges.filter(challenge =>
                keywords.some(keyword =>
                    challenge.text.toLowerCase().includes(keyword) ||
                    challenge.category.toLowerCase().includes(keyword)
                )
            );
            if (schoolRelevantChallenges.length > 0) {
                relevant.push({ ...school, relevantChallenges: schoolRelevantChallenges, tier3Category: 'relevant' });
            } else {
                other.push({ ...school, tier3Category: 'other' });
            }
        });
        setCategorizedTier3Schools({ relevant, other });
    } else {
        // Reset to defaults if no extractedData
        setDynamicMainGoalSuggestions(EXPANDED_GENERAL_GOALS.mainGoalSuggestions);
        setDynamicSmartObjectivesSuggestions(EXPANDED_GENERAL_GOALS.smartObjectivesSuggestions);
        setDynamicTier1Suggestions(EXPANDED_GENERAL_GOALS.tier1Suggestions);
        setDynamicTier3Suggestions(EXPANDED_GENERAL_GOALS.tier3Suggestions);
        setCategorizedTier3Schools({ relevant: [], other: [] });
    }
  }, [extractedData]);


  const parseIssueFile = (doc: Document): Partial<ExtractedData> => {
    const dataDiv = doc.getElementById('data-for-next-app');
    if (!dataDiv) throw new Error("קובץ סוגייה לא תקין (חסר #data-for-next-app).");
    const challenge = dataDiv.querySelector('[data-key="challenge"]')?.textContent?.trim() || 'לא צוין';
    const main_issue_question = dataDiv.querySelector('[data-key="main_issue_question"]')?.textContent?.trim() || 'לא צוין';
    const vision = dataDiv.querySelector('[data-key="vision"]')?.textContent?.trim() || 'לא צוין';
    if (main_issue_question === 'לא צוין') throw new Error("שאלת הסוגיה חסרה בקובץ.");
    return { challenge, main_issue_question, vision, issueFile: true };
  };

  const parseDataFile = (doc: Document): { schools: School[], dataFile: boolean } => {
    const schoolElements = doc.querySelectorAll('.school-item');
    if (schoolElements.length === 0) throw new Error("קובץ נתונים לא תקין (חסר .school-item).");
    const schools: School[] = Array.from(schoolElements).map(el => {
      const name = el.querySelector('strong')?.textContent?.trim() || 'לא ידוע';
      const challenges: SchoolChallenge[] = Array.from(el.querySelectorAll('.school-challenges li')).map(li => {
        const parts = li.textContent?.split(':') || [];
        return { category: parts[0]?.trim() || 'כללי', text: parts[1]?.trim() || li.textContent?.trim() || '' };
      });
      const tierEl = el.closest('.mtss-tier');
      let tier: 1 | 2 | 3 = 1;
      if (tierEl?.classList.contains('tier-2')) tier = 2;
      else if (tierEl?.classList.contains('tier-3')) tier = 3;
      return { name, challenges, tier };
    });
    return { schools, dataFile: true };
  };

  const checkAllFilesUploaded = useCallback(() => {
    if (tempExtractedData.issueFile && tempExtractedData.dataFile) {
        const fullExtractedData = {
            issueFile: tempExtractedData.issueFile,
            dataFile: tempExtractedData.dataFile,
            challenge: tempExtractedData.challenge || '',
            main_issue_question: tempExtractedData.main_issue_question || '',
            vision: tempExtractedData.vision || '',
            schools: tempExtractedData.schools,
        };
      setExtractedData(fullExtractedData);
      displayMessage('success', 'כל הקבצים הועלו ונותחו בהצלחה!');
    }
  }, [tempExtractedData, displayMessage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileTypeIdentifier: number) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
      displayMessage('error', "סוג קובץ לא נתמך. יש להעלות קובץ HTML.");
      return;
    }
    setLoading(true);
    try {
      const fileContent = await file.text();
      const doc = new DOMParser().parseFromString(fileContent, 'text/html');
      let parsedUpdate: Partial<ExtractedData & { schools: School[] }> = {};

      if (fileTypeIdentifier === 1) { // Issue file
        parsedUpdate = parseIssueFile(doc);
        setIssueFileUploaded(true);
      } else if (fileTypeIdentifier === 2) { // Data file
        const dataFileResult = parseDataFile(doc);
        parsedUpdate = { schools: dataFileResult.schools, dataFile: dataFileResult.dataFile };
        setDataFileUploaded(true);
      }
      setTempExtractedData(prev => ({ ...prev, ...parsedUpdate }));
    } catch (err: any) {
      displayMessage('error', `שגיאה בעיבוד קובץ: ${err.message}`);
      if (fileTypeIdentifier === 1) setIssueFileUploaded(false);
      if (fileTypeIdentifier === 2) setDataFileUploaded(false);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkAllFilesUploaded();
  }, [tempExtractedData, checkAllFilesUploaded]);


  const loadDemoData = () => {
    setLoading(true);
    setTimeout(() => {
      setExtractedData(DEMO_EXTRACTED_DATA);
      setIssueFileUploaded(true);
      setDataFileUploaded(true);
      setTempExtractedData({ 
        issueFile: true,
        dataFile: true,
        schools: DEMO_EXTRACTED_DATA.schools,
        challenge: DEMO_EXTRACTED_DATA.challenge,
        main_issue_question: DEMO_EXTRACTED_DATA.main_issue_question,
        vision: DEMO_EXTRACTED_DATA.vision,
      });
      displayMessage('success', 'נתוני הדגמה נטענו בהצלחה!');
      setLoading(false);
    }, 500);
  };

  const findMatchingActionsFromOutcomes = useCallback((outcomes: string[], suggestions: CoreActionSuggestion[]): CoreAction[] => {
    const matchedActionsMap = new Map<string, CoreAction>();
    outcomes.forEach(outcome => {
      if (!outcome || !outcome.trim()) return;
      const outcomeLower = outcome.toLowerCase();
      suggestions.forEach(suggestion => {
        if (matchedActionsMap.has(suggestion.name)) return; 
        for (const keyword of suggestion.keywords) {
          if (outcomeLower.includes(keyword.toLowerCase())) {
            matchedActionsMap.set(suggestion.name, {
              id: `autoaction_${Date.now()}_${suggestion.name.replace(/\s+/g, '')}`,
              name: suggestion.name,
              description: suggestion.description,
              category: suggestion.category,
              tier: suggestion.tier,
              targetAudience: TARGET_AUDIENCE_OPTIONS[0],
              frequency: FREQUENCY_OPTIONS[0],
              isAutoSelected: true,
              sourceOutcome: outcome,
            });
            break; 
          }
        }
      });
    });
    return Array.from(matchedActionsMap.values());
  }, []);

  // --- Logic for Step 6: Automatic Task Generation ---
  const findBestPartnerForTask = (action: CoreAction, partners: Partner[], supervisorName: string): string => {
      const actionCategoryLower = action.category.toLowerCase();
      
      const specificPartner = partners.find(p => 
          p.category.toLowerCase().includes(actionCategoryLower) || 
          p.role.toLowerCase().includes(actionCategoryLower) ||
          p.name === DEFAULT_PARTNER_FOR_EXECUTION
      );

      if (specificPartner) return specificPartner.name;
      if (partners.length > 0) return partners[0].name; 
      return RESPONSIBLE_TO_BE_ASSIGNED; 
  };

  const generateTasksFromActions = useCallback((
      actions: CoreAction[], 
      partners: Partner[], 
      supervisorName: string
    ): OperationalTask[] => {
      const newTasks: OperationalTask[] = [];
      actions.forEach(action => {
          const baseId = `task_${action.id}_${Date.now()}`;
          const bestPartnerForExec = findBestPartnerForTask(action, partners, supervisorName);

          newTasks.push({
              id: `${baseId}_plan`,
              task: `תכנון וארגון של: ${action.name}`,
              responsible: supervisorName,
              startDate: '',
              endDate: '',
              status: TASK_STATUSES[0],
              actionId: action.id,
              isAutoGenerated: true,
              taskType: 'תכנון',
              sourceActionName: action.name,
          });
          newTasks.push({
              id: `${baseId}_exec`,
              task: `ביצוע של: ${action.name}`,
              responsible: bestPartnerForExec,
              startDate: '',
              endDate: '',
              status: TASK_STATUSES[0],
              actionId: action.id,
              isAutoGenerated: true,
              taskType: 'ביצוע',
              sourceActionName: action.name,
          });
          let followUpResponsible = supervisorName;
          if (bestPartnerForExec !== RESPONSIBLE_TO_BE_ASSIGNED && bestPartnerForExec !== supervisorName) {
              followUpResponsible += ` ו${bestPartnerForExec}`;
          }
          newTasks.push({
              id: `${baseId}_followup`,
              task: `מעקב והערכה של: ${action.name}`,
              responsible: followUpResponsible,
              startDate: '',
              endDate: '',
              status: TASK_STATUSES[0],
              actionId: action.id,
              isAutoGenerated: true,
              taskType: 'מעקב',
              sourceActionName: action.name,
          });
      });
      return newTasks;
  }, []);


  const moveToStep = (step: number) => {
    resetMessages();
    
    if (currentStep === 2 && step > 2) { 
        const allOutcomes: string[] = [
            ...interventionPlan.tier1.outcomes,
            ...interventionPlan.tier2Groups.flatMap(g => g.outcomes),
            ...interventionPlan.tier3.outcomes,
        ].filter(o => o && o.trim());
        
        const matched = findMatchingActionsFromOutcomes(allOutcomes, SUGGESTED_ACTIONS_BANK);
        setIdentifiedActionsForStep4(matched);
    }
    
    if (step === 4 && currentStep < 4 && identifiedActionsForStep4.length > 0) { 
        setSupportPlan(prev => {
            const newActions = identifiedActionsForStep4.filter(
                identifiedAction => !prev.coreActions.some(existingAction => existingAction.name === identifiedAction.name)
            );
            if (newActions.length > 0) {
                 displayMessage('success', `${newActions.length} פעולות זוהו אוטומטית והוספו לתוכנית.`);
            }
            return {
                ...prev,
                coreActions: [...prev.coreActions, ...newActions]
            };
        });
        setIdentifiedActionsForStep4([]); 
    }

    if (step === 6 && currentStep === 5) {
        const autoGeneratedTasks = generateTasksFromActions(supportPlan.coreActions, supportPlan.partners, SUPERVISOR_ROLE_NAME);
        if (autoGeneratedTasks.length > 0) {
            setSupportPlan(prev => {
                const existingAutoTaskIds = new Set(prev.operationalPlan.filter(t => t.isAutoGenerated).map(t => t.id));
                const newUniqueAutoTasks = autoGeneratedTasks.filter(newTask => !existingAutoTaskIds.has(newTask.id));
                
                const tasksToAdd = newUniqueAutoTasks.filter(newTask => 
                    !prev.operationalPlan.some(existingTask => 
                        existingTask.isAutoGenerated &&
                        existingTask.actionId === newTask.actionId && 
                        existingTask.taskType === newTask.taskType
                    )
                );

                if (tasksToAdd.length > 0) {
                    displayMessage('success', `${tasksToAdd.length} משימות נוצרו אוטומטית מפעולות הליבה.`);
                }
                return {
                    ...prev,
                    operationalPlan: [...prev.operationalPlan.filter(t => !t.isAutoGenerated), ...tasksToAdd] 
                };
            });
        }
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => { if (currentStep > 0) moveToStep(currentStep - 1); };
  
  const startNew = () => {
    setExtractedData(null);
    setInterventionPlan(JSON.parse(JSON.stringify(INITIAL_INTERVENTION_PLAN)));
    setSupportPlan(JSON.parse(JSON.stringify(INITIAL_SUPPORT_PLAN)));
    setTempExtractedData({ issueFile: false, dataFile: false, schools: [] });
    setIssueFileUploaded(false);
    setDataFileUploaded(false);
    setIdentifiedActionsForStep4([]);
    resetMessages();
    moveToStep(0);
  };

  // Step 1 handlers
  const handleMainGoalChange = (value: string) => setInterventionPlan(p => ({ ...p, mainGoal: value }));
  const handleSmartObjectivesChange = (value: string) => setInterventionPlan(p => ({ ...p, smartObjectives: value.split('\n') }));

  // Step 2 handlers
  const handleTier1OutcomesChange = (value: string) => setInterventionPlan(p => ({ ...p, tier1: { ...p.tier1, outcomes: value.split('\n') } }));
  const handleTier3OutcomesChange = (value: string) => setInterventionPlan(p => ({ ...p, tier3: { ...p.tier3, outcomes: value.split('\n') } }));
  const handleUpdateTier2Group = (updatedGroup: Tier2Group) => {
    setInterventionPlan(p => ({
      ...p,
      tier2Groups: p.tier2Groups.map(g => g.id === updatedGroup.id ? updatedGroup : g)
    }));
  };
  const handleAddTier2Group = (newGroup: Tier2Group) => {
    setInterventionPlan(p => ({ ...p, tier2Groups: [...p.tier2Groups, newGroup] }));
  };
  const handleRemoveTier2Group = (groupId: string) => {
    setInterventionPlan(p => ({ ...p, tier2Groups: p.tier2Groups.filter(g => g.id !== groupId) }));
  };
  
  // Step 4 handlers
  const handleAddCoreAction = (suggestion?: CoreActionSuggestion) => {
    const newAction: CoreAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: suggestion?.name || 'פעולה חדשה',
      description: suggestion?.description || '',
      category: suggestion?.category || ACTION_CATEGORIES[0],
      tier: suggestion?.tier || TIER_OPTIONS[0],
      targetAudience: TARGET_AUDIENCE_OPTIONS[0],
      frequency: FREQUENCY_OPTIONS[0],
    };
    if (!supportPlan.coreActions.some(ca => ca.name === newAction.name)) {
      setSupportPlan(p => ({ ...p, coreActions: [...p.coreActions, newAction] }));
    } else {
      displayMessage('error', `פעולה בשם "${newAction.name}" כבר קיימת.`);
    }
  };
  const handleUpdateCoreAction = (id: string, field: keyof CoreAction, value: string) => {
    setSupportPlan(p => ({
      ...p,
      coreActions: p.coreActions.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };
  const handleRemoveCoreAction = (id: string) => {
    setSupportPlan(p => ({ ...p, coreActions: p.coreActions.filter(a => a.id !== id) }));
  };

  // Step 5 handlers
  const handleAddItem = (type: 'partner' | 'resource', suggestion?: PartnerSuggestion | ResourceSuggestion) => {
    const newItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: suggestion?.name || 'פריט חדש',
      category: suggestion?.category || (type === 'partner' ? ACTION_CATEGORIES[0] : TIER_OPTIONS[0]), 
      ...(type === 'partner' ? { role: (suggestion as PartnerSuggestion)?.role || '' } : { details: (suggestion as ResourceSuggestion)?.details || '' })
    };
    if (type === 'partner') {
      setSupportPlan(p => ({ ...p, partners: [...p.partners, newItem as Partner] }));
    } else {
      setSupportPlan(p => ({ ...p, resources: [...p.resources, newItem as Resource] }));
    }
  };
  const handleUpdateItem = (type: 'partner' | 'resource', id: string, field: any, value: string) => {
    if (type === 'partner') {
      setSupportPlan(p => ({ ...p, partners: p.partners.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    } else {
      setSupportPlan(p => ({ ...p, resources: p.resources.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    }
  };
  const handleRemoveItem = (type: 'partner' | 'resource', id: string) => {
    if (type === 'partner') {
      setSupportPlan(p => ({ ...p, partners: p.partners.filter(item => item.id !== id) }));
    } else {
      setSupportPlan(p => ({ ...p, resources: p.resources.filter(item => item.id !== id) }));
    }
  };
  
  // Step 6 handlers
  const handleAddTask = () => { 
    const newTask: OperationalTask = {
      id: `manual_task_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
      task: '',
      responsible: '',
      startDate: '',
      endDate: '',
      status: TASK_STATUSES[0],
      actionId: '', 
      isAutoGenerated: false, 
      taskType: undefined, 
      sourceActionName: '',
    };
    setSupportPlan(p => ({ ...p, operationalPlan: [...p.operationalPlan, newTask] }));
  };

  const handleUpdateTask = (id: string, field: keyof OperationalTask, value: string | boolean) => {
    setSupportPlan(p => ({
      ...p,
      operationalPlan: p.operationalPlan.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };
  const handleRemoveTask = (id: string) => {
    setSupportPlan(p => ({ ...p, operationalPlan: p.operationalPlan.filter(t => t.id !== id) }));
  };

  // Step 7 handler
  const escapeHtml = (unsafe: string | undefined | null): string => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  const generateFullReportHTML = () => {
    const { main_issue_question } = extractedData || {};
    const { mainGoal } = interventionPlan;

    const interventionPart = `
      <div style="margin-bottom:20px;padding:15px;border:1px solid #b2dfdb;border-radius:8px;background:#e0f2f1;">
        <h3 style="color:#00796b;margin-top:0;">שאלת הסוגייה:</h3>
        <p style="margin-bottom:0;">${escapeHtml(main_issue_question) || 'לא הוגדרה.'}</p>
      </div>
      <div style="margin-bottom:20px;padding:15px;border:1px solid #b2dfdb;border-radius:8px;background:#e0f2f1;">
        <h3 style="color:#00796b;margin-top:0;">מטרה מרכזית:</h3>
        <p style="margin-bottom:0;">${escapeHtml(mainGoal) || 'לא הוגדרה.'}</p>
      </div>
    `;
    const actionsHtml = supportPlan.coreActions.length ? supportPlan.coreActions.map(a => `
      <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; background: #f9f9f9; border-radius: 5px;">
        <h4 style="color:#00796b;margin-top:0;">${escapeHtml(a.name)}</h4>
        <p><strong>תיאור:</strong> ${escapeHtml(a.description)}</p>
        <p><strong>קטגוריה:</strong> ${escapeHtml(a.category)} | <strong>שכבת MTSS:</strong> ${escapeHtml(a.tier)} | <strong>תדירות:</strong> ${escapeHtml(a.frequency)}</p>
      </div>`).join('') : '<p>לא הוגדרו פעולות ליבה.</p>';

    const partnersHtml = supportPlan.partners.length ? `<ul>${supportPlan.partners.map(p => `<li><strong>${escapeHtml(p.name)}</strong> (${escapeHtml(p.category)}): ${escapeHtml(p.role)}</li>`).join('')}</ul>` : '<p>לא זוהו שותפים.</p>';
    const resourcesHtml = supportPlan.resources.length ? `<ul>${supportPlan.resources.map(r => `<li><strong>${escapeHtml(r.name)}</strong> (${escapeHtml(r.category)}): ${escapeHtml(r.details)}</li>`).join('')}</ul>` : '<p>לא הוגדרו משאבים.</p>';
    
    const tasksHtml = supportPlan.operationalPlan.length ? `
      <table style="width:100%; border-collapse: collapse; font-size: 12px;">
        <tr style="background-color: #f2f2f2; text-align: right;">
          <th style="padding: 8px; border: 1px solid #ddd;">משימה</th>
          <th style="padding: 8px; border: 1px solid #ddd;">סוג</th>
          <th style="padding: 8px; border: 1px solid #ddd;">אחראי</th>
          <th style="padding: 8px; border: 1px solid #ddd;">תאריכים</th>
          <th style="padding: 8px; border: 1px solid #ddd;">סטטוס</th>
          <th style="padding: 8px; border: 1px solid #ddd;">מקור</th>
        </tr>
        ${supportPlan.operationalPlan.map(t => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(t.task)} ${t.isAutoGenerated ? '(אוטומטי)' : ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${t.taskType ? escapeHtml(t.taskType) : ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(t.responsible)}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${t.startDate || ''} - ${t.endDate || ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(t.status)}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(t.sourceActionName)}</td>
          </tr>`).join('')}
      </table>` : '<p>לא הוגדרה תוכנית עבודה.</p>';

    return `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8"><title>דוח תוכנית התערבות וליווי</title><style>ul{padding-right:20px;} body{font-family:Arial,sans-serif;direction:rtl;line-height:1.6;padding:20px;max-width:900px;margin:auto;}</style></head><body><h1 style="text-align:center;color:#00796b;">דוח מסכם: תוכנית התערבות וליווי MTSS</h1><h2 style="color:#004d40;border-bottom:2px solid #00796b;">חלק א': תוכנית ההתערבות</h2>${interventionPart}<hr style="margin: 40px 0;"><h2 style="color:#004d40;border-bottom:2px solid #00796b;">חלק ב': תוכנית הליווי האופרטיבית</h2><div style="margin-top:20px;"><h3 style="color:#00695c;">פעולות ליבה</h3>${actionsHtml}</div><div style="margin-top:20px;"><h3 style="color:#00695c;">שותפים למהלך</h3>${partnersHtml}</div><div style="margin-top:20px;"><h3 style="color:#00695c;">משאבים נדרשים</h3>${resourcesHtml}</div><div style="margin-top:20px;"><h3 style="color:#00695c;">תוכנית עבודה אופרטיבית</h3>${tasksHtml}</div></body></html>`;
  };

  const downloadFullReport = () => {
    const htmlContent = generateFullReportHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const challengeName = extractedData?.challenge || 'כללי';
    link.download = `דוח_ליווי_MTSS_${challengeName.replace(/[\s"']/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    displayMessage('success', 'הדוח המלא נוצר והורד בהצלחה!');
  };


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return <Step0Upload 
                        onFileSelect={handleFileUpload} 
                        onLoadDemoData={loadDemoData}
                        onProceed={() => moveToStep(1)}
                        issueFileUploaded={issueFileUploaded}
                        dataFileUploaded={dataFileUploaded}
                        extractedData={extractedData}
                        />;
      case 1: return <Step1Goals 
                        interventionPlan={interventionPlan}
                        mainGoalSuggestions={dynamicMainGoalSuggestions}
                        smartObjectivesSuggestions={dynamicSmartObjectivesSuggestions}
                        onMainGoalChange={handleMainGoalChange}
                        onSmartObjectivesChange={handleSmartObjectivesChange}
                        />;
      case 2: return <Step2MTSS 
                        interventionPlan={interventionPlan}
                        extractedData={extractedData}
                        tier1Suggestions={dynamicTier1Suggestions}
                        tier3Suggestions={dynamicTier3Suggestions}
                        categorizedTier3Schools={categorizedTier3Schools}
                        onTier1OutcomesChange={handleTier1OutcomesChange}
                        onTier3OutcomesChange={handleTier3OutcomesChange}
                        onUpdateTier2Group={handleUpdateTier2Group}
                        onAddTier2Group={handleAddTier2Group}
                        onRemoveTier2Group={handleRemoveTier2Group}
                        />;
      case 3: return <Step3Report interventionPlan={interventionPlan} extractedData={extractedData} />;
      case 4: return <Step4Actions 
                        supportPlan={supportPlan}
                        onAddAction={handleAddCoreAction}
                        onUpdateAction={handleUpdateCoreAction}
                        onRemoveAction={handleRemoveCoreAction}
                        />;
      case 5: return <Step5PartnersResources 
                        supportPlan={supportPlan}
                        onAddItem={handleAddItem}
                        onUpdateItem={handleUpdateItem}
                        onRemoveItem={handleRemoveItem}
                        />;
      case 6: return <Step6OperationalPlan
                        supportPlan={supportPlan}
                        onAddTask={handleAddTask}
                        onUpdateTask={handleUpdateTask}
                        onRemoveTask={handleRemoveTask}
                        />;
      case 7: return <Step7FinalReport 
                        interventionPlan={interventionPlan}
                        supportPlan={supportPlan}
                        extractedData={extractedData}
                        onDownloadReport={downloadFullReport}
                        />;
      default: return <p>שלב לא ידוע.</p>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8 bg-white/90 backdrop-blur-md text-teal-700 p-6 md:p-10 rounded-xl shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-green-600 to-yellow-500">
          🎯 בניית תוכנית התערבות וליווי MTSS
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          {STEP_DESCRIPTIONS[currentStep]}
        </p>
      </header>

      <LoadingIndicator isLoading={loading} />
      <MessageDisplay message={message} />
      
      {currentStep > 0 && extractedData && <IssueHeaderBar extractedData={extractedData} />}

      <main className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-xl">
        {renderCurrentStep()}
      </main>

      <ActionButtons 
        currentStep={currentStep}
        interventionPlan={interventionPlan}
        supportPlan={supportPlan}
        onGoBack={goBack}
        onProceed={() => moveToStep(currentStep + 1)}
        onStartNew={startNew}
      />
    </div>
  );
};

export default App;
