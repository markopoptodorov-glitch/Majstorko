import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';

const LANG_KEY = 'nm_lang';
const LanguageContext = createContext(null);

function getInitialLang() {
  const stored = localStorage.getItem(LANG_KEY);
  return stored === 'en' || stored === 'mk' ? stored : 'mk';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.title = translations[lang]['meta.title'];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', translations[lang]['meta.description']);
  }, [lang]);

  function t(key, params) {
    let str = translations[lang]?.[key] ?? translations.mk[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replaceAll(`{{${k}}}`, v);
      }
    }
    return str;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
