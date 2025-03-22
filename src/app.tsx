import React, { useState, useEffect } from 'react';
import { Github, List } from "lucide-react";

// Inline the cn utility function
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Copy Button component
const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "text-xs flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-300",
        "bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#8be9fd]",
        copied ? "text-[#50fa7b]" : "text-[#8be9fd]",
        className
      )}
    >
      {copied ? (
        <>
          <svg 
            className="w-3 h-3 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg 
            className="w-3 h-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

// Inline component imports to avoid path issues
// Button component
const Button = ({ 
  variant = "default", 
  size = "default", 
  className = "", 
  children, 
  ...props 
}: any) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      "focus:outline-none focus:ring-1 focus:ring-[#8be9fd] focus:ring-offset-2 focus:ring-offset-gray-950",
      "disabled:opacity-50 disabled:pointer-events-none",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

// Card components
const Card = ({ className = "", children, ...props }: any) => (
  <div
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className = "", children, ...props }: any) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children, ...props }: any) => (
  <p
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </p>
);

const CardDescription = ({ className = "", children, ...props }: any) => (
  <p
    className={cn("text-sm text-[#ffb86c]", className)}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ className = "", children, ...props }: any) => (
  <div className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

// ScrollArea component
const ScrollArea = ({ className = "", children, ...props }: any) => (
  <div className={cn("overflow-y-auto max-h-64", className)} {...props}>
    {children}
  </div>
);

// Input component
const Input = ({ className = "", ...props }: any) => (
  <input
    className={cn("w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400", className)}
    {...props}
  />
);

interface Query {
  title: string;
  description: string;
  query: string;
  category: string;
  subCategory?: string;
  tags?: string[];
}

const KQLLibrary = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    "Entra ID", "Defender for Identity", "Defender for Endpoint",
    "Defender for Office 365", "Defender for Cloud Apps", "Sentinel", "Intune"
  ];

  const categoryInfo: any = {
    "Entra ID": {
      displayName: "Entra ID",
      textColor: "text-blue-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Conditional Access", "Passwordless", "Temporary Access Pass", "Guests"],
      fileName: "entraID.json"
    },
    "Defender for Identity": {
      displayName: "Defender for Identity",
      textColor: "text-yellow-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Service Accounts", "Dormant Accounts"],
      fileName: "defenderForIdentity.json"
    },
    "Defender for Endpoint": {
      displayName: "Defender for Endpoint",
      textColor: "text-green-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: [],
      fileName: "defenderForEndpoint.json"
    },
    "Defender for Office 365": {
      displayName: "Defender for Office 365",
      textColor: "text-orange-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: [],
      fileName: "defenderForOffice365.json"
    },
    "Defender for Cloud Apps": {
      displayName: "Defender for Cloud Apps",
      textColor: "text-purple-400", 
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: [],
      fileName: "defenderForCloudApps.json"
    },
    "Sentinel": {
      displayName: "Sentinel",
      textColor: "text-red-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Hunting", "Automation"],
      fileName: "sentinel.json"
    },
    "Intune": {
      displayName: "Intune",
      textColor: "text-cyan-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: [],
      fileName: "intune.json"
    }
  };

  useEffect(() => {
    const fetchAllQueries = async () => {
      setIsLoading(true);
      setLoadingError(null);
      
      try {
        const allQueries: Query[] = [];
        const fetchPromises = categories.map(async (category) => {
          const fileName = categoryInfo[category]?.fileName || `${category.toLowerCase().replace(/\s+/g, '')}.json`;
          try {
            const response = await fetch(`/queries/${fileName}`);
            if (!response.ok) {
              console.warn(`Failed to fetch queries for ${category}: ${response.status}`);
              return [];
            }
            const data: Query[] = await response.json();
            return data;
          } catch (error) {
            console.warn(`Error fetching ${category} queries:`, error);
            return [];
          }
        });

        // Wait for all fetch requests to complete
        const results = await Promise.all(fetchPromises);
        
        // Combine all results into a single array
        results.forEach(categoryQueries => {
          allQueries.push(...categoryQueries);
        });
        
        setQueries(allQueries);
      } catch (error) {
        console.error("Error fetching queries:", error);
        setLoadingError("Failed to load queries. Please try again later.");
        setQueries([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllQueries();
  }, []);

  const filteredQueries = queries.filter(query => {
    const searchMatch =
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (query.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const categoryMatch = !selectedCategory || query.category === selectedCategory;
    const subCategoryMatch = !selectedSubCategory || query.subCategory === selectedSubCategory;
    return searchMatch && categoryMatch && subCategoryMatch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="bg-gray-900/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
            KQL Library
          </h1>
          <div className="md:hidden">
            <Button className="text-gray-400 hover:text-gray-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <List className="w-6 h-6" />
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-400"
            />
            <Button
              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              onClick={() => window.open('https://github.com/0fflineDocs/KQL', '_blank')}
            >
              <Github className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              className={cn(
                "px-4 py-2 rounded-md font-medium",
                categoryInfo[category]?.buttonBg,
                selectedCategory === category
                  ? "bg-gray-700 ring-1 ring-[#8be9fd]"
                  : ""
              )}
              onClick={() => {
                setSelectedCategory(prev => prev === category ? null : category);
                setSelectedSubCategory(null);
              }}
            >
              <span className="text-[#bd93f9]">
                {categoryInfo[category]?.displayName || category}
              </span>
            </Button>
          ))}
        </div>

        {selectedCategory && categoryInfo[selectedCategory]?.subCategories?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categoryInfo[selectedCategory].subCategories.map((subCategory: string) => (
              <Button
                key={subCategory}
                className={cn(
                  "px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700",
                  selectedSubCategory === subCategory
                    ? "bg-gray-700 ring-1 ring-[#8be9fd]"
                    : ""
                )}
                onClick={() => setSelectedSubCategory(prev => prev === subCategory ? null : subCategory)}
              >
                <span className="text-[#ff79c6]">{subCategory}</span>
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-6">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              Loading queries...
            </div>
          ) : loadingError ? (
            <div className="col-span-full text-center text-red-400 py-8">
              {loadingError}
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              No queries found matching your search.
            </div>
          ) : (
            filteredQueries.map((query, index) => (
              <Card 
                key={index} 
                className="border-gray-800 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 bg-gray-900/90 backdrop-blur-md flex flex-col transform hover:-translate-y-1"
              >
                <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-lg border-b border-gray-800">
                  <CardTitle className="text-lg font-semibold text-[#50fa7b]">
                    {query.title}
                  </CardTitle>
                  <CardDescription className="text-[#ffb86c]">
                    {query.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ScrollArea className="h-full w-full rounded-md border border-gray-800 bg-gray-950 mt-2">
                    <pre className="p-4 px-6 text-xs text-gray-200 whitespace-pre-wrap break-words">
                      <code>{query.query}</code>
                    </pre>
                  </ScrollArea>
                  <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {query.tags && query.tags.length > 0 && query.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 rounded-full bg-gray-800 text-[#8be9fd]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <CopyButton text={query.query} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default KQLLibrary;
