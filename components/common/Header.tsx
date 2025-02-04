import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from './Button';

interface HeaderProps {
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Get current agent name from URL if on agent page
  const getPageTitle = () => {
    if (router.pathname.startsWith('/agents/')) {
      // Extract agent type from URL
      const agentType = router.query.id as string;
      if (!agentType) return 'Agent';
      
      // Format agent name
      return agentType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Default titles for known routes
    const routeTitles: Record<string, string> = {
      '/': 'Dashboard',
      '/agents': 'Agents',
      '/agents/create': 'Create Agent',
      '/settings': 'Settings'
    };
    
    return routeTitles[router.pathname] || 'LCQ';
  };
  
  return (
    <header className="bg-gray-900 text-white border-b border-gray-800">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button 
            className="mr-4 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Page title */}
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Status indicators */}
          <div className="hidden md:flex items-center space-x-6 mr-4">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-gray-300">Online</span>
            </div>
            
            <div className="hidden lg:flex items-center">
              <span className="text-sm text-gray-300">MCP Status:</span>
              <span className="ml-2 text-sm text-green-400">Connected</span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {router.pathname.startsWith('/agents/') && (
              <Link href="/agents" passHref>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  }
                >
                  All Agents
                </Button>
              </Link>
            )}
            
            <Link href="https://lcqdocs.site" target="_blank" passHref>
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                Docs
              </Button>
            </Link>
            
            <button
              className="p-2 text-gray-300 hover:text-white transition-colors"
              onClick={onSettingsClick}
              aria-label="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="px-4 py-3 bg-gray-800 lg:hidden">
          <nav className="grid gap-2">
            <Link 
              href="/" 
              className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/agents" 
              className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Agents
            </Link>
            <Link 
              href="/settings" 
              className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <div className="pt-2 mt-2 border-t border-gray-700">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-sm text-gray-300">MCP Status: Connected</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;