import React, { createContext, useContext, useState, useCallback } from 'react';

interface TextSelectionContextType {
  selectedText: string | null;
  selectionPosition: { x: number; y: number } | null;
  selectionType: 'word' | 'phrase' | null;
  showTooltip: (text: string, x: number, y: number) => void;
  hideTooltip: () => void;
  lookupWord: (text: string) => void;
  translatePhrase: (text: string) => void;
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
  const [selectionType, setSelectionType] = useState<'word' | 'phrase' | null>(null);

  const isWordBoundary = useCallback((char: string): boolean => {
    // For languages with spaces (most languages)
    if (/\s/.test(char)) return true;
    
    // For CJK characters (Chinese, Japanese, Korean)
    // Each CJK character is typically a word boundary
    if (/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(char)) {
      return true;
    }
    
    // Punctuation marks
    if (/[.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/.test(char)) return true;
    
    return false;
  }, []);

  const countWords = useCallback((text: string): number => {
    const cleaned = text.replace(/[^\w\s\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, '').trim();
    
    if (!cleaned) return 0;
    
    // Count CJK characters as individual words
    const cjkCount = (cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || []).length;
    
    // Count space-separated words (excluding CJK characters)
    const nonCjkText = cleaned.replace(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, '');
    const spaceWords = nonCjkText.trim() ? nonCjkText.trim().split(/\s+/).length : 0;
    
    return cjkCount + spaceWords;
  }, []);

  const showTooltip = useCallback((text: string, x: number, y: number) => {
    const wordCount = countWords(text);
    const type = wordCount === 1 ? 'word' : 'phrase';
    
    setSelectedText(text);
    setSelectionPosition({ x, y });
    setSelectionType(type);
  }, [countWords]);

  const hideTooltip = useCallback(() => {
    setSelectedText(null);
    setSelectionPosition(null);
    setSelectionType(null);
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
  }, [hideTooltip]);

  const translatePhrase = useCallback((text: string) => {
    // Clean the text by removing excessive punctuation but keeping essential formatting
    const cleanText = text.replace(/[^\w\s\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af'"-]/g, '').trim();
    
    if (cleanText) {
      // Create URL for translation in new tab
      const translateUrl = `/app?tab=translate&sentence=${encodeURIComponent(cleanText)}`;
      window.open(translateUrl, '_blank');
    }
    
    hideTooltip();
  }, [hideTooltip]);

  const value = {
    selectedText,
    selectionPosition,
    selectionType,
    showTooltip,
    hideTooltip,
    lookupWord,
    translatePhrase,
  };

  return (
    <TextSelectionContext.Provider value={value}>
      {children}
    </TextSelectionContext.Provider>
  );
};