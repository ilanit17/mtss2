
import { ExtractedData, InterventionPlan, SupportPlan, CoreActionSuggestion, PartnerSuggestion, ResourceSuggestion, GoalSuggestions } from './types';

export const DEMO_EXTRACTED_DATA: ExtractedData = { issueFile: true, dataFile: true, challenge: 'אתגרי שפה וקריאה', main_issue_question: 'כיצד ניתן לפתח ולהעצים את התפיסות והאמונות המקצועיות של הצוותים החינוכיים, באמצעות למידת עמיתים, הכשרות ממוקדות וליווי אישי, על מנת להוביל לשינוי בפרקטיקות ההוראה ולשפר את הישגי התלמידים?', vision: 'צוות חינוכי בעל תחושת מסוגלות גבוהה, המאמין ביכולתו לקדם כל תלמיד ומצויד בכלים המתאימים לכך.', schools: [ { name: 'בי"ס אלונים', tier: 2, challenges: [{ category: 'שפה', text: 'רמת הבנת הנקרא אינה מספקת' }, { category: 'מתמטיקה', text: 'חרדת מתמטיקה' }] }, { name: 'בי"ס הדקלים', tier: 3, challenges: [{ category: 'שפה', text: 'רמת הבנת הנקרא אינה מספקת' }, { category: 'שפה', text: 'אוצר מילים מוגבל' }] }, { name: 'בי"ס כרמלים', tier: 2, challenges: [{ category: 'שפה', text: 'רמת הבנת הנקרא אינה מספקת' }, { category: 'יציבות צוות', text: 'תחלופה גבוהה של צוות' }] }, { name: 'בי"ס הגליל', tier: 1, challenges: [] }, { name: 'בי"ס הזיתים', tier: 1, challenges: [] }, ] };
export const INITIAL_INTERVENTION_PLAN: InterventionPlan = { mainGoal: '', smartObjectives: [], tier1: { outcomes: [] }, tier2Groups: [], tier3: { outcomes: [] }, };
export const INITIAL_SUPPORT_PLAN: SupportPlan = { coreActions: [], partners: [], resources: [], operationalPlan: [], };

// To be used as a fallback or base for dynamic suggestions
export const EXPANDED_GENERAL_GOALS: GoalSuggestions & { tier3Suggestions: string[] } = {
    mainGoalSuggestions: [
        'שיפור איכות ההוראה והלמידה בתחום הסוגייה המרכזית',
        'הטמעת פרקטיקות הוראה מבוססות מחקר',
        'פיתוח תרבות ארגונית של למידה מתמדת',
        'חיזוק יכולות המנהיגות הפדגוגית של המנהלים',
        'בניית מערכות תמיכה יעילות לצוותי ההוראה',
        'הטמעת תהליכי קבלת החלטות מבוססי נתונים',
        'חיזוק השותפות בין בית הספר לקהילה',
        'הגברת מעורבות ההורים בתהליכי הלמידה',
        'יצירת רשתות תמיכה בין-בית ספריות',
        'הטמעת טכנולוגיות חדשניות בשירות הפדגוגיה',
        'פיתוח פתרונות יצירתיים לאתגרים מקומיים',
        'בניית תרבות של ניסוי ולמידה מטעויות'
    ],
    smartObjectivesSuggestions: [
        'עד סוף השנה, 80% מהמורים יטמיעו פרקטיקה חדשה בתחום הסוגייה',
        'עליה של 15% במדדי הצלחה רלוונטיים בכל בתי הספר',
        '90% מהתלמידים יביעו שביעות רצון מאיכות ההוראה',
        '100% מהמנהלים יציגו תוכנית התערבות מבוססת נתונים',
        'הקמת צוותי הובלה פדגוגית ב-100% מבתי הספר',
        'עליה של 30% ביעילות התהליכים הניהוליים',
        'הגדלה של 50% במעורבות ההורים בפעילויות חינוכיות',
        'יצירת 3 פרויקטים משותפים בין בתי ספר באזור',
        'הקמת מועצות תלמידים פעילות ב-100% מבתי הספר',
        '100% מהצוותים יעברו הכשרה רלוונטית לסוגייה',
        'הקמת 5 קהילות למידה מקצועיות באזור',
        'עליה של 40% בשביעות רצון המורים מהפיתוח המקצועי'
    ],
    tier1Suggestions: [
        'כל המנהלים יגבשו תפיסה בית-ספרית משותפת בנושא הסוגייה',
        '100% מהמנהלים יעברו הכשרה בסיסית בתחום הרלוונטי',
        'הטמעת שפה מקצועית משותפת בכל בתי הספר',
        'יצירת מנגנוני שיתוף ידע בין כל המנהלים',
        'הקמת מערכת ניטור ומעקב אחיד בכל בתי הספר',
        'יצירת פלטפורמה דיגיטלית לשיתוף משאבים',
        'הגדרת סטנדרטים מינימליים לכל בתי הספר',
        'הטמעת תרבות של למידה מתמידה בכל המוסדות',
        'יצירת מנגנוני הכרה ועידוד להצלחות',
        'בניית רשת תמיכה עמיתים בין כל המנהלים'
    ],
    tier3Suggestions: [ // General Tier 3 suggestions
        'בניית תוכנית עבודה מותאמת אישית לבתי הספר המאתגרים ביותר.',
        'צוותי הניהול בבתי הספר המלווים יובילו ישיבות נתונים.',
        'השגת שיפור מדיד ומשמעותי בתוצאות התלמידים.'
    ]
};

