import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { InteractiveText } from './InteractiveText';
import { useTranslation } from '../hooks/useTranslation';

interface ResponseAreaProps {
  content: string;
  loading: boolean;
  error: string | null;
  activeTab: string;
  t: ReturnType<typeof useTranslation>['t'];
}

export const ResponseArea: React.FC<ResponseAreaProps> = ({ content, loading, error, activeTab, t }) => {
  const [copied, setCopied] = React.useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [content]);

  // Process the content to handle escaped characters and formatting
  const processContent = (rawContent: string) => {
    return rawContent
      // Convert literal \n to actual line breaks
      .replace(/\\n/g, '\n')
      // Convert \n\n to proper paragraph breaks
      .replace(/\n\n/g, '\n\n')
      // Handle bullet points that might be formatted as \n- 
      .replace(/\n-\s/g, '\n- ')
      // Clean up any extra whitespace
      .trim();
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processContent(content));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dictionary':
        return t('wordInformation');
      case 'analyse':
        return t('analysis');
      case 'correction':
        return t('correction');
      default:
        return t('analysis');
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
        <p className="font-medium">Error occurred:</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>{t('getStartedMessage')}</p>
      </div>
    );
  }

  const processedContent = processContent(content);
  return (
    <div ref={responseRef} className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h3 className="font-medium text-white">{getHeaderTitle()}</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? t('copied') : t('copy')}
        </button>
      </div>
      <InteractiveText className="p-6 prose prose-sm max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-em:text-slate-400">
        <div>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-4 last:mb-0 text-slate-300 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-slate-300">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
              em: ({ children }) => <em className="italic text-slate-400">{children}</em>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-4 text-white border-b border-slate-600 pb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold mb-3 text-white mt-6 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="text-md font-medium mb-2 text-white mt-4">{children}</h3>,
              code: ({ children }) => <code className="bg-slate-700 px-2 py-1 rounded text-sm font-mono text-slate-200">{children}</code>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 bg-slate-700/50 py-2 my-4">{children}</blockquote>,
              // Handle line breaks properly
              br: () => <br className="mb-2" />,
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      </InteractiveText>
    </div>
  );
};