import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Menu, BookOpen, MessageCircle, CheckCircle, Home } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TabContent } from '../components/TabContent';
import { TextSelectionProvider } from '../components/WordHoverProvider';
import { TextSelectionTooltip } from '../components/WordTooltip';
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
  const [activeTab, setActiveTab] = useState('translate');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('language-aibou-history', []);
  const [globalLanguage, setGlobalLanguage] = useLocalStorage<string>('global-language', 'English');
  const { t } = useTranslation(globalLanguage);
  
  // Separate state for each tab
  const [tabStates, setTabStates] = useState<Record<string, TabState>>({
    translate: { ...initialTabState, language: globalLanguage },
    dictionary: { ...initialTabState, language: globalLanguage },
    correction: { ...initialTabState, language: globalLanguage },
  });

  // Handle URL parameters for dictionary lookup
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    const word = searchParams.get('word');
    const sentence = searchParams.get('sentence');
    const lang = searchParams.get('lang');

    if (tab && ['dictionary', 'translate', 'correction'].includes(tab)) {
      setActiveTab(tab);
    }

    if (word && tab === 'dictionary') {
      const targetLanguage = lang || globalLanguage;
      setTabStates(prev => ({
        ...prev,
        dictionary: {
          ...prev.dictionary,
          input: word,
          language: targetLanguage,
        }
      }));
    }

    if (sentence && tab === 'translate') {
      const targetLanguage = lang || globalLanguage;
      setTabStates(prev => ({
        ...prev,
        translate: {
          ...prev.translate,
          input: sentence,
          language: targetLanguage,
        }
      }));
    }
  }, [searchParams, globalLanguage]);

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
      case 'translate':
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
      case 'translate':
        return t('analyseDescription');
      case 'correction':
        return t('correctionDescription');
      default:
        return '';
    }
  };

  const mobileTabItems = [
    { id: 'home', icon: Home, label: 'Home', isExternal: true },
    { id: 'translate', icon: MessageCircle, label: t('analyse') },
    { id: 'dictionary', icon: BookOpen, label: t('dictionary') },
    { id: 'correction', icon: CheckCircle, label: t('correction') },
  ];

  const handleMobileTabClick = (tabId: string) => {
    if (tabId === 'home') {
      navigate('/');
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <TextSelectionProvider currentLanguage={globalLanguage}>
      <div className="min-h-screen bg-slate-900 pb-20 md:pb-0">
        {/* Mobile Header with Menu Button */}
        <div className="hidden bg-slate-800 border-b border-slate-700 px-4 py-3 items-center justify-between">
          <button
            onClick={handleMobileMenuToggle}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {getTabTitle(activeTab)}
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="flex h-screen md:h-screen">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuToggle={handleMobileMenuToggle}
            t={t}
          />
          
          <main className="flex-1 overflow-auto h-screen md:h-screen">
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

        {/* Mobile Bottom Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-50">
          <div className="flex">
            {mobileTabItems.map(({ id, icon: Icon, label, isExternal }) => (
              <button
                key={id}
                onClick={() => handleMobileTabClick(id)}
                className={`
                  flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-200
                  ${(activeTab === id && !isExternal) || (id === 'home' && false)
                    ? 'text-blue-400 bg-slate-700/50' 
                    : 'text-slate-400 hover:text-slate-300'
                  }
                `}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-xs font-medium truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <TextSelectionTooltip />
      </div>
    </TextSelectionProvider>
  );
};