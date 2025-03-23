import React, { useState, useEffect, useRef } from 'react';
import { Github, List, Search, Mail, Clock, Users } from "lucide-react";

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
        "text-xs flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-300",
        "bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#8be9fd]",
        copied ? "text-[#50fa7b]" : "text-[#8be9fd]",
        className
      )}
      style={{ minWidth: '68px', justifyContent: 'center' }}
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

// Search Modal component
const SearchModal = ({ isOpen, onClose, onSearch, searchTerm, setSearchTerm }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-50">
      <div 
        ref={modalRef}
        className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-lg shadow-xl"
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries, tags, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border-0 rounded px-3 py-2 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-[#8be9fd] focus:outline-none"
              autoFocus
            />
          </div>
          <div className="flex justify-end">
            <button 
              className="text-sm px-4 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
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
    className={cn("rounded-md border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Function to determine card height based on query length
  const getCardContentHeight = (queryText: string) => {
    const lineCount = (queryText.match(/\n/g) || []).length + 1;
    if (lineCount <= 1) return 'min-h-[40px]';
    if (lineCount <= 3) return 'min-h-[80px]';
    if (lineCount <= 5) return 'min-h-[120px]';
    return 'min-h-[180px] max-h-[280px]';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Section 1: Header - Fixed */}
      <header className="bg-gray-900 border-b border-gray-800 py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
            KQL Library
          </h1>
          <div className="flex items-center gap-4">
            <Button
              className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
              onClick={() => window.open('https://github.com/0fflineDocs/KQL', '_blank')}
            >
              <Github className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Section 2: Categories - Fixed */}
      <div className="bg-gray-900/95 border-b border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                className={cn(
                  "px-3 py-2 rounded-md font-medium",
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
        </div>
      </div>

      {/* Section 3: Subcategories - Fixed (only visible when a category is selected) */}
      {selectedCategory && categoryInfo[selectedCategory]?.subCategories?.length > 0 && (
        <div className="bg-gray-900/90 border-b border-gray-800 py-3">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categoryInfo[selectedCategory].subCategories.map((subCategory: string) => (
                <Button
                  key={subCategory}
                  className={cn(
                    "px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700",
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
          </div>
        </div>
      )}

      {/* Section 4: Query Cards - Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto p-4 bg-gray-950" 
        ref={contentRef}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="border-gray-800 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 bg-[#1e1e2e] flex flex-col transform hover:-translate-y-1 overflow-hidden"
              >
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Section 5: Bottom Bar - Fixed */}
      <footer className="bg-gray-900 border-t border-gray-800 py-2.5 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-300 flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4" />
              <span>Contributors</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300 flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4" />
              <span>Recently Added</span>
            </a>
          </div>
          <div>
            <a href="#" className="text-gray-400 hover:text-gray-300 flex items-center gap-1.5 text-sm">
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={() => {}}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default KQLLibrary;
