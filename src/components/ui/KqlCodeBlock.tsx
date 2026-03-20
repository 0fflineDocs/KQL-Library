import React from 'react';

interface KqlCodeBlockProps {
  code: string;
  className?: string;
}

const KEYWORDS = new Set([
  'and', 'as', 'between', 'by', 'contains', 'count', 'datatable', 'distinct',
  'evaluate', 'extend', 'false', 'has', 'has_all', 'has_any', 'in', 'inner',
  'isnotempty', 'isnull', 'join', 'kind', 'let', 'limit', 'lookup', 'make_list',
  'make_set', 'mv-apply', 'mv-expand', 'not', 'null', 'on', 'or', 'order',
  'parse', 'parse_json', 'project', 'project-away', 'project-keep',
  'project-rename', 'render', 'serialize', 'sort', 'summarize', 'take',
  'top', 'toscalar', 'tostring', 'true', 'union', 'where'
]);

const FUNCTIONS = new Set([
  'ago', 'arg_max', 'avg', 'bin', 'case', 'coalesce', 'count', 'countif',
  'datetime_diff', 'extract', 'iif', 'iff', 'make_list', 'make_set', 'max',
  'min', 'now', 'parse_json', 'replace_regex', 'round', 'split', 'strcat',
  'sum', 'tolower', 'toupper'
]);

const getTokenClass = (token: string) => {
  if (/^\s+$/.test(token)) return '';
  if (/^\/\/.*$/.test(token) || /^#.*$/.test(token)) return 'text-[#8b949e]';
  if (/^".*"$|^'.*'$/.test(token)) return 'text-[#a5d6ff]';
  if (/^\d+(\.\d+)?[dhms]?$/i.test(token)) return 'text-[#79c0ff]';
  if (/^[|=()[\]{},.%:+*-]+$/.test(token)) return 'text-[#ff7b72]';

  const normalized = token.toLowerCase();
  if (KEYWORDS.has(normalized)) return 'text-[#ff7b72]';
  if (FUNCTIONS.has(normalized)) return 'text-[#d2a8ff]';
  if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) return 'text-[#ffa657]';

  return 'text-[var(--color-fg-1)]';
};

const tokenizeKql = (code: string) =>
  code.match(/\/\/.*$|#.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b[\w.-]+\b|\s+|[^\w\s]/gm) ?? [];

const KqlCodeBlock = ({ code, className = '' }: KqlCodeBlockProps) => {
  const tokens = tokenizeKql(code);

  return (
    <pre className={`p-4 text-sm font-mono whitespace-pre-wrap break-words h-full bg-[var(--color-terminal)] ${className}`}>
      <code>
        {tokens.map((token, index) => (
          <span key={`${token}-${index}`} className={getTokenClass(token)}>
            {token}
          </span>
        ))}
      </code>
    </pre>
  );
};

export default KqlCodeBlock;
