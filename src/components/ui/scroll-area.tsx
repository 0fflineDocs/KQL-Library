export const ScrollArea = ({ children, className = '' }: any) => (
  <div className={`overflow-y-auto max-h-64 ${className}`}>
    {children}
  </div>
);
