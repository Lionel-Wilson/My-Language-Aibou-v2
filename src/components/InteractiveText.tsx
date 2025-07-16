import React, { useCallback, useRef, useEffect } from 'react';
import { useTextSelection } from './WordHoverProvider';

interface InteractiveTextProps {
  children: React.ReactNode;
  className?: string;
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({ 
  children, 
  className = '' 
}) => {
  const { showTooltip, hideTooltip } = useTextSelection();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanText = useCallback((text: string): string => {
    // Remove excessive whitespace and clean up the text
    return text.replace(/\s+/g, ' ').trim();
  }, []);

  const isValidSelection = useCallback((text: string): boolean => {
    const cleaned = cleanText(text);
    // Must be at least 1 character, not just whitespace, and not too long
    return cleaned.length >= 1 && cleaned.length <= 100 && /\S/.test(cleaned);
  }, [cleanText]);

  const handleSelectionChange = useCallback(() => {
    // Clear any existing timeout
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }

    // Small delay to ensure selection is stable
    selectionTimeoutRef.current = setTimeout(() => {
      const selection = window.getSelection();
      
      if (!selection || selection.rangeCount === 0) {
        hideTooltip();
        return;
      }

      const selectedText = selection.toString();
      
      if (!isValidSelection(selectedText)) {
        hideTooltip();
        return;
      }

      // Check if the selection is within our interactive text container
      const range = selection.getRangeAt(0);
      const container = containerRef.current;
      
      if (!container || !container.contains(range.commonAncestorContainer)) {
        hideTooltip();
        return;
      }

      // Get the position of the selection for tooltip placement
      const rect = range.getBoundingClientRect();
      const centerX = rect.left + (rect.width / 2);
      const topY = rect.top;

      showTooltip(cleanText(selectedText), centerX, topY);
    }, 100);
  }, [showTooltip, hideTooltip, isValidSelection, cleanText]);

  const handleMouseUp = useCallback(() => {
    // Trigger selection check after mouse up
    setTimeout(handleSelectionChange, 10);
  }, [handleSelectionChange]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    // Handle keyboard selection (Shift + arrows, Ctrl+A, etc.)
    if (event.shiftKey || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || 
        event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
        (event.ctrlKey && event.key === 'a')) {
      setTimeout(handleSelectionChange, 10);
    }
  }, [handleSelectionChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add event listeners for text selection
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('keyup', handleKeyUp);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, [handleMouseUp, handleKeyUp, handleSelectionChange]);

  return (
    <div
      ref={containerRef}
      className={`interactive-text ${className}`}
      style={{
        cursor: 'text',
        userSelect: 'text',
      }}
    >
      {children}
    </div>
  );
};