export const GOALS_BY_ISSUE_TYPE: { [key: string]: Partial<GoalSuggestions> } = {
    'שפה': {
        mainGoalSuggestions: [
            'שיפור איכות הוראת השפה והקריאה בכל בתי הספר',
            'הטמעת תרבות של קריאה והבעה עצמית במוסדות החינוך',
            'חיזוק מסוגלות המורים בהוראת כישורי השפה'
        ],
        smartObjectivesSuggestions: [
            'עד סוף השנה, 80% מהמורים יטמיעו שיטות חדשות להוראת הבנת הנקרא',
            'עליה של 20% בציוני מיצ"ב בהבנת הנקרא בכל בתי הספר',
            '100% מהמנהלים יובילו תוכנית קריאה בית-ספרית'
        ],
        tier1Suggestions: [
            'כל המנהלים יגבשו חזון בית-ספרי לקידום השפה והקריאה',
            '100% מצוותי ההוראה יעברו השתלמות בהוראת הבנת הנקרא',
            'הטמעת שעת קריאה יומית בכל בתי הספר'
        ]
    },
    'מתמטיקה': {
        mainGoalSuggestions: [
            'שיפור איכות הוראת המתמטיקה וחיזוק הישגי התלמידים',
            'הפחתת חרדת מתמטיקה ופיתוח יחס חיובי למקצוע',
            'הטמעת גישות הוראה חדשניות במתמטיקה'
        ],
        smartObjectivesSuggestions: [
            'עד סוף השנה, 75% מהתלמידים יביעו יחס חיובי למתמטיקה',
            'עליה של 25% בציוני מיצ"ב במתמטיקה',
            '100% מהמורים למתמטיקה יטמיעו למידה פעילה'
        ],
        tier1Suggestions: [
            'כל המנהלים יובילו תוכנית לחיזוק המתמטיקה',
            '100% מצוותי המתמטיקה יעברו הכשרה בשיטות הוראה חדשניות',
            'הטמעת "שעת מתמטיקה כיפית" בכל בתי הספר'
        ]
    },
    'אקלים': { // Covers 'אקלים_וניהול'
        mainGoalSuggestions: [
            'יצירת אקלים חיובי ותומך למידה בכל בתי הספר',
            'חיזוק מעורבות הקהילה והורים בחיי בית הספר',
            'פיתוח מנהיגות חינוכית משתפת ודמוקרטית'
        ],
        smartObjectivesSuggestions: [
            'עד סוף השנה, 85% מהתלמידים ידווחו על תחושת שייכות לבית הספר',
            'הגדלה של 40% במעורבות ההורים בפעילויות בית ספריות',
            '100% מהמנהלים יטמיעו מנגנוני הקשבה לקהילה'
        ],
        tier1Suggestions: [
            'כל המנהלים יגבשו קוד אתי וערכי לבית הספר',
            '100% מהצוותים יעברו הכשרה בתקשורת בין-אישית',
            'הטמעת מנגנוני שיתוף קהילתי בכל בתי הספר'
        ]
    }
};

export const TIER3_SUGGESTIONS_BY_ISSUE: { [key: string]: string[] } = {
    'שפה': [
        'בניית תוכנית התערבות אישית לטיפול באתגרי הבנת הנקרא לכל בי"ס רלוונטי',
        'ליווי צמוד והדרכה של צוותי ההוראה בשפה בבתי הספר הרלוונטיים',
        'הקמת מרכז תמיכה ייעודי לקשיי קריאה ושפה עבור בתי הספר ב-Tier 3 הרלוונטי'
    ],
    'מתמטיקה': [
        'פיתוח תוכנית התערבות אינטנסיבית לטיפול בחרדת מתמטיקה וקשיים בחשבון',
        'ליווי אישי והכשרה למורי מתמטיקה המלמדים בכיתות מאתגרות בבתי הספר הרלוונטיים',
        'הטמעת שיטות הוראה חלופיות ומותאמות אישית במתמטיקה בבתי הספר הרלוונטיים'
    ],
    'אקלים': [
        'גיבוש והפעלת תוכנית חירום לשיפור האקלים הבית ספרי במוסדות הרלוונטיים',
        'ליווי אישי להנהלות בתי הספר בניהול משברי משמעת וקידום אקלים מיטבי',
        'הקמת מערכת תמיכה רגשית וחברתית מוגברת לתלמידים וצוותים בבתי הספר הרלוונטיים'
    ]
};


