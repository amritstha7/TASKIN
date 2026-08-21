export type LanguageKey = 'English' | 'Nepali' | 'Spanish' | 'French';

export interface Translations {
  // Navigation & Header
  appTitle: string;
  tagline: string;
  navDashboard: string;
  navAddTask: string;
  navMedia: string;
  navSettings: string;
  navActivity: string;
  themeToggle: string;
  themeLight: string;
  themeDark: string;
  themeAuto: string;
  quickAdd: string;
  notifications: string;
  markAllRead: string;
  
  // Dashboard & Calendar
  calendarTitle: string;
  calendarModeAD: string;
  calendarModeBS: string;
  calendarModeDual: string;
  calendarViewPreference: string;
  monthAugust: string;
  today: string;
  legend: string;
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  tasksDueOnDay: string;
  noTasksForDay: string;
  urgentBadge: string;
  pendingBadge: string;
  completedBadge: string;
  
  // Accordions
  urgentActions: string;
  urgentActionsDesc: string;
  urgentTasksPending: string;
  tasks: string;
  generalTasks: string;
  generalTasksDesc: string;
  communications: string;
  communicationsDesc: string;
  commTitle: string;
  commDueDate: string;
  commAction: string;
  commViewAttachment: string;
  myNotes: string;
  myTasksNotes: string;
  myNotesDesc: string;
  typeNewNote: string;
  addNote: string;
  snooze: string;
  snoozedFor2Hours: string;
  completeTask: string;
  completedBy: string;
  highPriority: string;
  save: string;
  delete: string;
  
  // Mobile Quick Priority Bar
  quickPriorityTitle: string;
  urgentAlert: string;
  todayTasks: string;
  efficiencyRate: string;
  jumpToUrgent: string;
  
  // Add Task Modal / Form
  addTaskTitle: string;
  taskTitleLabel: string;
  taskTitlePlaceholder: string;
  descLabel: string;
  descPlaceholder: string;
  categoryLabel: string;
  categorySelect: string;
  customCategoryPrompt: string;
  dueDateLabel: string;
  priorityLabel: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  priorityUrgent: string;
  repeatLabel: string;
  repeatNone: string;
  repeatDaily: string;
  repeatWeekly: string;
  repeatMonthly: string;
  isUrgentToggle: string;
  isUrgentDesc: string;
  notifToggle: string;
  notifDesc: string;
  timing15m: string;
  timing30m: string;
  timing1h: string;
  timing1d: string;
  btnCreateTask: string;
  btnCancel: string;
  
  // Media Gallery
  mediaGallery: string;
  mediaDesc: string;
  uploadPhoto: string;
  noMediaFound: string;
  allMedia: string;
  filterByTask: string;
  filterByUrgent: string;
  filterByComm: string;
  photoEvidence: string;
  
  // Settings & Profile
  accountTitle: string;
  editProfile: string;
  logout: string;
  appearanceTitle: string;
  languageTitle: string;
  primaryLanguage: string;
  pushNotifs: string;
  pushNotifsDesc: string;
  dailySummary: string;
  dailySummaryDesc: string;
  soundVibration: string;
  soundVibrationDesc: string;
  testSound: string;
  systemTitle: string;
  activityHistory: string;
  clearCache: string;
  clearCacheDesc: string;
  dataSyncStatus: string;
  syncedJustNow: string;
  aboutTitle: string;
  appVersion: string;
  appDescription: string;
  termsOfService: string;
  privacyPolicy: string;
  saveChanges: string;
  fullName: string;
  emailAddress: string;
  rolePosition: string;
  storeBranch: string;
  avatarUrl: string;
  branchMetroCentral: string;
  branchDowntown: string;
  branchEastHub: string;
  
  // Badges & Telemetry in Settings
  achievementsTitle: string;
  speedScannerBadge: string;
  qaChampionBadge: string;
  safetyLeaderBadge: string;
  hardwareTitle: string;
  scannerBattery: string;
  nfcStatus: string;
  
  // Activity History
  activityTitle: string;
  last24Hours: string;
  filterAll: string;
  filterCompleted: string;
  filterUpdated: string;
  filterSnoozed: string;
  filterNotes: string;
  noActivity: string;
  
  // Toasts
  toastTaskAdded: string;
  toastTaskCompleted: string;
  toastTaskReopened: string;
  toastCacheCleared: string;
  toastSettingsSaved: string;
  toastProfileUpdated: string;
  toastSynced: string;
}

