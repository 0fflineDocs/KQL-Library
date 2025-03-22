import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Github, List } from "lucide-react";
import { Input } from "@/components/ui/input";

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
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      subCategories: ["Conditional Access", "Passwordless", "Temporary Access Pass", "Guests"]
    },
    "Defender for Identity": {
      displayName: "Defender for Identity",
      gradient: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      subCategories: ["Service Accounts", "Dormant Accounts"]
    },
    "Defender for Endpoint": {
      displayName: "Defender for Endpoint",
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      subCategories: []
    },
    "Defender for Office 365": {
      displayName: "Defender for Office 365",
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600",
      subCategories: []
    },
    "Defender for Cloud Apps": {
      displayName: "Defender for Cloud Apps",
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      subCategories: []
    },
    "Sentinel": {
      displayName: "Sentinel",
      gradient: "bg-gradient-to-r from-red-500 to-red-600",
      subCategories: ["Hunting", "Automation"]
    },
    "Intune": {
      displayName: "Intune",
      gradient: "bg-gradient-to-r from-cyan-500 to-cyan-600",
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
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
              variant="ghost"
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
              variant="outline"
              className={cn(
                "px-4 py-2 rounded-full transition-colors duration-200 text-white",
                categoryInfo[category]?.gradient,
                selectedCategory === category
                  ? "ring-2 ring-offset-2 ring-gray-950"
                  : "bg-gray-800/50 hover:bg-gray-700/50"
              )}
              onClick={() => {
                setSelectedCategory(prev => prev === category ? null : category);
                setSelectedSubCategory(null);
              }}
            >
              {categoryInfo[category]?.displayName || category}
            </Button>
          ))}
        </div>

        {selectedCategory && categoryInfo[selectedCategory]?.subCategories?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categoryInfo[selectedCategory].subCategories.map((subCategory: string) => (
              <Button
                key={subCategory}
                variant="outline"
                className={cn(
                  "px-4 py-2 rounded-full transition-colors duration-200 text-white",
                  "bg-gray-800/50 hover:bg-gray-700/50",
                  selectedSubCategory === subCategory
                    ? "ring-2 ring-offset-2 ring-gray-950"
                    : ""
                )}
                onClick={() => setSelectedSubCategory(prev => prev === subCategory ? null : subCategory)}
              >
                {subCategory}
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
              <Card key={index} className="border-gray-800 hover:shadow-lg transition-shadow duration-200 bg-gray-900/90 backdrop-blur-md flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{query.title}</CardTitle>
                  <CardDescription className="text-gray-400">{query.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full rounded-md border border-gray-800 bg-gray-950">
                    <pre className="p-4 text-sm text-gray-200 whitespace-pre-wrap break-words">
                      <code>{query.query}</code>
                    </pre>
                  </ScrollArea>
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
