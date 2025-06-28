import React from 'react';
import { Menu, Moon, Sun, ChevronRight, Brain, Zap, Trophy, Settings } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  darkMode: boolean;
  hackathonMode?: boolean;
  toggleHackathonMode?: () => void;
  aiState: {
    quantumState: number[];
    chaosState: number[];
    activePerspectives: string[];
    ethicalScore: number;
    processingPower: number;
  };
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  toggleDarkMode,
  darkMode,
  hackathonMode = false,
  toggleHackathonMode,
  aiState
}) => {
  return (
    <header className={`h-16 flex items-center justify-between px-4 border-b transition-colors duration-300 ${
      hackathonMode 
        ? darkMode 
          ? 'bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700' 
          : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300'
        : darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center">
        {!hackathonMode && (
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Menu size={20} />
          </button>
        )}
        
        <div className="ml-4 flex items-center">
          {hackathonMode ? (
            <Trophy className="text-yellow-500" size={24} />
          ) : (
            <Brain className="text-purple-600" size={24} />
          )}
          <h1 className="ml-2 text-xl font-bold">
            Codette AI
            {hackathonMode && <span className="text-yellow-500 ml-2">Hackathon Demo</span>}
          </h1>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            hackathonMode
              ? 'bg-yellow-500 text-yellow-900'
              : darkMode 
                ? 'bg-purple-900 text-purple-200' 
                : 'bg-purple-100 text-purple-800'
          }`}>
            v2.0 {hackathonMode && 'DEMO'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {hackathonMode && (
          <div className={`hidden md:flex items-center py-1 px-3 rounded-full text-sm ${
            darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
          }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="font-medium">Live Demo Active</span>
          </div>
        )}
        
        <div className={`hidden md:flex items-center py-1 px-3 rounded-full text-sm ${
          darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
        }`}>
          <Zap size={14} className="mr-1" />
          <span className="font-medium">Quantum:</span>
          <span className="ml-1 font-mono">
            [{aiState.quantumState.map(v => v.toFixed(1)).join(', ')}]
          </span>
        </div>
        
        {toggleHackathonMode && (
          <button
            onClick={toggleHackathonMode}
            className={`p-2 rounded-md transition-colors ${
              hackathonMode
                ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600'
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
            }`}
            title={hackathonMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}
          >
            {hackathonMode ? <Settings size={20} /> : <Trophy size={20} />}
          </button>
        )}
        
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;