/**
 * Boardwalk — i18n Context and Hooks
 *
 * Provides reactive language state across the entire application,
 * with localStorage persistence under key `boardwalk_lang`.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { en } from './en.ts';
import { hi } from './hi.ts';
import { Language, TranslationSchema } from './types.ts';

export * from './types.ts';
export { en } from './en.ts';
export { hi } from './hi.ts';

const STORAGE_KEY = 'boardwalk_lang';

const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en,
  hi
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  isHindi: boolean;
  needsReview: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en,
  isHindi: false,
  needsReview: false
});

export function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'hi') {
      return saved;
    }
    return 'en';
  } catch {
    return 'en';
  }
}

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Fail gracefully
  }
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());

  const setLanguage = (nextLang: Language) => {
    setLanguageState(nextLang);
    setStoredLanguage(nextLang);
    document.documentElement.lang = nextLang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = TRANSLATIONS[language] || en;

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isHindi: language === 'hi',
        needsReview: t.meta.needsReview
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  return useContext(I18nContext);
}
