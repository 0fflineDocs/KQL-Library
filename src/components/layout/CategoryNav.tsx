import React from 'react';
import Button from '../ui/Button';
import { cn } from '@/lib/utils';

interface CategoryInfo {
  displayName: string;
  textColor: string;
  buttonBg: string;
  subCategories: string[];
  fileName: string;
}

interface CategoryNavProps {
  categories: string[];
  categoryInfo: Record<string, CategoryInfo>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubCategory: (subcategory: string | null) => void;
}

const CategoryNav = ({ 
  categories, 
  categoryInfo, 
  selectedCategory, 
  setSelectedCategory,
  setSelectedSubCategory
}: CategoryNavProps) => {
  return (
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
  );
};

export default CategoryNav;
