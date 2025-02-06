import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ChatInterface from '../common/ChatInterface';
import { useAgent } from '../../lib/hooks/useAgent';
import { useMcpClient } from '../../lib/hooks/useMcpClient';

interface VulnerabilityStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

const SmartContractAuditor: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<string | null>(null);
  const [vulnerabilityStats, setVulnerabilityStats] = useState<VulnerabilityStats>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  });
  
  const { agent } = useAgent('smart-contract-auditor');
  const mcpClient = useMcpClient();

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        type: 'agent',
        content: 'Welcome to Smart Contract Auditor! I can analyze Solana programs for vulnerabilities, inefficiencies, and optimization opportunities. Share a program ID or upload code to get started.',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const analyzeProgram = async (programId: string) => {
    try {
      setIsLoading(true);
      setCurrentProgram(programId);
      
      // Fetch program data via MCP
      const programData = await mcpClient.getProgramData(programId);
      
      // Process through agent
      const auditResult = await agent.auditProgram(programId, programData);
      
      // Update vulnerability stats
      setVulnerabilityStats({
        critical: auditResult.stats.critical || 0,
        high: auditResult.stats.high || 0,
        medium: auditResult.stats.medium || 0,
        low: auditResult.stats.low || 0,
        info: auditResult.stats.info || 0
      });
      
      return auditResult;
    } catch (error) {
      console.error('Error analyzing program:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
      // Check if the message contains a Solana program ID
      const programIdMatch = content.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/g);
      let response;
      
      if (programIdMatch && programIdMatch.length > 0) {
        const programId = programIdMatch[0];
        
        // Analyze the program
        response = await analyzeProgram(programId);
      } else {
        // Handle as a regular query
        response = await agent.processMessage(content, {
          currentProgram,
          vulnerabilityStats
        });
      }
      
      // Add agent response to chat
      const agentMessage = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: response.text,
        data: response.findings || response.data,
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
          content: `Error: ${error.message || 'Failed to analyze the program. Please try again.'}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      // Add file upload message
      setMessages(prev => [
        ...prev,
        {
          id: `file-${Date.now()}`,
          type: 'user',
          content: `Uploaded file: ${file.name}`,
          attachment: { name: file.name, type: file.type },
          timestamp: new Date().toISOString()
        }
      ]);
      
      // Read file content
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      
      // Process through agent
      const auditResult = await agent.auditCode(fileContent, file.name);
      
      // Update vulnerability stats
      setVulnerabilityStats({
        critical: auditResult.stats.critical || 0,
        high: auditResult.stats.high || 0,
        medium: auditResult.stats.medium || 0,
        low: auditResult.stats.low || 0,
        info: auditResult.stats.info || 0
      });
      
      // Add agent response to chat
      const agentMessage = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: auditResult.text,
        data: auditResult.findings,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      console.error('Error processing file:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'error',
          content: `Error: ${error.message || 'Failed to analyze the file. Please try again.'}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "Audit this program: BTC7SSkyyrWWfJMbW4BC3qQkFTCCzFWpfuK4cHeBZ2cu",
    "What are common vulnerabilities in Solana programs?",
    "Explain reentrancy attacks in Solana",
    "Check my program for arithmetic overflow issues",
    "How can I optimize compute units in my program?"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-[#479178]">Smart Contract Auditor</h1>
        
        {currentProgram && (
          <div className="mt-2 text-sm">
            <p className="text-gray-300">Current program: 
              <span className="ml-2 text-[#91d0b8]">{currentProgram}</span>
            </p>
            
            <div className="mt-2 flex gap-3">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                <span className="text-gray-300">{vulnerabilityStats.critical}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
                <span className="text-gray-300">{vulnerabilityStats.high}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                <span className="text-gray-300">{vulnerabilityStats.medium}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                <span className="text-gray-300">{vulnerabilityStats.low}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
                <span className="text-gray-300">{vulnerabilityStats.info}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        isLoading={isLoading}
        suggestedPrompts={suggestedPrompts}
        allowFileUpload={true}
        fileTypes=".rs,.ts,.js,.json"
      />
    </div>
  );
};

export default SmartContractAuditor;