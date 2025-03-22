export const Card = ({ children, className = '', ...props }: any) => (
  <div {...props} className={`bg-gray-900 rounded-lg shadow p-4 border border-gray-800 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }: any) => (
  <div className="mb-2">{children}</div>
);

export const CardTitle = ({ children }: any) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export const CardDescription = ({ children }: any) => (
  <p className="text-sm text-gray-400">{children}</p>
);

export const CardContent = ({ children }: any) => (
  <div>{children}</div>
);