export const ACTION_CATEGORIES = ['הדרכה והכשרה', 'פיתוח מקצועי', 'תמיכה וליווי', 'בניית מערכות'];
export const PARTNER_CATEGORIES = ['גורמים פנים בית ספריים', 'גורמים מחוזיים', 'מוסדות אקדמיים', 'גורמים חיצוניים וקהילה'];
export const RESOURCE_CATEGORIES = ['משאבי זמן', 'משאבים כספיים', 'מומחיות ואנשים', 'חומרים וכלים', 'טכנולוגיה ותשתית'];
export const TASK_STATUSES = ['טרם החל', 'בתהליך', 'הושלם', 'בסיכון', 'נדחה', 'בוטל'];
export const TIER_OPTIONS = ['כל הרמות', 'רמה 1', 'רמה 2', 'רמה 3'];
export const TARGET_AUDIENCE_OPTIONS = ['כלל המנהלים', 'מנהלים חדשים', 'צוותי ניהול', 'מנהלים ב-Tier 2', 'מנהלים ב-Tier 3', 'סגני מנהלים', 'מורים מובילים'];
export const FREQUENCY_OPTIONS = ['יומית', 'שבועית', 'דו-שבועית', 'חודשית', 'רבעונית', 'חצי שנתית', 'לפי צורך'];

export const SUGGESTED_ACTIONS_BANK: CoreActionSuggestion[] = [ 
    { name: 'ליווי אישי רציף למנהל', category: 'תמיכה וליווי', tier: 'כל הרמות', description: 'פגישות עבודה אישיות ממוקדות (60-90 דקות) לליווי צמוד, תמיכה בקבלת החלטות וזמינות לייעוץ דחוף.', keywords: ['ליווי', 'אישי', 'מנהל', 'תמיכה', 'פגישות'] }, 
    { name: 'הכשרות ממוקדות', category: 'הדרכה והכשרה', tier: 'כל הרמות', description: 'ארגון הכשרות מותאמות אישית לצרכים ספציפיים שעלו, כגון ניהול כספים, מנהיגות פדגוגית, ניהול שינוי.', keywords: ['הכשרה', 'הדרכה', 'פיתוח מקצועי', 'סדנה'] }, 
    { name: 'פיתוח מנהיגות עמיתים', category: 'פיתוח מקצועי', tier: 'רמה 1', description: 'הכשרת מנהלים מצטיינים להובלת קבוצות עמיתים, חניכה והובלת פרויקטים מערכתיים.', keywords: ['מנהיגות', 'עמיתים', 'הכשרה', 'פיתוח'] }, 
    { name: 'מנטורינג ממנהלים מנוסים', category: 'תמיכה וליווי', tier: 'רמה 2', description: 'חיבור מנהלים למנהלים ותיקים ומנוסים לליווי, העברת ידע וביקורים הדדיים בבתי הספר.', keywords: ['מנטורינג', 'ליווי', 'מנהלים', 'ותיקים'] }, 
    { name: 'ביקורי כיתה משותפים', category: 'בניית מערכות', tier: 'רמה 3', description: 'תצפיות משותפות של המפקח והמנהל בכיתות, למטרת ליווי פדגוגי ישיר, כיול וליווי שיח המנהל עם המורים.', keywords: ['ביקור', 'תצפית', 'כיתה', 'פדגוגי'] }, 
    { name: 'צוות תמיכה רב-מקצועי', category: 'תמיכה וליווי', tier: 'רמה 3', description: 'הקמת צוות תמיכה ייעודי הכולל גורמים מהמטה, יועצים ומומחים חיצוניים למתן מענה אינטנסיבי.', keywords: ['צוות תמיכה', 'רב מקצועי', 'ייעוץ', 'מומחים'] }, 
    { name: 'קהילת למידה מקצועית (PLC)', category: 'פיתוח מקצועי', tier: 'רמה 1', description: 'הקמת פורום קבוע של מנהלים לדיון בסוגיות משותפות, שיתוף פרקטיקות מיטביות ולמידה הדדית.', keywords: ['קהילת למידה', 'PLC', 'פורום', 'עמיתים', 'שיתוף'] }, 
    { name: 'סדנת ניתוח נתונים', category: 'בניית מערכות', tier: 'רמה 2', description: 'סדנה מעשית לניתוח מעמיק של נתוני בית הספר, זיהוי מגמות וקבלת החלטות מבוססת נתונים.', keywords: ['סדנה', 'נתונים', 'ניתוח', 'החלטות'] }, 
];
export const SUGGESTED_PARTNERS_BANK: PartnerSuggestion[] = [ { name: 'מנהלים ותיקים/מצטיינים', category: 'גורמים פנים בית ספריים', role: 'מנטורים, מובילי עמיתים' }, { name: 'מדריך/ה מחוזי/ת', category: 'גורמים מחוזיים', role: 'מומחה תוכן, מלווה פדגוגי' }, { name: 'יועץ/ת ארגוני/ת', category: 'גורמים חיצוניים וקהילה', role: 'ליווי תהליכי שינוי, פיתוח צוות' }, { name: 'חוקר/ת מהאקדמיה', category: 'מוסדות אקדמיים', role: 'ליווי מבוסס מחקר, הערכה מעצבת' }, { name: 'מנהל מחלקת חינוך ברשות', category: 'גורמים חיצוניים וקהילה', role: 'גיוס משאבים, תמיכה רשותית' }, { name: 'רכז/ת תקשוב בית ספרי', category: 'גורמים פנים בית ספריים', role: 'תמיכה טכנולוגית, הדרכת כלים דיגיטליים' }, ];
export const SUGGESTED_RESOURCES_BANK: ResourceSuggestion[] = [ { name: 'שעות ליווי מפקח', category: 'משאבי זמן', details: 'הקצאת שעות שבועיות/חודשיות בהתאם לרמת ה-MTSS' }, { name: 'תקציב גפ"ן', category: 'משאבים כספיים', details: 'מיקוד סעיפים בתקציב הגמיש לצורך תמיכה במנהיגות ופיתוח צוות' }, { name: 'מאגר מומחים מחוזי', category: 'מומחיות ואנשים', details: 'שימוש במאגר היועצים והמדריכים של המחוז' }, { name: 'ערכות הדרכה למנהלים', category: 'חומרים וכלים', details: 'שימוש והתאמה של ערכות קיימות ממשרד החינוך' }, { name: 'פלטפורמת למידה מקוונת', category: 'טכנולוגיה ותשתית', details: 'שימוש בפלטפורמה קיימת ליצירת מרחב למידה למנהלים' }, ];

