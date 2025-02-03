import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from './Button';

interface Agent {
  id: string;
  name: string;
  type: 'transaction-optimizer' | 'program-deployment' | 'account-analyzer' | 'smart-contract-auditor' | 'data-scraper';
}

interface SidebarProps {
  agents: Agent[];
}

const Sidebar: React.FC<SidebarProps> = ({ agents = [] }) => {
  const router = useRouter();
  
  // Filter the agents list by type
  const getAgentIcon = (type: Agent['type']) => {
    switch (type) {
      case 'transaction-optimizer':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'program-deployment':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16L12 12M12 12L16 8M12 12L8 8M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'account-analyzer':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'smart-contract-auditor':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'data-scraper':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V12M12 12V18M12 12H18M12 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };
  
  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col">
      {/* Logo and brand */}
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-[#479178]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM9 9C9 7.89543 9.89543 7 11 7H13C14.1046 7 15 7.89543 15 9V15C15 16.1046 14.1046 17 13 17H11C9.89543 17 9 16.1046 9 15V9Z" fill="currentColor"/>
          </svg>
          <span className="text-white text-xl font-bold">LCQ</span>
        </Link>
      </div>
      
      {/* New agent button */}
      <div className="p-4">
        <Link href="/agents/create" passHref>
          <Button
            variant="primary"
            fullWidth
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            New Agent
          </Button>
        </Link>
      </div>
      
      {/* Agent navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {agents.map((agent) => (
          <Link 
            href={`/agents/${agent.id}`} 
            key={agent.id}
            passHref
          >
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                router.query.id === agent.id
                  ? 'bg-[#126444] text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className={`${
                router.query.id === agent.id
                  ? 'text-[#91d0b8]'
                  : 'text-gray-400'
              }`}>
                {getAgentIcon(agent.type)}
              </div>
              <span>{agent.name}</span>
            </div>
          </Link>
        ))}
        
        {/* Default agent types if no custom agents are created */}
        {agents.length === 0 && (
          <>
            <Link href="/agents/transaction-optimizer" passHref>
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                  router.asPath.includes('transaction-optimizer')
                    ? 'bg-[#126444] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className={`${
                  router.asPath.includes('transaction-optimizer')
                    ? 'text-[#91d0b8]'
                    : 'text-gray-400'
                }`}>
                  {getAgentIcon('transaction-optimizer')}
                </div>
                <span>Transaction Optimizer</span>
              </div>
            </Link>
            
            <Link href="/agents/program-deployment" passHref>
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                  router.asPath.includes('program-deployment')
                    ? 'bg-[#126444] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className={`${
                  router.asPath.includes('program-deployment')
                    ? 'text-[#91d0b8]'
                    : 'text-gray-400'
                }`}>
                  {getAgentIcon('program-deployment')}
                </div>
                <span>Program Deployment</span>
              </div>
            </Link>
            
            <Link href="/agents/account-analyzer" passHref>
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                  router.asPath.includes('account-analyzer')
                    ? 'bg-[#126444] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className={`${
                  router.asPath.includes('account-analyzer')
                    ? 'text-[#91d0b8]'
                    : 'text-gray-400'
                }`}>
                  {getAgentIcon('account-analyzer')}
                </div>
                <span>Account Analyzer</span>
              </div>
            </Link>
            
            <Link href="/agents/smart-contract-auditor" passHref>
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                  router.asPath.includes('smart-contract-auditor')
                    ? 'bg-[#126444] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className={`${
                  router.asPath.includes('smart-contract-auditor')
                    ? 'text-[#91d0b8]'
                    : 'text-gray-400'
                }`}>
                  {getAgentIcon('smart-contract-auditor')}
                </div>
                <span>Smart Contract Auditor</span>
              </div>
            </Link>
            
            <Link href="/agents/data-scraper" passHref>
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                  router.asPath.includes('data-scraper')
                    ? 'bg-[#126444] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className={`${
                  router.asPath.includes('data-scraper')
                    ? 'text-[#91d0b8]'
                    : 'text-gray-400'
                }`}>
                  {getAgentIcon('data-scraper')}
                </div>
                <span>Data Scraper</span>
              </div>
            </Link>
          </>
        )}
      </nav>
      
      {/* User profile section */}
      <div className="p-4 border-t border-gray-800 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-[#186750] flex items-center justify-center text-white">
          LC
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">LCQ User</p>
          <p className="text-xs text-gray-400 truncate">Connected to Solana</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;