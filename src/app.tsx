// src/app.tsx - Fixed version with query loading
import React, { useState, useEffect } from 'react';

// Import types
import { Query, CategoryInfo } from './types';

// Import layout components
import Header from './components/layout/Header';
import SidebarNavigation from './components/layout/SidebarNavigation';
import QueryDisplay from './components/QueryDisplay';
import SearchModal from './components/SearchModal';

// Utility functions for subcategory key management
const createSubcategoryKey = (category: string, subcategory: string) => `${category}:${subcategory}`;
const parseSubcategoryKey = (key: string | null) => {
  if (!key) return { category: null, subcategory: null };
  const [category, subcategory] = key.split(':');
  return { category, subcategory };
};

const KQLLibrary = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const categories = [
    "Entra ID", "Defender for Identity", "Defender for Endpoint",
    "Defender for Office 365", "Defender for Cloud Apps", "Sentinel", "Intune"
  ];

  const categoryInfo: Record<string, CategoryInfo> = {
    "Entra ID": {
      displayName: "Entra ID",
      textColor: "text-blue-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Conditional Access", "Applications", "Authentication", "Authentication Methods", "Roles", "Governance", "Guests", "Devices"],
      fileName: "entraid.json"
    },
    "Defender for Identity": {
      displayName: "Defender for Identity",
      textColor: "text-yellow-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Service Accounts", "Dormant Accounts", "Guests"],
      fileName: "defenderforidentity.json"
    },
    "Defender for Endpoint": {
      displayName: "Defender for Endpoint",
      textColor: "text-green-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: [],
      fileName: "defenderforendpoint.json"
    },
    "Defender for Office 365": {
      displayName: "Defender for Office 365",
      textColor: "text-orange-400",
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: [],
      fileName: "defenderforoffice365.json"
    },
    "Defender for Cloud Apps": {
      displayName: "Defender for Cloud Apps",
      textColor: "text-purple-400", 
      buttonBg: "bg-gray-800 hover:bg-gray-700",
      subCategories: ["Email Security", "Data Protection", "Cloud Security", "Entra ID"],
      fileName: "defenderforcloudapps.json"
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
      subCategories: ["Android Enterprise", "Compliance", "Defender for Endpoint", "Governance"],
      fileName: "intune.json"
    }
  };

  // Improved fetchAllQueries function
  const fetchAllQueries = async () => {
    setIsLoading(true);
    setLoadingError(null);
    
    try {
      const allQueries: Query[] = [];
      
      const fetchPromises = categories.map(async (category) => {
        // Get the filename from categoryInfo
        const fileName = categoryInfo[category]?.fileName;
        
        if (!fileName) {
          console.warn(`No fileName defined for category: ${category}`);
          return [];
        }
        
        console.log(`Fetching ${category} using filename: ${fileName}`);
        
        try {
          const response = await fetch(`/queries/${fileName}`);
          
          if (!response.ok) {
            console.warn(`Failed to fetch queries for ${category} (${fileName}): ${response.status}`);
            return [];
          }
          
          const data = await response.json();
          console.log(`Loaded ${data.length} queries from ${fileName}`);
          return data;
        } catch (error) {
          console.error(`Error fetching ${category} queries (${fileName}):`, error);
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      results.forEach(categoryQueries => {
        if (Array.isArray(categoryQueries)) {
          allQueries.push(...categoryQueries);
        }
      });
      
      console.log(`Total queries loaded: ${allQueries.length}`);
      setQueries(allQueries);
      
      // Auto-select first category if we have queries and nothing is selected
      if (allQueries.length > 0 && !selectedCategory) {
        const firstQueryCategory = allQueries[0].category;
        setSelectedCategory(firstQueryCategory);
      }
      
    } catch (error) {
      console.error("Error fetching queries:", error);
      setLoadingError("Failed to load queries. Please try again later.");
      setQueries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load queries when component mounts
  useEffect(() => {
    fetchAllQueries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure category and subcategory consistency
  useEffect(() => {
    if (selectedSubCategory) {
      const { category } = parseSubcategoryKey(selectedSubCategory);
      
      if (category !== selectedCategory) {
        setSelectedCategory(category);
      }
    }
  }, [selectedSubCategory, selectedCategory]);

  // Update the selected query when category or subcategory changes
  useEffect(() => {
    // Filter queries based on selected category and subcategory
    const filteredQueries = queries.filter(query => {
      // Must match the category exactly
      const categoryMatch = query.category === selectedCategory;
      
      // Then check subcategory if one is selected
      let subCategoryMatch = true;
      if (selectedSubCategory) {
        const { subcategory } = parseSubcategoryKey(selectedSubCategory);
        subCategoryMatch = query.subCategory === subcategory;
      }
      
      return categoryMatch && subCategoryMatch;
    });
    
    // If we have filtered queries and no currently selected query (or the current query doesn't match the filters)
    if (filteredQueries.length > 0 && 
        (!selectedQuery || 
         selectedQuery.category !== selectedCategory || 
         (selectedSubCategory && selectedQuery.subCategory !== parseSubcategoryKey(selectedSubCategory).subcategory))) {
      setSelectedQuery(filteredQueries[0]);
    } else if (filteredQueries.length === 0) {
      // No matching queries, clear the selected query
      setSelectedQuery(null);
    }
  }, [selectedCategory, selectedSubCategory, queries, selectedQuery]);

  // Custom handler to ensure state consistency when setting the subcategory
  const handleSetSubCategory = (subcategoryKey: string | null) => {
    if (subcategoryKey === null) {
      setSelectedSubCategory(null);
      return;
    }
    
    // Extract category from the subcategory key
    const { category } = parseSubcategoryKey(subcategoryKey);
    
    // Update the category first if needed
    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
    
    // Then set the subcategory
    setSelectedSubCategory(subcategoryKey);
  };

  // Close search modal and reset search term
  const handleCloseSearch = () => {
    setIsSearchModalOpen(false);
    setSearchTerm('');
  };

  // Simple debug component for development
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV === 'production') return null;
    
    return (
      <div className="fixed bottom-2 right-2 bg-black/70 text-white p-2 text-xs rounded z-50">
        <div>Total Queries: {queries.length}</div>
        <div>Selected Category: {selectedCategory || 'None'}</div>
        <div>Selected SubCategory: {selectedSubCategory ? parseSubcategoryKey(selectedSubCategory).subcategory : 'None'}</div>
        <div>Current Query: {selectedQuery?.title || 'None'}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Header */}
      <Header onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Main content area with sidebar and query display */}
      <div className="flex flex-1 overflow-hidden">
        {/* Two-panel sidebar navigation */}
        <SidebarNavigation 
          categories={categories}
          categoryInfo={categoryInfo}
          queries={queries}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={handleSetSubCategory}
          selectedQuery={selectedQuery}
          setSelectedQuery={setSelectedQuery}
        />

        {/* Main content area */}
        <div className="flex-1 overflow-hidden bg-gray-950">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading queries...</div>
            </div>
          ) : loadingError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-400">{loadingError}</div>
            </div>
          ) : (
            <QueryDisplay query={selectedQuery} />
          )}
        </div>
      </div>

      {/* Enhanced Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearch}
        onSearch={() => {}}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        categoryInfo={categoryInfo}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={handleSetSubCategory}
        queries={queries}
        setSelectedQuery={setSelectedQuery}
      />
      
      {/* Debug info for development */}
      {renderDebugInfo()}
    </div>
  );
};

export default KQLLibrary;
