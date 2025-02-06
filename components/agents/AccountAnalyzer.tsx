import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ChatInterface from '../common/ChatInterface';
import { useAgent } from '../../lib/hooks/useAgent';
import { useMcpClient } from '../../lib/hooks/useMcpClient';
import { validateSolanaAddress } from '../../utils/validation';

const AccountAnalyzer: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accountHistory, setAccountHistory] = useState<string[]>([]);
  
  const { agent } = useAgent('account-analyzer');
  const mcpClient = useMcpClient();

  useEffect(() => {
    // Load recently analyzed accounts from local storage
    const savedAccounts = localStorage.getItem('analyzedAccounts');
    if (savedAccounts) {
      setAccountHistory(JSON.parse(savedAccounts));
    }
    
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        type: 'agent',
        content: 'Welcome to Account Analyzer! I can help you analyze any Solana account, including wallet addresses, NFT collections, and program accounts. Simply share an address you\'d like to analyze.',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message to the chat
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Check if the message contains a Solana address
      const addressMatch = content.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/g);
      let response;
      
      if (addressMatch && addressMatch.length > 0) {
        const address = addressMatch[0];
        
        // Validate the address
        if (!validateSolanaAddress(address)) {
          throw new Error('Invalid Solana address format');
        }
        
        // Store this address in history
        const newHistory = [address, ...accountHistory.filter(a => a !== address)].slice(0, 10);
        setAccountHistory(newHistory);
        localStorage.setItem('analyzedAccounts', JSON.stringify(newHistory));
        
        // Fetch account data via MCP
        const accountData = await mcpClient.getAccountInfo(address);
        
        // Process through agent
        response = await agent.analyzeAccount(address, accountData);
      } else {
        // Handle as a regular query
        response = await agent.processMessage(content);
      }
      
      // Add agent response to chat
      const agentMessage = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: response.text,
        data: response.data,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      console.error('Error processing message:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'error',
          content: `Error: ${error.message || 'Failed to analyze the account. Please try again.'}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "Analyze this wallet: 7aqH6qcgZj4g33QQNNmP1LACNmpomujNNCZXVjJUQVgz",
    "Show me the tokens held by this account",
    "What programs has this wallet interacted with?",
    "Compare this wallet's activity with typical patterns",
    "Show me the SOL balance history for this wallet"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-[#479178]">Account Analyzer</h1>
        {accountHistory.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-400">Recent accounts:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {accountHistory.slice(0, 3).map(account => (
                <button
                  key={account}
                  onClick={() => handleSendMessage(`Analyze this address: ${account}`)}
                  className="px-2 py-1 text-xs bg-[#126444] rounded-md hover:bg-[#186750] transition-colors"
                >
                  {account.slice(0, 4)}...{account.slice(-4)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        suggestedPrompts={suggestedPrompts}
      />
    </div>
  );
};

export default AccountAnalyzer;