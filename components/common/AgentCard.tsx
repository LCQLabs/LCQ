import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  type: 'transaction-optimizer' | 'program-deployment' | 'account-analyzer' | 'smart-contract-auditor' | 'data-scraper';
  isActive?: boolean;
  onClick?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
  id,
  name,
  description,
  type,
  isActive = false,
  onClick
}) => {
  const router = useRouter();
  
  const getAgentIcon = () => {
    switch (type) {
      case 'transaction-optimizer':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'program-deployment':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16L12 12M12 12L16 8M12 12L8 8M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'account-analyzer':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'smart-contract-auditor':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'data-scraper':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V12M12 12V18M12 12H18M12 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/agents/${id}`);
    }
  };
  
  return (
    <div 
      className={`p-4 rounded-lg transition-all cursor-pointer ${
        isActive 
          ? 'bg-[#186750] text-white' 
          : 'bg-gray-800 hover:bg-[#126444] text-gray-300 hover:text-white'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-full ${isActive ? 'bg-[#7eb7a1] text-[#08503d]' : 'bg-gray-700'}`}>
          {getAgentIcon()}
        </div>
        <h3 className="ml-3 text-lg font-medium">{name}</h3>
      </div>
      
      <p className="text-sm opacity-80 mb-4">{description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-1 rounded bg-black bg-opacity-30">
          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
        
        <Link 
          href={`/agents/${id}`}
          className="text-sm text-[#91d0b8] hover:text-[#c7e4d4] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default AgentCard;