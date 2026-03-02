import React from 'react';
import { Search } from 'lucide-react';
import Button from '../ui/Button';
import { SocialIcon } from '../ui/SocialIcons';

interface HeaderProps {
  onOpenSearch: () => void;
}

const Header = ({ onOpenSearch }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-[var(--color-bg-0)]/95 backdrop-blur-md border-b border-[var(--color-divider)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading text-gradient">
          KQL Library
        </h1>
        <div className="flex items-center gap-3">
          <Button
            className="btn-ghost text-[var(--color-fg-1)] hover:text-[var(--color-fg-0)] p-2 rounded-lg transition-colors duration-200"
            onClick={onOpenSearch}
            title="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Social Media Icons using SimpleIcons */}        
          <SocialIcon 
            type="linkedin" 
            href="https://www.linkedin.com/in/simon-h%C3%A5kansson-20163b137/" 
          />
          
          <SocialIcon 
            type="github" 
            href="https://github.com/0fflineDocs/" 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
