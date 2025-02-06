import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAgent } from '../../lib/hooks/useAgent';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { agents } = useAgent();
  
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar agents={agents || []} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSettingsClick={toggleSettings} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
        {/* Global Settings Drawer */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-gray-800 w-80 h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Settings</h2>
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
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3 text-[#91d0b8]">General</h3>
                  
                  <div className="mb-4">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="dark-mode" 
                          className="sr-only"
                          defaultChecked={true}
                        />
                        <label 
                          htmlFor="dark-mode" 
                          className="block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"
                        >
                          <span className="block h-6 w-6 rounded-full bg-[#479178] transform translate-x-4"></span>
                        </label>
                      </div>
                    </label>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                    <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3 text-[#91d0b8]">MCP Configuration</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Default MCP Endpoint</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="https://mcp.example.com"
                      value="https://mcp.lcq.gg"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                    <input 
                      type="password" 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Enter your API key"
                      value="••••••••••••••••"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3 text-[#91d0b8]">Solana Configuration</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Default Network</label>
                    <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                      <option value="mainnet">Mainnet</option>
                      <option value="devnet">Devnet</option>
                      <option value="testnet">Testnet</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Custom RPC URL</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="https://rpc.example.com"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="w-full px-4 py-2 bg-[#126444] hover:bg-[#08503d] rounded-md transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;