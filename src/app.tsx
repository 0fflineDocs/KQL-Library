// src/app.tsx
import React, { useState, useEffect, useRef } from 'react';

// Import types
import { Query, CategoryInfo } from './types';

// Import layout components
import Header from './components/layout/Header';
import CategoryNav from './components/layout/CategoryNav';
import SubcategoryNav from './components/layout/SubcategoryNav';
import QueryCard from './components/QueryCard';
import SearchModal from './components/SearchModal';

const KQLLibrary = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Entra ID", "Defender for Identity", "Defender for Endpoint",
    "Defender for Office 365", "Defender for Cloud Apps", "Sentinel", "Intune"
  ];

  const categoryInfo: Record<string, CategoryInfo> = {
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
          if (Array.isArray(categoryQueries)) {
            allQueries.push(...categoryQueries);
          }
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
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Header */}
      <Header onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Category Navigation */}
      <CategoryNav 
        categories={categories} 
        categoryInfo={categoryInfo} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        setSelectedSubCategory={setSelectedSubCategory}
      />

      {/* Subcategory Navigation */}
      <SubcategoryNav 
        selectedCategory={selectedCategory} 
        categoryInfo={categoryInfo} 
        selectedSubCategory={selectedSubCategory} 
        setSelectedSubCategory={setSelectedSubCategory} 
      />

      {/* Query Cards */}
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
                <QueryCard key={index} query={query} />
              ))
            )}
          </div>
        </div>
      </div>

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
