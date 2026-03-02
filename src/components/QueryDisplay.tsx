import React from 'react';
import { motion } from 'framer-motion';
import CopyButton from '@/components/ui/CopyButton';
import { Query } from '@/types';

interface QueryDisplayProps {
  query: Query | null;
}

const QueryDisplay = ({ query }: QueryDisplayProps) => {
  if (!query) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-fg-1)]">
        Select a query from the sidebar to view details
      </div>
    );
  }

  // Function to determine card height based on query length
  const getCardContentHeight = (queryText: string) => {
    const lineCount = (queryText.match(/\n/g) || []).length + 1;
    if (lineCount <= 1) return 'min-h-[60px]';
    if (lineCount <= 3) return 'min-h-[100px]';
    if (lineCount <= 5) return 'min-h-[160px]';
    if (lineCount <= 10) return 'min-h-[280px]';
    return 'min-h-[400px]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-fg-0)] mb-2">{query.title}</h2>
          <p className="text-[var(--color-fg-1)] mb-4">{query.description}</p>
          
          {query.tags && query.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {query.tags.map((tag, index) => (
                <span 
                  key={index} 
                   className="badge-glow inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
               <span className="text-sm text-[var(--color-muted)]">Category:</span>
               <span className="text-sm text-[var(--color-fg-1)]">{query.category}</span>
            </div>
            {query.subCategory && (
              <div className="flex items-center gap-2">
                 <span className="text-sm text-[var(--color-muted)]">Subcategory:</span>
                 <span className="text-sm text-[var(--color-fg-1)]">{query.subCategory}</span>
              </div>
            )}
          </div>
        </div>
        
         <div className="rounded-lg border border-[var(--color-border)]/50 bg-[var(--color-bg-1)]/70 overflow-hidden shadow-[var(--shadow-hard)]">
           <div className="bg-[var(--color-bg-1)] py-3 px-4 flex justify-between items-center border-b border-[var(--color-border)]/30">
             <h3 className="text-sm font-semibold text-[var(--color-fg-0)]">KQL Query</h3>
            <CopyButton text={query.query} />
          </div>
          <div className={`w-full overflow-auto ${getCardContentHeight(query.query)}`}>
             <pre className="p-4 text-sm text-[var(--color-fg-1)] font-mono whitespace-pre-wrap break-words h-full bg-[#050507]">
              <code>{query.query}</code>
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QueryDisplay;
