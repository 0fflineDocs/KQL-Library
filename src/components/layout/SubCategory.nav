import React from 'react';
import Button from '../ui/Button';
import { cn } from '@/lib/utils';

interface SubcategoryNavProps {
  selectedCategory: string | null;
  categoryInfo: any;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (subcategory: string | null) => void;
}

const SubcategoryNav = ({ 
  selectedCategory, 
  categoryInfo, 
  selectedSubCategory, 
  setSelectedSubCategory 
}: SubcategoryNavProps) => {
  if (!selectedCategory || !categoryInfo[selectedCategory]?.subCategories?.length) {
    return null;
  }

  return (
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
  );
};

export default SubcategoryNav;
