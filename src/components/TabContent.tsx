import React from 'react';
import { InputForm } from './InputForm';
import { ResponseArea } from './ResponseArea';
import { ApiService } from '../services/api';
import { HistoryItem } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface TabState {
  input: string;
  language: string;
  response: string;
  loading: boolean;
  error: string | null;
}
interface TabContentProps {
  activeTab: string;
  onAddToHistory: (item: HistoryItem) => void;
  tabState: TabState;
  onUpdateTabState: (updates: Partial<TabState>) => void;
  t: ReturnType<typeof useTranslation>['t'];
}

export const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  onAddToHistory, 
  tabState, 
  onUpdateTabState,
  t
}) => {

  const handleSubmit = async (input: string, language: string) => {
    onUpdateTabState({ 
      loading: true, 
      error: null, 
      response: '',
      input,
      language 
    });

    try {
      let result = '';
      
      switch (activeTab) {
        case 'dictionary':
          // Call all three word endpoints simultaneously
          const [definition, synonyms, history] = await Promise.all([
            ApiService.getDefinition(input, language),
            ApiService.getSynonyms(input, language),
            ApiService.getWordHistory(input, language)
          ]);
          
          result = `## Definition\n\n${definition}\n\n## Synonyms\n\n${synonyms}\n\n## Word History\n\n${history}`;
          break;
        case 'analyse':
          result = await ApiService.explainSentence(input, language);
          break;
        case 'correction':
          result = await ApiService.correctSentence(input, language);
          break;
        default:
          throw new Error('Invalid tab');
      }

      onUpdateTabState({ response: result, loading: false });
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        type: activeTab as HistoryItem['type'],
        query: input,
        response: result,
        timestamp: Date.now(),
        language,
      };
      
      onAddToHistory(historyItem);
    } catch (err) {
      onUpdateTabState({ 
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false 
      });
    }
  };

  const getTabConfig = () => {
    switch (activeTab) {
      case 'dictionary':
        return {
          type: 'word' as const,
          placeholder: t('enterWordPlaceholder'),
          label: t('wordToLookUp'),
        };
      case 'analyse':
        return {
          type: 'sentence' as const,
          placeholder: t('enterSentenceAnalysePlaceholder'),
          label: t('sentenceToAnalyse'),
        };
      case 'correction':
        return {
          type: 'sentence' as const,
          placeholder: t('enterSentenceCorrectionPlaceholder'),
          label: t('sentenceToCorrect'),
        };
      default:
        return {
          type: 'word' as const,
          placeholder: '',
          label: '',
        };
    }
  };

  const config = getTabConfig();

  return (
    <div className="space-y-6">
      <InputForm
        type={config.type}
        onSubmit={handleSubmit}
        loading={tabState.loading}
        placeholder={config.placeholder}
        label={config.label}
        value={tabState.input}
        language={tabState.language}
        onInputChange={(input) => onUpdateTabState({ input })}
        onLanguageChange={(language) => onUpdateTabState({ language })}
        t={t}
      />
      
      <ResponseArea
        content={tabState.response}
        loading={tabState.loading}
        error={tabState.error}
        activeTab={activeTab}
        t={t}
      />
    </div>
  );
};