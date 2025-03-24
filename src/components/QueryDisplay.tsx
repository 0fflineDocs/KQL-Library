import React from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { Query } from '@/types';

interface QueryDisplayProps {
  query: Query | null;
}

const QueryDisplay = ({ query }: QueryDisplayProps) => {
  if (!query) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
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
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#50fa7b] mb-2">{query.title}</h2>
          <p className="text-[#ffb86c] mb-4">{query.description}</p>
          
          {query.tags && query.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {query.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-gray-800 rounded-full text-[#8be9fd] text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Category:</span>
              <span className="text-sm text-[#bd93f9]">{query.category}</span>
            </div>
            {query.subCategory && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Subcategory:</span>
                <span className="text-sm text-[#ff79c6]">{query.subCategory}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-[#1e1e2e] rounded-md border border-gray-800 overflow-hidden">
          <div className="bg-gray-800 py-3 px-4 flex justify-between items-center">
            <h3 className="text-base font-medium text-white">KQL Query</h3>
            <CopyButton text={query.query} />
          </div>
          <div className={`w-full overflow-auto ${getCardContentHeight(query.query)}`}>
            <pre className="p-4 text-sm text-gray-200 whitespace-pre-wrap break-words h-full">
              <code>{query.query}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDisplay;
