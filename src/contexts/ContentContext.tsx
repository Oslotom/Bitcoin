import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContentData {
  homeHeroTitle: string;
  homeHeroDescription: string;
  comparePriceTitle: string;
  livePricesTitle: string;
  livePricesDescription: string;
  faqHeroTitle: string;
  faqDescription: string;
  [key: string]: string; // Allow for more keys
}

const DEFAULT_CONTENT: ContentData = {
  homeHeroTitle: 'Finn den beste prisen på Bitcoin i Norge!',
  homeHeroDescription: 'Vi henter live kurser sjekket mot spredning og gebyrer fra alle norske og internasjonale børser i sanntid, slik at du alltid vet hvor du gjøres det billigste kjøpet.',
  comparePriceTitle: 'Sammenlign pris',
  livePricesTitle: 'Live Priser',
  livePricesDescription: 'Sanntidssammenligning av børser',
  faqHeroTitle: 'Hva bør du vurdere når du skal kjøpe Bitcoin i Norge?',
  faqDescription: 'Når du sammenligner kryptobørser, er det fort gjort å kun se på handelsgebyret. For å finne den billigste måten å kjøpe Bitcoin på, må du ta tre kritiske faktorer i betraktning:',
};

interface ContentContextType {
  content: ContentData;
  updateContent: (key: string, value: string) => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  saveContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('site-content');
    if (saved) {
      try {
        setContent({ ...DEFAULT_CONTENT, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to parse saved content', e);
      }
    }
  }, []);

  const updateContent = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const saveContent = () => {
    localStorage.setItem('site-content', JSON.stringify(content));
    setIsEditMode(false);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, isEditMode, setIsEditMode, saveContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
