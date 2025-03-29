// src/app.tsx - Fully updated with dynamic category and file loading
import React, { useState, useEffect } from 'react';

// Import types
import { Query, CategoryInfo } from './types';

// Import layout components
import Header from './components/layout/Header';
import SidebarNavigation from './components/layout/SidebarNavigation';
import QueryDisplay from './components/QueryDisplay';
import SearchModal from './components/SearchModal';

// Define helper functions for subcategory management
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
  
  // Initialize categories dynamically from queries instead of hardcoding
  const [categories, setCategories] = useState<string[]>([]);
  
  // Initialize categoryInfo with more flexibility
  const [categoryInfo, setCategoryInfo] = useState<Record<string, CategoryInfo>>({});

  // Function to update categories, categoryInfo and subcategories based on loaded queries
  const updateCategoriesAndInfo = (queriesData: Query[]) => {
    // Extract unique categories from loaded queries
    const uniqueCategories = [...new Set(queriesData.map(q => q.category))].sort();
    
    // Create a map to store subcategories for each category
    const subcategoriesByCategory: Record<string, Set<string>> = {};
    
    // Extract subcategories from queries
    queriesData.forEach(query => {
      if (!query.category || !query.subCategory) return;
      
      if (!subcategoriesByCategory[query.category]) {
        subcategoriesByCategory[query.category] = new Set<string>();
      }
      
      subcategoriesByCategory[query.category].add(query.subCategory);
    });
    
    // Create or update categoryInfo
    const newCategoryInfo: Record<string, CategoryInfo> = {};
    
    // Define color schemes for different categories
    const colorSchemes: Record<string, { textColor: string, buttonBg: string }> = {
      "Entra ID": { textColor: "text-blue-400", buttonBg: "bg-gray-800 hover:bg-gray-700" },
      "Defender for Identity": { textColor: "text-yellow-400", buttonBg: "bg-gray-800 hover:bg-gray-700" },
      "Defender for Endpoint": { textColor: "text-green-400", buttonBg: "bg-gray-800 hover:bg-gray-700" },
      "Defender for Office 365": { textColor: "text-orange-400", buttonBg: "bg-gray-800 hover:bg-gray-700" },
      "Defender for Cloud Apps": { textColor: "text-purple-400", buttonBg: "bg-gray-800 hover:bg-gray-700" },
      "Sentinel": { textColor: "text-red-400", buttonBg: "bg-gray-800 hover:bg-gray-700" },
      "Intune": { textColor: "text-cyan-400", buttonBg: "bg-gray-800 hover:bg-gray-700" }
    };
    
    // Apply default colors for new/unknown categories
    const defaultColors = { textColor: "text-indigo-400", buttonBg: "bg-gray-800 hover:bg-gray-700" };
    
    // Create category info for each unique category
    uniqueCategories.forEach(category => {
      const colors = colorSchemes[category] || defaultColors;
      
      newCategoryInfo[category] = {
        displayName: category,
        textColor: colors.textColor,
        buttonBg: colors.buttonBg,
        subCategories: subcategoriesByCategory[category] 
          ? Array.from(subcategoriesByCategory[category]).sort() 
          : [],
        fileName: "" // We no longer need this since we're loading all files dynamically
      };
    });
    
    setCategories(uniqueCategories);
    setCategoryInfo(newCategoryInfo);
    
    console.log("Updated categories:", uniqueCategories);
    console.log("Updated category info:", newCategoryInfo);
  };

  // Fixed function to fetch all queries
  const fetchAllQueries = async () => {
    setIsLoading(true);
    setLoadingError(null);
    
    try {
      // Hardcoded list of all JSON files in the queries directory
      // This is the simplest approach for a fixed set of files
      const queryFiles = [
        'defenderforcloudapps.json',
        'defenderforidentity.json',
        'defenderforoffice365.json',
        'entraid.json',
        'intune.json',
        'mde-attacksurfacereduction.json',
        'mde-endpoint.json',
        'mde-governance.json',
        'mde-smartscreen.json',
        'sentinel.json'
      ];
      
      const newQueriesByCategory: Record<string, Query[]> = {};
      const allQueries: Query[] = [];
      
      // Fetch and process each JSON file
      await Promise.all(queryFiles.map(async (fileName) => {
        const filePath = `/queries/${fileName}`;
        console.log(`Loading: ${filePath}`);
        
        try {
          const response = await fetch(filePath + `?t=${Date.now()}`);
          
          if (!response.ok) {
            console.warn(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
            return;
          }
          
          const text = await response.text();
          if (!text || text.trim() === '') {
            console.warn(`Empty response from ${fileName}`);
            return;
          }
          
          try {
            // Parse the JSON data - could be an array or a single object
            const data = JSON.parse(text);
            
            // Handle both array and single object formats
            const queryArray = Array.isArray(data) ? data : [data];
            
            // Process each query
            queryArray.forEach(query => {
              if (!query.category || !query.title || !query.query) {
                console.warn(`Skipping invalid query in ${fileName}`, query);
                return;
              }
              
              // Initialize category array if it doesn't exist
              if (!newQueriesByCategory[query.category]) {
                newQueriesByCategory[query.category] = [];
              }
              
              // Add the query to its category
              newQueriesByCategory[query.category].push(query);
              allQueries.push(query);
            });
            
            console.log(`Successfully loaded ${queryArray.length} queries from ${fileName}`);
          } catch (parseError) {
            console.error(`Error parsing JSON from ${fileName}:`, parseError);
          }
        } catch (fetchError) {
          console.error(`Error fetching ${fileName}:`, fetchError);
        }
      }));
      
      // Update categories and subcategories based on loaded queries
      updateCategoriesAndInfo(allQueries);
      
      console.log(`Total queries loaded: ${allQueries.length}`);
      setQueriesByCategory(newQueriesByCategory);
      setQueries(allQueries);
      
      // Auto-select first category with queries if nothing is selected
      if (allQueries.length > 0 && !selectedCategory) {
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

  // Handler to ensure state consistency when setting the subcategory
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

  // Handle search modal operations
  const handleCloseSearch = () => {
    setIsSearchModalOpen(false);
    setSearchTerm('');
  };

  // Debug component
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV === 'production') return null;
    
    return (
      <div className="fixed bottom-2 right-2 bg-black/70 text-white p-2 text-xs rounded z-50">
        <div>Total Queries: {queries.length}</div>
        <div>Categories with queries: {Object.keys(queriesByCategory).filter(cat => queriesByCategory[cat]?.length > 0).join(', ')}</div>
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

  // Handle force reload
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
        {/* Sidebar navigation */}
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

      {/* Search Modal */}
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
      
      {/* Debug info */}
      {renderDebugInfo()}
    </div>
  );
};

export default KQLLibrary;
