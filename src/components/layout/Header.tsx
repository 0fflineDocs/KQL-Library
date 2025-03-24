import React from 'react';
import { Search, Github, Twitter, Mail, Globe } from 'lucide-react';
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
        <div className="flex items-center gap-3">
          <Button
            className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
            onClick={onOpenSearch}
            title="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* X (Twitter) */}
          <Button
            className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
            onClick={() => window.open('https://x.com/0fflineDocs', '_blank')}
            title="X (Twitter)"
          >
            <Twitter className="w-5 h-5" />
          </Button>

          {/* Bluesky */}
          <Button
            className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
            onClick={() => window.open('https://bsky.app/profile/simonhakansson.com', '_blank')}
            title="Bluesky"
          >
            <Globe className="w-5 h-5" />
          </Button>

          {/* LinkedIn */}
          <Button
            className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50 flex items-center justify-center"
            onClick={() => window.open('https://www.linkedin.com/in/simon-h%C3%A5kansson-20163b137/', '_blank')}
            title="LinkedIn"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </Button>

          {/* Email */}
          <Button
            className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
            onClick={() => window.location.href = 'mailto:simon.ludvig.hakansson@gmail.com'}
            title="Email"
          >
            <Mail className="w-5 h-5" />
          </Button>

          {/* GitHub */}
          <Button
            className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
            onClick={() => window.open('https://github.com/0fflineDocs/KQL', '_blank')}
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