export const STEP_DESCRIPTIONS = [ "שלב 0: העלאת קבצים והכנת נתונים", "שלב 1: הגדרת מטרות ויעדים", "שלב 2: תכנון התערבות MTSS", "שלב 3: סיכום תוכנית ההתערבות", "שלב 4: בחירת פעולות ליבה לליווי", "שלב 5: זיהוי שותפים ומשאבים", "שלב 6: בניית תוכנית עבודה אופרטיבית", "שלב 7: סיכום והפקת דוח ליווי" ];

export const ISSUE_KEYWORDS_MAP: { [key: string]: string[] } = {
    'שפה': ['שפה', 'קריאה', 'הבנת הנקרא', 'אוצר מילים', 'כתיבה', 'ביטוי', 'הבעה', 'לשוני', 'שפתי'],
    'מתמטיקה': ['מתמטיקה', 'חשבון', 'גיאומטריה', 'אלגברה', 'פתרון בעיות', 'מספרים', 'כמותי'],
    'אקלים': ['אקלים', 'משמעת', 'התנהגות', 'מעורבות', 'רגשי', 'חברתי', 'אלימות', 'נוכחות', 'ביטחון', 'מוגנות'],
    'ניהול': ['ניהול', 'מנהיגות', 'צוות', 'תכנון', 'ארגון', 'שיתוף פעולה', 'מנהלים', 'מדיניות'],
    'הוראה': ['הוראה', 'למידה', 'פדגוגיה', 'שיטות', 'דידקטיקה', 'הערכה', 'הישגים', 'פדגוגי'],
    'רגשי-חברתי': ['רגשי', 'חברתי', 'SEL', 'כישורים חברתיים', 'רווחה נפשית', 'חוסן'],
    'יציבות צוות': ['צוות', 'תחלופה', 'שימור עובדים', 'מורל', 'פיתוח מקצועי לצוות'],
};

export const SUPERVISOR_ROLE_NAME = "המפקח/ת";
export const DEFAULT_PARTNER_FOR_EXECUTION = "מדריך/ה מחוזי/ת";
export const RESPONSIBLE_TO_BE_ASSIGNED = "לשיבוץ אחראי";
