import React from 'react';
import Card from './ui/Card';
import CopyButton from './ui/CopyButton';

interface Query {
  title: string;
  description: string;
  query: string;
  category: string;
  subCategory?: string;
  tags?: string[];
}

interface QueryCardProps {
  query: Query;
}

const QueryCard = ({ query }: QueryCardProps) => {
  // Function to determine card height based on query length
  const getCardContentHeight = (queryText: string) => {
    const lineCount = (queryText.match(/\n/g) || []).length + 1;
    if (lineCount <= 1) return 'min-h-[40px]';
    if (lineCount <= 3) return 'min-h-[80px]';
    if (lineCount <= 5) return 'min-h-[120px]';
    return 'min-h-[180px] max-h-[280px]';
  };

  return (
    <Card className="border-gray-800 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 bg-[#1e1e2e] flex flex-col transform hover:-translate-y-1 overflow-hidden">
      <div className="bg-gray-800 py-3 px-4 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-[#50fa7b]">
            {query.title}
          </h3>
          <p className="text-xs text-[#ffb86c]">
            {query.description}
          </p>
        </div>
        <CopyButton text={query.query} />
      </div>
      <div className="flex-1 p-0">
        <div className={`w-full bg-[#1e1e2e] overflow-auto ${getCardContentHeight(query.query)}`}>
          <pre className="p-3 text-xs text-gray-200 whitespace-pre-wrap break-words h-full">
            <code>{query.query}</code>
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default QueryCard;
