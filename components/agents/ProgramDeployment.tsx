import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ChatInterface from '../common/ChatInterface';
import { useAgent } from '../../lib/hooks/useAgent';
import { useMcpClient } from '../../lib/hooks/useMcpClient';

const ProgramDeployment: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<{
    devnet: string;
    testnet: string;
    mainnet: string;
  }>({
    devnet: 'operational',
    testnet: 'operational',
    mainnet: 'operational'
  });
  
  const { agent } = useAgent('program-deployment');
  const mcpClient = useMcpClient();

  useEffect(() => {
    // Fetch network status for different clusters
    fetchNetworkStatus();
    
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        type: 'agent',
        content: 'Welcome to Program Deployment Assistant! I can help you deploy Solana programs across different environments (devnet, testnet, mainnet). How can I assist with your deployment today?',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const fetchNetworkStatus = async () => {
    try {
      const [devnetStatus, testnetStatus, mainnetStatus] = await Promise.all([
        mcpClient.getClusterStatus('devnet'),
        mcpClient.getClusterStatus('testnet'),
        mcpClient.getClusterStatus('mainnet-beta')
      ]);
      
      setNetworkStatus({
        devnet: devnetStatus.status,
        testnet: testnetStatus.status,
        mainnet: mainnetStatus.status
      });
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
      // Process through agent
      const response = await agent.processMessage(content, {
        networkStatus
      });
      
      // Add agent response to chat
      const agentMessage = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: response.text,
        data: response.data,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // If the message includes code blocks, add them to the code section
      if (response.codeBlocks && response.codeBlocks.length > 0) {
        // Handle code blocks (this would integrate with your code display component)
        console.log('Code blocks to display:', response.codeBlocks);
      }
    } catch (error: any) {
      console.error('Error processing message:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'error',
          content: `Error: ${error.message || 'Failed to process your request. Please try again.'}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'outage':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const suggestedPrompts = [
    "How do I deploy my program to devnet?",
    "What's the process for upgrading a program?",
    "Explain the differences between devnet, testnet, and mainnet deployment",
    "What are the costs for deploying to mainnet?",
    "Show me the command to check my program deployment"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-[#479178]">Program Deployment Assistant</h1>
        <div className="flex gap-4 mt-2 text-sm">
          <div>
            <span className="text-gray-400">Devnet: </span>
            <span className={getStatusColor(networkStatus.devnet)}>
              {networkStatus.devnet}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Testnet: </span>
            <span className={getStatusColor(networkStatus.testnet)}>
              {networkStatus.testnet}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Mainnet: </span>
            <span className={getStatusColor(networkStatus.mainnet)}>
              {networkStatus.mainnet}
            </span>
          </div>
        </div>
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

export default ProgramDeployment;