// src/app.tsx - Complete fixed version
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
  const [queriesByCategory, setQueriesByCategory] = useState<Record<string, Query[]>>({});

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

  // Try multiple file name patterns for each category
  const getFileNameVariations = (category: string, baseFileName: string) => {
    const variations = [
      baseFileName,
      baseFileName.toLowerCase(),
      baseFileName.toUpperCase(),
      baseFileName.replace(/\.json$/, '.JSON')
    ];
    
    if (category === "Defender for Cloud Apps") {
      variations.push(
        "defenderforcloudapps.json",
        "defender-for-cloud-apps.json",
        "defenderforcloud.json",
        "cloudapps.json"
      );
    }
    
    return [...new Set(variations)]; // Remove duplicates
  };

  // Improved fetchAllQueries function to try multiple file name variations
  const fetchAllQueries = async () => {
    setIsLoading(true);
    setLoadingError(null);
    
    try {
      const newQueriesByCategory: Record<string, Query[]> = {};
      const allQueries: Query[] = [];
      
      // Process each category
      const fetchPromises = categories.map(async (category) => {
        // Get the base filename from categoryInfo
        const baseFileName = categoryInfo[category]?.fileName || 
          category.toLowerCase().replace(/\s+/g, '').replace(/for/g, 'for') + '.json';
        
        // Get variations to try
        const fileNameVariations = getFileNameVariations(category, baseFileName);
        
        console.log(`Trying variations for ${category}:`, fileNameVariations);
        
        let categoryQueries: Query[] = [];
        let successfulFileName = null;
        
        // Try each variation
        for (const fileName of fileNameVariations) {
          const filePath = `/queries/${fileName}`;
          
          try {
            const response = await fetch(`${filePath}?t=${Date.now()}`);
            
            if (response.ok) {
              const text = await response.text();
              try {
                const data = JSON.parse(text);
                
                if (Array.isArray(data) && data.length > 0) {
                  categoryQueries = data;
                  successfulFileName = fileName;
                  console.log(`Successfully loaded ${data.length} queries for ${category} from ${fileName}`);
                  break; // Stop trying variations once we find one that works
                } else {
                  console.warn(`${fileName} did not contain an array of queries`);
                }
              } catch (parseError) {
                console.error(`Error parsing JSON from ${fileName}:`, parseError);
              }
            } else {
              console.log(`${fileName} not found (${response.status})`);
            }
          } catch (error) {
            console.error(`Error fetching ${fileName}:`, error);
          }
        }
        
        // If we found queries, store them for this category
        if (categoryQueries.length > 0) {
          newQueriesByCategory[category] = categoryQueries;
          console.log(`Added ${categoryQueries.length} queries for ${category}`);
          return categoryQueries;
        } else {
          console.warn(`No queries found for ${category} after trying all variations`);
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      
      // Combine all queries
      results.forEach(categoryQueries => {
        if (Array.isArray(categoryQueries)) {
          allQueries.push(...categoryQueries);
        }
      });
      
      console.log(`Total queries loaded: ${allQueries.length}`);
      setQueries(allQueries);
      setQueriesByCategory(newQueriesByCategory);
      
      // Auto-select first category if we have queries and nothing is selected
      if (allQueries.length > 0 && !selectedCategory) {
        // Find the first category that has queries
        const firstCategoryWithQueries = Object.keys(newQueriesByCategory).find(cat => 
          newQueriesByCategory[cat] && newQueriesByCategory[cat].length > 0
        );
        
        if (firstCategoryWithQueries) {
          setSelectedCategory(firstCategoryWithQueries);
        }
      }
      
    } catch (error) {
      console.error("Error fetching queries:", error);
      setLoadingError("Failed to load queries. Please try again later.");
      setQueries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Special case for mapping categories in Defender for Cloud Apps
  const mapQueryCategory = (query: Query): Query => {
    // If the query is from Cloud Apps but uses different categories, map them
    if ((query.category === "Email Security" || 
         query.category === "Data Protection" || 
         query.category === "Cloud Security") && 
        !categories.includes(query.category)) {
      
      return {
        ...query,
        originalCategory: query.category, // Save original for reference
        category: "Defender for Cloud Apps"
      };
    }
    
    return query;
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
        <div>Categories with queries: {Object.keys(queriesByCategory).join(', ')}</div>
        <div>Selected Category: {selectedCategory || 'None'}</div>
        <div>
          Selected Category Queries: {selectedCategory && queriesByCategory[selectedCategory] 
            ? queriesByCategory[selectedCategory].length 
            : 0}
        </div>
        <div>Selected SubCategory: {selectedSubCategory ? parseSubcategoryKey(selectedSubCategory).subcategory : 'None'}</div>
        <div>Current Query: {selectedQuery?.title || 'None'}</div>
      </div>
    );
  };

  // Handle force reload button
  const handleForceReload = () => {
    console.log("Force reloading queries...");
    fetchAllQueries();
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
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-gray-400 mb-4">Loading queries...</div>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : loadingError ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-red-400 mb-4">{loadingError}</div>
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
                onClick={handleForceReload}
              >
                Try Again
              </button>
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
