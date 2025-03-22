import React, { useState, useEffect } from 'react';
import { Github, List } from "lucide-react";

// Inline the cn utility function
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
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
      "focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-950",
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
    className={cn("text-sm text-muted-foreground", className)}
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch('/queries.json');
        if (!response.ok) throw new Error(`Failed to fetch queries: ${response.status}`);
        const data: Query[] = await response.json();
        setQueries(data);
      } catch (error) {
        console.error("Error fetching queries:", error);
        setQueries([]);
      }
    };
    fetchQueries();
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

  const categories = [
    "Entra ID", "Defender for Identity", "Defender for Endpoint",
    "Defender for Office 365", "Defender for Cloud Apps", "Sentinel", "Intune"
  ];

  const categoryInfo: any = {
    "Entra ID": {
      displayName: "Entra ID",
      textColor: "text-blue-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Conditional Access", "Passwordless", "Temporary Access Pass", "Guests"]
    },
    "Defender for Identity": {
      displayName: "Defender for Identity",
      textColor: "text-yellow-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Service Accounts", "Dormant Accounts"]
    },
    "Defender for Endpoint": {
      displayName: "Defender for Endpoint",
      textColor: "text-green-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: []
    },
    "Defender for Office 365": {
      displayName: "Defender for Office 365",
      textColor: "text-orange-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: []
    },
    "Defender for Cloud Apps": {
      displayName: "Defender for Cloud Apps",
      textColor: "text-purple-400", 
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: []
    },
    "Sentinel": {
      displayName: "Sentinel",
      textColor: "text-red-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Hunting", "Automation"]
    },
    "Intune": {
      displayName: "Intune",
      textColor: "text-cyan-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: []
    }
  };

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
                  ? "bg-gray-700 ring-1 ring-orange-500"
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
                    ? "bg-gray-700 ring-1 ring-orange-500"
                    : ""
                )}
                onClick={() => setSelectedSubCategory(prev => prev === subCategory ? null : subCategory)}
              >
                {subCategory}
                <span className="text-[#ff79c6]">{subCategory}</span>
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQueries.length === 0 ? (
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
                    <pre className="p-4 text-sm text-gray-200 whitespace-pre-wrap break-words">
                      <code>{query.query}</code>
                    </pre>
                  </ScrollArea>
                  {query.tags && query.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {query.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
