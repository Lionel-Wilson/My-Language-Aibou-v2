import React from 'react';
import { 
  BookOpen, 
  MessageCircle, 
  CheckCircle,
  X
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import {Link} from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  t: ReturnType<typeof useTranslation>['t'];
}


export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isMobileMenuOpen, 
  onMobileMenuToggle,
  t
}) => {
  const tabs = [
    { id: 'dictionary', icon: BookOpen, label: t('dictionary') },
    { id: 'translate', icon: MessageCircle, label: t('analyse') },
    { id: 'correction', icon: CheckCircle, label: t('correction') },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 relative">
            {/* Mobile Close Button */}
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <Link to="/">
            <div className="pr-12 md:pr-0">
              <h1 className="text-2xl font-bold text-white">{t('appName')}</h1>
              <p className="text-sm text-slate-400 mt-1">{t('appSubtitle')}</p>
            </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  onTabChange(id);
                  onMobileMenuToggle();
                }}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${activeTab === id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              {t('yourAiLanguageAssistant')}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-30 md:hidden"
          onClick={onMobileMenuToggle}
        />
      )}
    </>
  );
};