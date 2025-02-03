import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ChatInterface from '../common/ChatInterface';
import { useAgent } from '../../lib/hooks/useAgent';
import { useMcpClient } from '../../lib/hooks/useMcpClient';

const TransactionOptimizer: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  
  const { agent } = useAgent('transaction-optimizer');
  const mcpClient = useMcpClient();

  useEffect(() => {
    // Fetch current network status when component mounts
    fetchNetworkStatus();
    
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        type: 'agent',
        content: 'Welcome to Transaction Optimizer! I can help you optimize your Solana transactions for better fees and timing. What would you like to optimize today?',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const fetchNetworkStatus = async () => {
    try {
      const status = await mcpClient.getNetworkStatus();
      setNetworkStatus(status);
    } catch (error) {
      console.error('Failed to fetch network status:', error);
    }
  };

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
      // Process the message through the agent
      const response = await agent.processMessage(content, {
        currentFee: networkStatus?.currentFee,
        congestionLevel: networkStatus?.congestionLevel,
        historicalData: networkStatus?.historicalData
      });
      
      // Add agent response to chat
      const agentMessage = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: response.text,
        data: response.data, // Additional structured data if available
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Update network status after processing
      fetchNetworkStatus();
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'error',
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "What's the optimal time and fee for sending SOL today?",
    "I need to make 5 transactions, how can I minimize fees?",
    "What's the current network congestion level?",
    "When is the best time to deploy my program?",
    "Explain how Solana fees work"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-[#479178]">Transaction Optimizer</h1>
        {networkStatus && (
          <div className="mt-2 text-sm">
            <p className="text-gray-300">Current congestion: 
              <span className={`ml-2 ${
                networkStatus.congestionLevel === 'Low' ? 'text-green-400' :
                networkStatus.congestionLevel === 'Medium' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {networkStatus.congestionLevel}
              </span>
            </p>
            <p className="text-gray-300">Recommended fee: 
              <span className="ml-2 text-[#91d0b8]">
                {networkStatus.recommendedFee} SOL
              </span>
            </p>
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

export default TransactionOptimizer;