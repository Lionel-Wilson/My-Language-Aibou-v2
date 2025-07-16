import React, { createContext, useContext, useState, useCallback } from 'react';

interface TextSelectionContextType {
  selectedText: string | null;
  selectionPosition: { x: number; y: number } | null;
  showTooltip: (text: string, x: number, y: number) => void;
  hideTooltip: () => void;
  lookupWord: (text: string) => void;
}

const TextSelectionContext = createContext<TextSelectionContextType | undefined>(undefined);

export const useTextSelection = () => {
  const context = useContext(TextSelectionContext);
  if (!context) {
    throw new Error('useTextSelection must be used within a TextSelectionProvider');
  }
  return context;
};

interface TextSelectionProviderProps {
  children: React.ReactNode;
  currentLanguage: string;
}

export const TextSelectionProvider: React.FC<TextSelectionProviderProps> = ({ 
  children, 
  currentLanguage 
}) => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);

  const showTooltip = useCallback((text: string, x: number, y: number) => {
    setSelectedText(text);
    setSelectionPosition({ x, y });
  }, []);

  const hideTooltip = useCallback(() => {
    setSelectedText(null);
    setSelectionPosition(null);
  }, []);

  const lookupWord = useCallback((text: string) => {
    // Clean the text by removing punctuation and formatting
    const cleanText = text.replace(/[^\w\s-']/g, '').trim();
    
    if (cleanText) {
      // Create URL for dictionary lookup in new tab
      const dictionaryUrl = `/app?tab=dictionary&word=${encodeURIComponent(cleanText)}`;
      window.open(dictionaryUrl, '_blank');
    }
    
    hideTooltip();
  }
  )

  const value = {
    selectedText,
    selectionPosition,
    showTooltip,
    hideTooltip,
    lookupWord,
  };

  return (
    <TextSelectionContext.Provider value={value}>
      {children}
    </TextSelectionContext.Provider>
  );
};