export const translations: Record<LanguageKey, Translations> = {
  English: {
    appTitle: 'TASKN Operations',
    tagline: 'Retail Store Operations & Task Execution',
    navDashboard: 'Dashboard',
    navAddTask: 'Add Task',
    navMedia: 'Media',
    navSettings: 'Admin / Settings',
    navActivity: 'Activity History',
    themeToggle: 'Toggle Theme',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    themeAuto: 'Auto (System)',
    quickAdd: '+ New Task',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    
    calendarTitle: 'Store Operations Calendar',
    calendarModeAD: 'English (AD)',
    calendarModeBS: 'Nepali (BS)',
    calendarModeDual: 'Dual (AD + BS)',
    calendarViewPreference: 'Calendar View Mode',
    monthAugust: 'August 2026',
    today: 'Today',
    legend: 'Legend',
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    tasksDueOnDay: 'Tasks scheduled for',
    noTasksForDay: 'No urgent tasks scheduled for this day.',
    urgentBadge: 'Urgent Action',
    pendingBadge: 'Pending Shift Task',
    completedBadge: 'Completed',
    
    urgentActions: 'Urgent Actions',
    urgentActionsDesc: 'Time-critical tasks requiring immediate supervisor and team action.',
    urgentTasksPending: 'Urgent tasks pending',
    tasks: 'Tasks',
    generalTasks: 'Tasks',
    generalTasksDesc: 'Standard departmental operations, merchandising, and restocking waves.',
    communications: 'Communications',
    communicationsDesc: 'Store briefings, promotional launch notices, and compliance directives.',
    commTitle: 'Title & Summary',
    commDueDate: 'Due Date',
    commAction: 'Status / Action',
    commViewAttachment: 'View Document Brief',
    myNotes: 'My Tasks & Notes',
    myTasksNotes: 'My Tasks & Notes',
    myNotesDesc: 'Personal shift checklist and quick scratchpad.',
    typeNewNote: 'Type a new shift note or reminder...',
    addNote: 'Add Note',
    snooze: 'Snooze 2h',
    snoozedFor2Hours: 'Snoozed for 2 hours',
    completeTask: 'Complete',
    completedBy: 'Completed by',
    highPriority: 'High Priority',
    save: 'Save',
    delete: 'Delete',
    
    quickPriorityTitle: 'Shift Priority Overview',
    urgentAlert: 'Urgent Alert',
    todayTasks: "Today's Tasks",
    efficiencyRate: 'Store QA Rate',
    jumpToUrgent: 'Jump to Urgent',
    
    addTaskTitle: 'Add Task',
    taskTitleLabel: 'Task Title',
    taskTitlePlaceholder: 'Enter task title',
    descLabel: 'Description',
    descPlaceholder: 'Enter task details...',
    categoryLabel: 'Category',
    categorySelect: 'Select a category',
    customCategoryPrompt: 'Type custom category name...',
    dueDateLabel: 'Due Date',
    priorityLabel: 'Priority',
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    priorityUrgent: 'Urgent',
    repeatLabel: 'Repeat',
    repeatNone: 'None',
    repeatDaily: 'Daily',
    repeatWeekly: 'Weekly',
    repeatMonthly: 'Monthly',
    isUrgentToggle: 'Is urgent task',
    isUrgentDesc: 'Flag this task for immediate attention.',
    notifToggle: 'Notifications',
    notifDesc: 'Get reminded before task is due.',
    timing15m: '15 mins before',
    timing30m: '30 mins before',
    timing1h: '1 hour before',
    timing1d: '1 day before',
    btnCreateTask: 'Create Task',
    btnCancel: 'Cancel',
    
    mediaGallery: 'Media & Evidence Gallery',
    mediaDesc: 'Store audit photos, proof of execution, and compliance evidence',
    uploadPhoto: 'Upload Photo',
    noMediaFound: 'No photos uploaded yet. Upload pictures or attach photo proofs to tasks.',
    allMedia: 'All Media',
    filterByTask: 'Tasks',
    filterByUrgent: 'Urgent Actions',
    filterByComm: 'Comms',
    photoEvidence: 'Photo Evidence',
    
    accountTitle: 'Account & Associate Profile',
    editProfile: 'Edit Profile',
    logout: 'Logout Shift',
    appearanceTitle: 'Appearance & Theme',
    languageTitle: 'Language Preference',
    primaryLanguage: 'Primary Language',
    pushNotifs: 'Push Notifications',
    pushNotifsDesc: 'Alerts for high-priority tasks & urgent compliance',
    dailySummary: 'Daily Summary',
    dailySummaryDesc: 'End of shift handover report',
    soundVibration: 'Sound & Haptic Feedback',
    soundVibrationDesc: 'Audio chime and tactile feedback on barcode scan',
    testSound: 'Test Chime',
    systemTitle: 'System & Diagnostics',
    activityHistory: 'Activity History',
    clearCache: 'Clear Cache',
    clearCacheDesc: 'Free up local scanner storage & reset defaults',
    dataSyncStatus: 'Data Sync Status',
    syncedJustNow: 'Synced Just Now',
    aboutTitle: 'About TASKN',
    appVersion: 'App Version',
    appDescription: 'TASKN is the enterprise store task management system designed to streamline retail operations, audit compliance, and team productivity.',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    saveChanges: 'Save Changes',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    rolePosition: 'Role / Position',
    storeBranch: 'Store Branch',
    avatarUrl: 'Avatar URL',
    branchMetroCentral: 'Branch #402 (Metro Central)',
    branchDowntown: 'Branch #108 (Downtown Flagship)',
    branchEastHub: 'Branch #225 (East Hub)',
    
    achievementsTitle: 'Operational Badges & Streaks',
    speedScannerBadge: 'Speed Scanner (Top 5%)',
    qaChampionBadge: '100% QA Champion',
    safetyLeaderBadge: 'Store Safety Lead',
    hardwareTitle: 'Connected Store Hardware',
    scannerBattery: 'Barcode Scanner Battery',
    nfcStatus: 'NFC Station Bridge',
    
    activityTitle: 'Activity History',
    last24Hours: 'Last 24 Hours • Review recent store updates and shift actions.',
    filterAll: 'All Activities',
    filterCompleted: 'Completed',
    filterUpdated: 'Updated',
    filterSnoozed: 'Snoozed',
    filterNotes: 'Notes',
    noActivity: 'No activity records found matching this filter.',
    
    toastTaskAdded: 'New task created successfully!',
    toastTaskCompleted: 'Task marked as completed!',
    toastTaskReopened: 'Task reopened.',
    toastCacheCleared: 'Local scanner cache reset to defaults!',
    toastSettingsSaved: 'Settings saved successfully!',
    toastProfileUpdated: 'Associate profile updated!',
    toastSynced: 'Store telemetry synced with central server!',
  },

  Nepali: {
    appTitle: 'टास्क-एन सञ्चालन (TASKN)',
    tagline: 'स्टोर सञ्चालन र कार्य व्यवस्थापन',
    navDashboard: 'ड्यासबोर्ड',
    navAddTask: 'कार्य थप्नुहोस्',
    navMedia: 'मिडिया (Media)',
    navSettings: 'सेटिङहरू / प्रोफाइल',
    navActivity: 'गतिविधि इतिहास',
    themeToggle: 'थिम परिवर्तन',
    themeLight: 'उज्यालो (Light)',
    themeDark: 'अध्यारो (Dark)',
    themeAuto: 'स्वतः (System)',
    quickAdd: '+ नयाँ कार्य',
    notifications: 'सूचनाहरू',
    markAllRead: 'सबै पढिएको चिन्ह लगाउनुहोस्',
    
    calendarTitle: 'स्टोर सञ्चालन क्यालेन्डर',
    calendarModeAD: 'अंग्रेजी क्यालेन्डर (AD)',
    calendarModeBS: 'नेपाली क्यालेन्डर (BS)',
    calendarModeDual: 'दोहोरो / हाइब्रिड (AD + BS)',
    calendarViewPreference: 'क्यालेन्डर दृश्य प्राथमिकता',
    monthAugust: 'अगस्ट २०२६',
    today: 'आज',
    legend: 'संकेत विवरण',
    sun: 'आइत',
    mon: 'सोम',
    tue: 'मङ्गल',
    wed: 'बुध',
    thu: 'बिही',
    fri: 'शुक्र',
    sat: 'शनि',
    tasksDueOnDay: 'यस दिनका निर्धारित कार्यहरू',
    noTasksForDay: 'यस दिनको लागि कुनै जरुरी कार्य छैन।',
    urgentBadge: 'जरुरी कार्य',
    pendingBadge: 'बाँकी कार्य',
    completedBadge: 'सम्पन्न',
    
    urgentActions: 'जरुरी कार्यहरू (Urgent Actions)',
    urgentActionsDesc: 'तुरुन्तै ध्यान दिनुपर्ने समय-संवेदनशील कार्यहरू।',
    urgentTasksPending: 'जरुरी कार्यहरू बाँकी',
    tasks: 'कार्यहरू (Tasks)',
    generalTasks: 'सामान्य कार्यहरू (Tasks)',
    generalTasksDesc: 'विभागस्तरीय सञ्चालन, सामान पुनर्भण्डारण र चेकलिस्ट।',
    communications: 'सञ्चार र परिपत्रहरू (Communications)',
    communicationsDesc: 'स्टोर ब्रिफिङ, योजना र नीति निर्देशनहरू।',
    commTitle: 'शीर्षक र विवरण',
    commDueDate: 'अन्तिम मिति',
    commAction: 'स्थिति / कार्य',
    commViewAttachment: 'कागजात हेर्नुहोस्',
    myNotes: 'मेरा टिपोटहरू (My Notes)',
    myTasksNotes: 'मेरा कार्य र टिपोटहरू',
    myNotesDesc: 'व्यक्तिगत सिफ्ट चेकलिस्ट र द्रुत टिपोट।',
    typeNewNote: 'नयाँ टिपोट यहाँ लेख्नुहोस्...',
    addNote: 'टिपोट थप्नुहोस्',
    snooze: '२ घण्टा पछि सार्नुहोस्',
    snoozedFor2Hours: '२ घण्टाको लागि रोकियो',
    completeTask: 'सम्पन्न गर्नुहोस्',
    completedBy: 'सम्पन्नकर्ता:',
    highPriority: 'उच्च प्राथमिकता',
    save: 'सुरक्षित गर्नुहोस्',
    delete: 'हटाउनुहोस्',
    
    quickPriorityTitle: 'सिफ्ट प्राथमिकता सारांश',
    urgentAlert: 'जरुरी चेतावनी',
    todayTasks: 'आजका कार्यहरू',
    efficiencyRate: 'सञ्चालन दर',
    jumpToUrgent: 'जरुरी कार्यमा जानुहोस्',
    
    addTaskTitle: 'नयाँ कार्य थप्नुहोस्',
    taskTitleLabel: 'कार्यको शीर्षक',
    taskTitlePlaceholder: 'कार्यको नाम लेख्नुहोस्',
    descLabel: 'विवरण',
    descPlaceholder: 'कार्य सम्बन्धी थप विवरण लेख्नुहोस्...',
    categoryLabel: 'वर्ग (Category)',
    categorySelect: 'वर्ग चयन गर्नुहोस्',
    customCategoryPrompt: 'नयाँ वर्गको नाम लेख्नुहोस्...',
    dueDateLabel: 'अन्तिम मिति',
    priorityLabel: 'प्राथमिकता',
    priorityLow: 'न्यून (Low)',
    priorityMedium: 'मध्यम (Medium)',
    priorityHigh: 'उच्च (High)',
    priorityUrgent: 'अति जरुरी (Urgent)',
    repeatLabel: 'दोहोरिने',
    repeatNone: 'हुँदैन',
    repeatDaily: 'दैनिक',
    repeatWeekly: 'साप्ताहिक',
    repeatMonthly: 'मासिक',
    isUrgentToggle: 'के यो जरुरी कार्य हो?',
    isUrgentDesc: 'यस कार्यलाई तत्काल ध्यानाकर्षणका लागि चिन्ह लगाउनुहोस्।',
    notifToggle: 'सूचना (Notifications)',
    notifDesc: 'समय आउनुअघि रिमाइन्डर प्राप्त गर्नुहोस्।',
    timing15m: '१५ मिनेट अगाडि',
    timing30m: '३० मिनेट अगाडि',
    timing1h: '१ घण्टा अगाडि',
    timing1d: '१ दिन अगाडि',
    btnCreateTask: 'कार्य सिर्जना गर्नुहोस्',
    btnCancel: 'रद्द गर्नुहोस्',
    
    mediaGallery: 'मिडिया र प्रमाण ग्यालरी',
    mediaDesc: 'सबै अपलोड गरिएका फोटोहरू, भिजुअल प्रमाण र अनुपालन क्याप्चरहरू',
    uploadPhoto: 'फोटो अपलोड गर्नुहोस्',
    noMediaFound: 'हालसम्म कुनै फोटो अपलोड गरिएको छैन।',
    allMedia: 'सबै मिडिया',
    filterByTask: 'कार्यहरू',
    filterByUrgent: 'जरुरी कार्यहरू',
    filterByComm: 'सूचनाहरू',
    photoEvidence: 'फोटो प्रमाण',
    
    accountTitle: 'खाता र प्रोफाइल',
    editProfile: 'प्रोफाइल सम्पादन',
    logout: 'लगआउट गर्नुहोस्',
    appearanceTitle: 'रंग र स्वरूप',
    languageTitle: 'भाषा चयन (Language)',
    primaryLanguage: 'मुख्य भाषा',
    pushNotifs: 'पुस सूचनाहरू',
    pushNotifsDesc: 'उच्च प्राथमिकताका कार्यहरूको अलर्ट',
    dailySummary: 'दैनिक सारांश',
    dailySummaryDesc: 'सिफ्ट अन्त्यको प्रतिवेदन',
    soundVibration: 'ध्वनि र कम्पन',
    soundVibrationDesc: 'स्क्यान गर्दा ध्वनि संकेत बज्ने',
    testSound: 'ध्वनि परीक्षण',
    systemTitle: 'प्रणाली सेटिङ',
    activityHistory: 'गतिविधि इतिहास',
    clearCache: 'क्यास खाली गर्नुहोस्',
    clearCacheDesc: 'लोकल डाटा रिसेट गरी नयाँ बनाउनुहोस्',
    dataSyncStatus: 'डाटा सिङ्क स्थिति',
    syncedJustNow: 'भर्खरै सिङ्क भयो',
    aboutTitle: 'TASKN बारे',
    appVersion: 'एप संस्करण',
    appDescription: 'TASKN खुद्रा स्टोर सञ्चालन, कार्य व्यवस्थापन र टोली उत्पादकता बढाउन तयार पारिएको प्रणाली हो।',
    termsOfService: 'सेवाका सर्तहरू',
    privacyPolicy: 'गोपनीयता नीति',
    saveChanges: 'परिवर्तन सुरक्षित गर्नुहोस्',
    fullName: 'पूरा नाम',
    emailAddress: 'इमेल ठेगाना',
    rolePosition: 'पद / जिम्मेवारी',
    storeBranch: 'स्टोर शाखा',
    avatarUrl: 'फोटो लिङ्क',
    branchMetroCentral: 'शाखा #४०२ (मेट्रो सेन्ट्रल)',
    branchDowntown: 'शाखा #१०८ (डाउनटाउन)',
    branchEastHub: 'शाखा #२२५ (ईस्ट हब)',
    
    achievementsTitle: 'उपलब्धि ब्याजहरू',
    speedScannerBadge: 'द्रुत स्क्यानर (उत्कृष्ट ५%)',
    qaChampionBadge: '१००% गुणस्तर च्याम्पियन',
    safetyLeaderBadge: 'सुरक्षा नेतृत्व',
    hardwareTitle: 'जडान भएका यन्त्रहरू',
    scannerBattery: 'स्क्यानर ब्याट्री',
    nfcStatus: 'एनएफसी कनेक्सन',
    
    activityTitle: 'गतिविधि इतिहास',
    last24Hours: 'पछिल्लो २४ घण्टाको सञ्चालन विवरण।',
    filterAll: 'सबै गतिविधि',
    filterCompleted: 'सम्पन्न भएका',
    filterUpdated: 'अपडेट भएका',
    filterSnoozed: 'रोकिएका',
    filterNotes: 'टिपोटहरू',
    noActivity: 'यस फिल्टर अनुसार कुनै गतिविधि भेटिएन।',
    
    toastTaskAdded: 'नयाँ कार्य सफलतापूर्वक थपियो!',
    toastTaskCompleted: 'कार्य सम्पन्न भयो!',
    toastTaskReopened: 'कार्य पुनः सुरु गरियो।',
    toastCacheCleared: 'लोकल क्यास रिसेट गरियो!',
    toastSettingsSaved: 'सेटिङहरू सुरक्षित गरियो!',
    toastProfileUpdated: 'प्रोफाइल अपडेट भयो!',
    toastSynced: 'केन्द्रीय सर्भरसँग डाटा सिङ्क भयो!',
  },

  Spanish: {
    appTitle: 'TASKN Operaciones',
    tagline: 'Operaciones de Tienda y Gestión de Tareas',
    navDashboard: 'Panel Principal',
    navAddTask: 'Añadir Tarea',
    navMedia: 'Medios (Media)',
    navSettings: 'Ajustes / Perfil',
    navActivity: 'Historial de Actividad',
    themeToggle: 'Cambiar Tema',
    themeLight: 'Modo Claro',
    themeDark: 'Modo Oscuro',
    themeAuto: 'Automático (Sistema)',
    quickAdd: '+ Nueva Tarea',
    notifications: 'Notificaciones',
    markAllRead: 'Marcar todo leído',
    
    calendarTitle: 'Calendario de Operaciones',
    calendarModeAD: 'Calendario Inglés (AD)',
    calendarModeBS: 'Calendario Nepalí (BS)',
    calendarModeDual: 'Modo Dual (AD + BS)',
    calendarViewPreference: 'Preferencia de Calendario',
    monthAugust: 'Agosto 2026',
    today: 'Hoy',
    legend: 'Leyenda',
    sun: 'Dom',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mié',
    thu: 'Jue',
    fri: 'Vie',
    sat: 'Sáb',
    tasksDueOnDay: 'Tareas programadas para',
    noTasksForDay: 'No hay tareas urgentes programadas para este día.',
    urgentBadge: 'Acción Urgente',
    pendingBadge: 'Tarea Pendiente',
    completedBadge: 'Completado',
    
    urgentActions: 'Acciones Urgentes',
    urgentActionsDesc: 'Tareas críticas que requieren atención inmediata del equipo.',
    urgentTasksPending: 'Tareas urgentes pendientes',
    tasks: 'Tareas',
    generalTasks: 'Tareas Generales',
    generalTasksDesc: 'Operaciones de tienda, reposición y cumplimiento estándar.',
    communications: 'Comunicaciones',
    communicationsDesc: 'Directivas de la tienda, lanzamientos y avisos de cumplimiento.',
    commTitle: 'Título y Resumen',
    commDueDate: 'Fecha Límite',
    commAction: 'Estado / Acción',
    commViewAttachment: 'Ver Documento',
    myNotes: 'Mis Notas y Tareas',
    myTasksNotes: 'Mis Notas y Tareas',
    myNotesDesc: 'Lista rápida personal y recordatorios del turno.',
    typeNewNote: 'Escribe una nueva nota de turno...',
    addNote: 'Añadir Nota',
    snooze: 'Posponer 2h',
    snoozedFor2Hours: 'Pospuesto por 2 horas',
    completeTask: 'Completar',
    completedBy: 'Completado por',
    highPriority: 'Alta Prioridad',
    save: 'Guardar',
    delete: 'Eliminar',
    
    quickPriorityTitle: 'Resumen de Prioridades del Turno',
    urgentAlert: 'Alerta Urgente',
    todayTasks: 'Tareas de Hoy',
    efficiencyRate: 'Tasa de Eficiencia',
    jumpToUrgent: 'Ir a Urgentes',
    
    addTaskTitle: 'Añadir Tarea',
    taskTitleLabel: 'Título de la Tarea',
    taskTitlePlaceholder: 'Ingresa el título de la tarea',
    descLabel: 'Descripción',
    descPlaceholder: 'Detalles de la tarea...',
    categoryLabel: 'Categoría',
    categorySelect: 'Selecciona una categoría',
    customCategoryPrompt: 'Escribe categoría personalizada...',
    dueDateLabel: 'Fecha de Entrega',
    priorityLabel: 'Prioridad',
    priorityLow: 'Baja',
    priorityMedium: 'Media',
    priorityHigh: 'Alta',
    priorityUrgent: 'Urgente',
    repeatLabel: 'Repetir',
    repeatNone: 'Ninguno',
    repeatDaily: 'Diario',
    repeatWeekly: 'Semanal',
    repeatMonthly: 'Mensual',
    isUrgentToggle: 'Es tarea urgente',
    isUrgentDesc: 'Marca esta tarea para atención inmediata.',
    notifToggle: 'Notificaciones',
    notifDesc: 'Recibe recordatorio antes del vencimiento.',
    timing15m: '15 min antes',
    timing30m: '30 min antes',
    timing1h: '1 hora antes',
    timing1d: '1 día antes',
    btnCreateTask: 'Crear Tarea',
    btnCancel: 'Cancelar',
    
    mediaGallery: 'Galería de Medios y Pruebas',
    mediaDesc: 'Fotos de auditoría de la tienda, pruebas de ejecución y evidencia visual',
    uploadPhoto: 'Subir Foto',
    noMediaFound: 'No se han subido fotos todavía.',
    allMedia: 'Todos los Medios',
    filterByTask: 'Tareas',
    filterByUrgent: 'Acciones Urgentes',
    filterByComm: 'Comunicaciones',
    photoEvidence: 'Evidencia Fotográfica',
    
    accountTitle: 'Cuenta y Perfil',
    editProfile: 'Editar Perfil',
    logout: 'Cerrar Sesión de Turno',
    appearanceTitle: 'Apariencia y Tema',
    languageTitle: 'Preferencia de Idioma',
    primaryLanguage: 'Idioma Principal',
    pushNotifs: 'Notificaciones Push',
    pushNotifsDesc: 'Alertas para tareas de alta prioridad',
    dailySummary: 'Resumen Diario',
    dailySummaryDesc: 'Informe al finalizar el turno',
    soundVibration: 'Sonido y Vibración',
    soundVibrationDesc: 'Sonido háptico al escanear código de barras',
    testSound: 'Probar Sonido',
    systemTitle: 'Sistema y Diagnóstico',
    activityHistory: 'Historial de Actividad',
    clearCache: 'Borrar Caché',
    clearCacheDesc: 'Liberar almacenamiento local del escáner',
    dataSyncStatus: 'Estado de Sincronización',
    syncedJustNow: 'Sincronizado Ahora',
    aboutTitle: 'Acerca de TASKN',
    appVersion: 'Versión de la App',
    appDescription: 'TASKN es el sistema de gestión operativa líder para tiendas minoristas.',
    termsOfService: 'Términos de Servicio',
    privacyPolicy: 'Política de Privacidad',
    saveChanges: 'Guardar Cambios',
    fullName: 'Nombre Completo',
    emailAddress: 'Correo Electrónico',
    rolePosition: 'Cargo / Puesto',
    storeBranch: 'Sucursal de Tienda',
    avatarUrl: 'URL de Avatar',
    branchMetroCentral: 'Sucursal #402 (Metro Central)',
    branchDowntown: 'Sucursal #108 (Centro)',
    branchEastHub: 'Sucursal #225 (Centro Este)',
    
    achievementsTitle: 'Insignias y Logros',
    speedScannerBadge: 'Escaneo Rápido (Top 5%)',
    qaChampionBadge: 'Campeón 100% QA',
    safetyLeaderBadge: 'Líder de Seguridad',
    hardwareTitle: 'Dispositivos Conectados',
    scannerBattery: 'Batería del Escáner',
    nfcStatus: 'Puente NFC',
    
    activityTitle: 'Historial de Actividad',
    last24Hours: 'Últimas 24 Horas • Revisa actualizaciones y acciones recientes.',
    filterAll: 'Todas',
    filterCompleted: 'Completadas',
    filterUpdated: 'Actualizadas',
    filterSnoozed: 'Pospuestas',
    filterNotes: 'Notas',
    noActivity: 'No se encontraron registros de actividad con este filtro.',
    
    toastTaskAdded: '¡Nueva tarea creada con éxito!',
    toastTaskCompleted: '¡Tarea marcada como completada!',
    toastTaskReopened: 'Tarea reabierta.',
    toastCacheCleared: '¡Caché local reiniciada con éxito!',
    toastSettingsSaved: '¡Ajustes guardados correctamente!',
    toastProfileUpdated: '¡Perfil actualizado con éxito!',
    toastSynced: '¡Datos sincronizados con el servidor central!',
  },

  French: {
    appTitle: 'Opérations TASKN',
    tagline: 'Opérations en Magasin et Gestion des Tâches',
    navDashboard: 'Tableau de Bord',
    navAddTask: 'Ajouter Tâche',
    navMedia: 'Médias (Media)',
    navSettings: 'Paramètres / Profil',
    navActivity: "Historique d'Activité",
    themeToggle: 'Changer de Thème',
    themeLight: 'Mode Clair',
    themeDark: 'Mode Sombre',
    themeAuto: 'Automatique (Système)',
    quickAdd: '+ Nouvelle Tâche',
    notifications: 'Notifications',
    markAllRead: 'Tout marquer comme lu',
    
    calendarTitle: 'Calendrier des Opérations',
    calendarModeAD: 'Calendrier Anglais (AD)',
    calendarModeBS: 'Calendrier Népalais (BS)',
    calendarModeDual: 'Mode Double (AD + BS)',
    calendarViewPreference: 'Préférence de Calendrier',
    monthAugust: 'Août 2026',
    today: "Aujourd'hui",
    legend: 'Légende',
    sun: 'Dim',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mer',
    thu: 'Jeu',
    fri: 'Ven',
    sat: 'Sam',
    tasksDueOnDay: 'Tâches prévues pour',
    noTasksForDay: "Aucune tâche urgente prévue aujourd'hui.",
    urgentBadge: 'Action Urgente',
    pendingBadge: 'Tâche en Attente',
    completedBadge: 'Terminé',
    
    urgentActions: 'Actions Urgentes',
    urgentActionsDesc: 'Tâches critiques nécessitant une attention immédiate.',
    urgentTasksPending: 'Tâches urgentes en attente',
    tasks: 'Tâches',
    generalTasks: 'Tâches Générales',
    generalTasksDesc: 'Opérations de rayon, réassortiment et conformité.',
    communications: 'Communications',
    communicationsDesc: 'Directives magasin, lancements et avis de sécurité.',
    commTitle: 'Titre & Résumé',
    commDueDate: 'Date Limite',
    commAction: 'Statut / Action',
    commViewAttachment: 'Voir Document',
    myNotes: 'Mes Notes & Tâches',
    myTasksNotes: 'Mes Notes & Tâches',
    myNotesDesc: 'Mémo personnel de service et rappels rapides.',
    typeNewNote: 'Tapez une nouvelle note de service...',
    addNote: 'Ajouter Note',
    snooze: 'Reporter 2h',
    snoozedFor2Hours: 'Reporté de 2 heures',
    completeTask: 'Terminer',
    completedBy: 'Terminé par',
    highPriority: 'Haute Priorité',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    
    quickPriorityTitle: 'Priorités du Service',
    urgentAlert: 'Alerte Urgente',
    todayTasks: "Tâches d'Aujourd'hui",
    efficiencyRate: 'Taux de Conformité',
    jumpToUrgent: 'Aller aux Urgences',
    
    addTaskTitle: 'Ajouter une Tâche',
    taskTitleLabel: 'Titre de la Tâche',
    taskTitlePlaceholder: 'Entrez le titre de la tâche',
    descLabel: 'Description',
    descPlaceholder: 'Détails de la tâche...',
    categoryLabel: 'Catégorie',
    categorySelect: 'Sélectionnez une catégorie',
    customCategoryPrompt: 'Nom de la catégorie personnalisée...',
    dueDateLabel: 'Date Limite',
    priorityLabel: 'Priorité',
    priorityLow: 'Basse',
    priorityMedium: 'Moyenne',
    priorityHigh: 'Haute',
    priorityUrgent: 'Urgente',
    repeatLabel: 'Répéter',
    repeatNone: 'Aucune',
    repeatDaily: 'Quotidien',
    repeatWeekly: 'Hebdomadaire',
    repeatMonthly: 'Mensuel',
    isUrgentToggle: 'Tâche urgente',
    isUrgentDesc: 'Signaler cette tâche pour attention immédiate.',
    notifToggle: 'Notifications',
    notifDesc: 'Recevoir un rappel avant échéance.',
    timing15m: '15 min avant',
    timing30m: '30 min avant',
    timing1h: '1 heure avant',
    timing1d: '1 jour avant',
    btnCreateTask: 'Créer la Tâche',
    btnCancel: 'Annuler',
    
    mediaGallery: 'Galerie Médias & Preuves',
    mediaDesc: 'Photos d’audit du magasin, preuves d’exécution et contrôles de conformité',
    uploadPhoto: 'Télécharger Photo',
    noMediaFound: 'Aucune photo téléchargée pour le moment.',
    allMedia: 'Tous les Médias',
    filterByTask: 'Tâches',
    filterByUrgent: 'Actions Urgentes',
    filterByComm: 'Communications',
    photoEvidence: 'Preuve Photographique',
    
    accountTitle: 'Compte & Profil Collaborateur',
    editProfile: 'Modifier Profil',
    logout: 'Déconnexion',
    appearanceTitle: 'Apparence & Thème',
    languageTitle: 'Langue Principale',
    primaryLanguage: 'Langue Choisie',
    pushNotifs: 'Notifications Push',
    pushNotifsDesc: 'Alertes pour tâches prioritaires',
    dailySummary: 'Résumé Quotidien',
    dailySummaryDesc: 'Rapport en fin de service',
    soundVibration: 'Son & Vibration',
    soundVibrationDesc: 'Retour sonore et haptique lors du scan',
    testSound: 'Tester le Son',
    systemTitle: 'Système & Diagnostic',
    activityHistory: "Historique d'Activité",
    clearCache: 'Vider le Cache',
    clearCacheDesc: 'Réinitialiser la mémoire locale du scanner',
    dataSyncStatus: 'État de Synchronisation',
    syncedJustNow: 'Synchronisé à l’Instant',
    aboutTitle: 'À Propos de TASKN',
    appVersion: 'Version de l’Application',
    appDescription: 'TASKN est la solution d’excellence pour le pilotage des opérations en magasin.',
    termsOfService: 'Conditions d’Utilisation',
    privacyPolicy: 'Politique de Confidentialité',
    saveChanges: 'Enregistrer',
    fullName: 'Nom Complet',
    emailAddress: 'Adresse Email',
    rolePosition: 'Rôle / Poste',
    storeBranch: 'Magasin / Succursale',
    avatarUrl: 'URL de l’Avatar',
    branchMetroCentral: 'Magasin #402 (Metro Central)',
    branchDowntown: 'Magasin #108 (Centre-Ville)',
    branchEastHub: 'Magasin #225 (Pôle Est)',
    
    achievementsTitle: 'Badges & Récompenses',
    speedScannerBadge: 'Scanner Rapide (Top 5%)',
    qaChampionBadge: 'Champion 100% Qualité',
    safetyLeaderBadge: 'Responsable Sécurité',
    hardwareTitle: 'Matériel Connecté',
    scannerBattery: 'Batterie du Scanner',
    nfcStatus: 'Passerelle NFC',
    
    activityTitle: "Historique d'Activité",
    last24Hours: 'Dernières 24 Heures • Consultez les mises à jour récentes.',
    filterAll: 'Toutes',
    filterCompleted: 'Terminées',
    filterUpdated: 'Mises à jour',
    filterSnoozed: 'Reportées',
    filterNotes: 'Notes',
    noActivity: 'Aucune activité trouvée avec ce filtre.',
    
    toastTaskAdded: 'Nouvelle tâche créée avec succès !',
    toastTaskCompleted: 'Tâche marquée comme terminée !',
    toastTaskReopened: 'Tâche réouverte.',
    toastCacheCleared: 'Cache local réinitialisé !',
    toastSettingsSaved: 'Paramètres enregistrés !',
    toastProfileUpdated: 'Profil mis à jour !',
    toastSynced: 'Données synchronisées avec le serveur !',
  },
};
