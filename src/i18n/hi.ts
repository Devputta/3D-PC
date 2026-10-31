/**
 * Boardwalk — Hindi Translation Bundle
 *
 * Keeps all technical terminology (CPU, RAM, SSD, GPU, Motherboard, PCIe, BIOS,
 * Router, Switch, Firewall, DNS, DHCP, WAN, LAN, ping, ipconfig, tracert, nslookup,
 * DDR4, DDR5, NVMe, SATA, HDD) strictly in English letters as required.
 */

import { TranslationSchema } from './types.ts';

export const hi: TranslationSchema = {
  header: {
    brandName: 'LEARN PC & NETWORKS',
    brandTagline: 'EXPLORE · UNDERSTAND · BUILD',
    sectionBasics: 'BASICS',
    progressCount: (done: number, total: number) => `${done}/${total}`,
    modes: {
      explore: 'Explore',
      journey: 'Journey',
      quiz: 'Quiz',
      build: 'Build'
    },
    languageLabel: 'भाषा',
    compareBtn: 'Compare',
    shareQuizBtn: 'Custom Quiz'
  },
  rail: {
    collapse: 'साइडबार छोटा करें',
    expand: 'साइडबार खोलें',
    home: 'Home (Reset View)',
    learn: 'Lessons & Journey',
    packSwitchHardware: 'Networking पैक पर जाएं',
    packSwitchNetworking: 'PC Hardware पैक पर जाएं',
    quiz: 'Interactive Quiz',
    build: 'Assembly Workbench',
    settings: 'Tools & Utilities',
    language: 'भाषा बदलें',
    credit: 'Boardwalk v2'
  },
  toolbar: {
    undo: 'कैमरा दृश्य पूर्ववत करें (Undo)',
    redo: 'कैमरा दृश्य पुनः करें (Redo)',
    zoomOut: 'ज़ूम आउट करें',
    zoomIn: 'ज़ूम इन करें',
    info: 'विवरण चालू/बंद करें',
    labels: '3D लेबल्स चालू/बंद करें',
    dataFlow: 'डेटा प्रवाह एनीमेशन चालू/बंद करें'
  },
  tabs: {
    overview: 'OVERVIEW',
    ports: 'PORTS & CONNECTIONS',
    example: 'EXAMPLE',
    specs: 'SPECIFICATIONS',
    expand: 'बड़ा करें',
    collapse: 'छोटा करें'
  },
  tryIt: {
    title: 'TRY IT YOURSELF',
    runBtn: '3D में Run करें',
    runningBtn: 'प्रसारित हो रहा है...',
    copyBtn: 'कोड कॉपी करें',
    copiedNotice: 'कॉपी हो गया!',
    simNotice: '3D दृश्य में सिग्नल एनीमेशन चल रहा है'
  },
  lessons: {
    stripTitle: 'LESSONS',
    scrollLeft: 'बाएँ स्क्रॉल करें',
    scrollRight: 'दाएँ स्क्रॉल करें',
    lessonNumber: (num: number) => `0${num}`,
    completedBadge: 'पूर्ण'
  },
  sheet: {
    pickPartTitle: 'एक घटक चुनें',
    pickPartInstruction: '3D बोर्ड पर किसी भी घटक या टैग पर क्लिक करें और उसकी तकनीकी संरचना और कनेक्शन देखें।',
    partCounter: (current: number, total: number) => `घटक ${current} / ${total}`,
    compareWithOthers: 'PC Hardware मानकों की तुलना करें',
    typicalNumbers: 'मुख्य विनिर्देश (Specifications)',
    whenItGoesWrong: 'समस्या आने पर क्या होता है',
    personalNotes: 'व्यक्तिगत नोट्स',
    notesPlaceholder: 'अपने अवलोकन, पिनआउट या कक्षा के नोट्स लिखें...',
    notesSaved: 'ब्राउज़र में सहेजा गया',
    notesSavedBrowser: 'नोट्स आपके स्थानीय ब्राउज़र में सहेजे गए हैं',
    printNotesBtn: 'Study Notes प्रिंट करें',
    askAboutPart: 'इस भाग के बारे में पूछें',
    askPlaceholder: (partName: string) => `${partName} के बारे में प्रश्न पूछें...`,
    askButton: 'प्रश्न पूछें',
    consultingButton: 'परामर्श जारी है...',
    aiDisclaimer: 'AI उत्तर, भरोसा करने से पहले जाँच लें',
    aiAnswerQuestion: 'प्रश्न:',
    stepCounter: (current: number, total: number) => `चरण ${current} / ${total}`,
    activeComponent: 'सक्रिय घटक',
    backStepBtn: 'पीछे',
    nextStepBtn: 'अगला चरण',
    startAgainBtn: 'पुनः प्रारंभ करें',
    sessionResults: 'सत्र परिणाम',
    quizComplete: 'Quiz समाप्त हुआ',
    bestScore: (score: number, total: number) => `सर्वश्रेष्ठ स्कोर: ${score} / ${total}`,
    allCorrect: 'सभी घटकों की सही पहचान की गई।',
    partialScore: (score: number, total: number) => `${total} में से ${score} घटकों की सही पहचान की।`,
    answersBreakdown: 'उत्तरों का विवरण',
    retakeQuizBtn: 'Quiz पुनः दें',
    backToExploreBtn: 'वापस Explore पर जाएं',
    clueLabel: 'संकेत (Clue)',
    instructionClick: '3D दृश्य में संबंधित घटक पर क्लिक करें।',
    skipQuestionBtn: 'छोड़ें (Skip)',
    nextQuestionBtn: 'अगला प्रश्न'
  },
  build: {
    title: (packName: string) => `${packName} Assembly`,
    lede: 'ट्रे से प्रत्येक घटक को मदरबोर्ड के सही स्लॉट पर खींचें। असंगत घटकों को कारण सहित अस्वीकार कर दिया जाएगा।',
    summaryTitle: 'Assembly पूर्ण हुई',
    summaryLede: 'सभी प्राथमिक स्लॉट स्थापित और संगतता के लिए सत्यापित हैं।',
    restartBtn: 'पुनः प्रारंभ करें',
    inspectBtn: '3D में देखें',
    trayTitle: 'Component Tray',
    slotsTitle: 'Target Slots & Ports',
    dropHint: 'स्थापित करने के लिए ड्रैग या क्लिक करें'
  },
  welcome: {
    title: 'LEARN PC & NETWORKS',
    welcomeMsg: '3D Blueprint Workbench में आपका स्वागत है',
    description: 'मदरबोर्ड इलेक्ट्रॉनिक्स और नेटवर्किंग उपकरणों को रीयल-टाइम 3D में समझें। हाई-स्पीड बस, पैकेट प्रवाह और असेंबली नियमों का अनुभव करें।',
    startBtn: 'शुरू करें',
    dontShowAgain: 'दोबारा न दिखाएं',
    closeBtn: 'बंद करें'
  },
  compare: {
    modalTitle: 'Hardware Architecture Compare',
    modalSubtitle: 'सामान्य PC Hardware मानकों का प्रत्यक्ष साइड-बाय-साइड तकनीकी मूल्यांकन।',
    keyNumbers: 'मुख्य विनिर्देश',
    verdictTitle: 'संरचना सारांश',
    whenToChoose: 'किसे कब चुनें:',
    closeBtn: 'तुलना बंद करें'
  },
  customQuiz: {
    modalTitle: 'Custom Quiz & Shareable Link',
    modalSubtitle: 'अधिकतम 8 घटकों को चुनकर एक लिंक बनाएं जो बिना किसी बैकएंड के सीधे खुलता है।',
    selectHint: 'परीक्षण के लिए भाग चुनें:',
    selectedCount: (count: number, max: number) => `चयनित: ${max} में से ${count} भाग`,
    copyLinkBtn: 'शेयर करने योग्य लिंक कॉपी करें',
    copiedNotice: 'लिंक क्लिपबोर्ड पर कॉपी हो गया',
    startCustomQuizBtn: 'Custom Quiz शुरू करें',
    closeBtn: 'बंद करें',
    noPartsSelected: 'Quiz लिंक बनाने के लिए कम से कम 1 भाग चुनें।'
  },
  tools: {
    modalTitle: 'Workbench Tools & Utilities',
    modalSubtitle: 'कंप्यूटर आर्किटेक्चर अध्ययन के लिए संवादात्मक संदर्भ उपकरण।',
    compareTitle: 'Hardware Architecture Comparison',
    compareDesc: 'DDR4 vs DDR5, NVMe vs SATA, और HDD vs SSD का तकनीकी विश्लेषण।',
    quizTitle: 'Custom Quiz Generator',
    quizDesc: 'विशिष्ट घटकों का चयन करके साझा करने योग्य लिंक बनाएं।',
    printTitle: 'Printable Study Notes',
    printDesc: 'घटक सारांश और व्यक्तिगत नोट्स को प्रिंट या PDF में निर्यात करें।',
    closeBtn: 'उपकरण बंद करें'
  },
  meta: {
    reviewPendingNotice: 'समीक्षा लंबित',
    needsReview: true
  }
};
