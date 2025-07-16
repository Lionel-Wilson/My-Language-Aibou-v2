import React, { useEffect, useRef } from 'react';
import { BookOpen, Languages, X } from 'lucide-react';
import { useTextSelection } from './WordHoverProvider';

export const TextSelectionTooltip: React.FC = () => {
  const { selectedText, selectionPosition, selectionType, hideTooltip, lookupWord, translatePhrase } = useTextSelection();
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        hideTooltip();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideTooltip();
      }
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        hideTooltip();
      }
    };

    if (selectedText) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('selectionchange', handleSelectionChange);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [selectedText, hideTooltip]);

  if (!selectedText || !selectionPosition || !selectionType) {
    return null;
  }

  const handleAction = () => {
    if (selectionType === 'word') {
      lookupWord(selectedText);
    } else {
      translatePhrase(selectedText);
    }
  };

  // Truncate long selections for display
  const displayText = selectedText.length > 30 
    ? `${selectedText.substring(0, 30)}...` 
    : selectedText;

  const isWord = selectionType === 'word';
  const actionLabel = isWord ? 'Define in Dictionary' : 'Translate';
  const ActionIcon = isWord ? BookOpen : Languages;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-3 min-w-[200px] max-w-[300px]"
      style={{
        left: `${selectionPosition.x}px`,
        top: `${selectionPosition.y - 70}px`,
        transform: 'translateX(-50%)',
      }}
      role="tooltip"
      aria-label={`Dictionary lookup for ${selectedText}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300 truncate pr-2">
          "{displayText}"
        </span>
        <button
          onClick={hideTooltip}
          className="text-slate-400 hover:text-slate-300 transition-colors p-1 flex-shrink-0"
          aria-label="Close tooltip"
        >
          <X size={14} />
        </button>
      </div>
      
      <button
        onClick={handleAction}
        className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
        aria-label={`${actionLabel} for ${selectedText}`}
      >
        <ActionIcon size={16} />
        {actionLabel}
      </button>
    </div>
  );
};