import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TabContent } from '../components/TabContent';
import { HistoryItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTranslation } from '../hooks/useTranslation';

interface TabState {
  input: string;
  language: string;
  response: string;
  loading: boolean;
  error: string | null;
}

const initialTabState: TabState = {
  input: '',
  language: 'English',
  response: '',
  loading: false,
  error: null,
};

export const AppPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dictionary');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('language-aibou-history', []);
  const [globalLanguage, setGlobalLanguage] = useLocalStorage<string>('global-language', 'English');
  const { t } = useTranslation(globalLanguage);
  
  // Separate state for each tab
  const [tabStates, setTabStates] = useState<Record<string, TabState>>({
    dictionary: { ...initialTabState, language: globalLanguage },
    analyse: { ...initialTabState, language: globalLanguage },
    correction: { ...initialTabState, language: globalLanguage },
  });

  const handleAddToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev.slice(0, 49)]); // Keep last 50 items
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const updateTabState = (tab: string, updates: Partial<TabState>) => {
    setTabStates(prev => ({
      ...prev,
      [tab]: { ...prev[tab], ...updates }
    }));
    
    // If language is being updated, sync it globally
    if (updates.language) {
      setGlobalLanguage(updates.language);
      // Update all tabs with the new language
      setTabStates(prev => {
        const newStates = { ...prev };
        Object.keys(newStates).forEach(tabKey => {
          newStates[tabKey] = { ...newStates[tabKey], language: updates.language! };
        });
        return newStates;
      });
    }
  };

  const getTabTitle = (tab: string): string => {
    switch (tab) {
      case 'dictionary':
        return t('dictionary');
      case 'analyse':
        return t('analyse');
      case 'correction':
        return t('correction');
      default:
        return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  const getTabDescription = (tab: string): string => {
    switch (tab) {
      case 'dictionary':
        return t('dictionaryDescription');
      case 'analyse':
        return t('analyseDescription');
      case 'correction':
        return t('correctionDescription');
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex h-screen">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
          t={t}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {getTabTitle(activeTab)}
              </h1>
              <p className="text-slate-400">
                {getTabDescription(activeTab)}
              </p>
            </div>
            
            <TabContent
              activeTab={activeTab}
              onAddToHistory={handleAddToHistory}
              tabState={tabStates[activeTab]}
              onUpdateTabState={(updates) => updateTabState(activeTab, updates)}
              t={t}
            />
          </div>
        </main>
      </div>
    </div>
  );
};