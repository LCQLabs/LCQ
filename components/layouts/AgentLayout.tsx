import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAgent } from '../../lib/hooks/useAgent';

interface AgentLayoutProps {
  children: React.ReactNode;
}

const AgentLayout: React.FC<AgentLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { id } = router.query;
  const [agentName, setAgentName] = useState<string>('');
  const [agentType, setAgentType] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const { agent, agents } = useAgent();
  
  useEffect(() => {
    if (id && typeof id === 'string') {
      // Extract agent name and type from URL or agent data
      if (agent) {
        setAgentName(agent.name || formatAgentName(id));
        setAgentType(agent.type || '');
      } else {
        setAgentName(formatAgentName(id));
        
        // Determine agent type from ID if possible
        if (id.includes('transaction')) setAgentType('transaction-optimizer');
        else if (id.includes('program')) setAgentType('program-deployment');
        else if (id.includes('account')) setAgentType('account-analyzer');
        else if (id.includes('contract') || id.includes('audit')) setAgentType('smart-contract-auditor');
        else if (id.includes('data') || id.includes('scraper')) setAgentType('data-scraper');
      }
    }
  }, [id, agent]);
  
  const formatAgentName = (agentId: string): string => {
    // Convert kebab-case to title case (e.g., "transaction-optimizer" to "Transaction Optimizer")
    return agentId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar agents={agents || []} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSettingsClick={toggleSettings} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
        {/* Agent Settings Drawer */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-gray-800 w-80 h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Agent Settings</h2>
                <button 
                  onClick={toggleSettings}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Agent Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    readOnly={!agent?.isCustom}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Agent Type</label>
                  <div className="p-2 bg-gray-700 border border-gray-600 rounded text-white">
                    {formatAgentName(agentType)}
                  </div>
                </div>
                
                {agent?.isCustom && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white h-20"
                      value={agent.description || ''}
                      onChange={(e) => {/* Handle description change */}}
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Model Context Protocol</label>
                  <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                    <option value="default">Default MCP</option>
                    <option value="custom">Custom MCP Endpoint</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">RPC Endpoint</label>
                  <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                    <option value="mainnet">Mainnet</option>
                    <option value="devnet">Devnet</option>
                    <option value="testnet">Testnet</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                {agent?.isCustom && (
                  <div className="mt-6 flex space-x-3">
                    <button className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-md transition-colors">
                      Delete Agent
                    </button>
                    <button className="px-4 py-2 bg-[#126444] hover:bg-[#08503d] rounded-md transition-colors">
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentLayout;