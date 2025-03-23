import React from 'react';
import { Search, Github } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  onOpenSearch: () => void;
}

const Header = ({ onOpenSearch }: HeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
          KQL Library
        </h1>
        <div className="flex items-center gap-4">
          <Button
            className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
            onClick={onOpenSearch}
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
  );
};

export default Header;
