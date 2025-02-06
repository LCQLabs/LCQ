import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ChatInterface from '../common/ChatInterface';
import { useAgent } from '../../lib/hooks/useAgent';
import { useMcpClient } from '../../lib/hooks/useMcpClient';

interface Report {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  status: 'complete' | 'running' | 'error';
}

const DataScraper: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);
  
  const { agent } = useAgent('data-scraper');
  const mcpClient = useMcpClient();

  useEffect(() => {
    // Load saved reports
    fetchSavedReports();
    
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        type: 'agent',
        content: 'Welcome to Data Scraper! I can collect and analyze on-chain data from Solana, including token transfers, program interactions, and market data. What information would you like to gather today?',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const fetchSavedReports = async () => {
    try {
      // This would fetch from your backend in a real implementation
      const savedReports = localStorage.getItem('scraperReports');
      if (savedReports) {
        setReports(JSON.parse(savedReports));
      }
    } catch (error) {
      console.error('Failed to fetch saved reports:', error);
    }
  };

  const saveReport = (report: Report) => {
    const updatedReports = [report, ...reports];
    setReports(updatedReports);
    localStorage.setItem('scraperReports', JSON.stringify(updatedReports));
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
    setCurrentQuery(content);
    
    try {
      // Check if this is a data scraping request
      const isScrapingRequest = /show|get|fetch|collect|analyze|transactions|transfers|data|activity/i.test(content);
      
      if (isScrapingRequest) {
        // First, send a confirmation that we're processing
        const processingMessage = {
          id: `processing-${Date.now()}`,
          type: 'agent',
          content: 'I\'m gathering that data for you. This might take a moment...',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, processingMessage]);
        
        // Process through agent - for longer running requests
        const response = await agent.scrapeData(content);
        
        // Create a report from this request
        const report: Report = {
          id: `report-${Date.now()}`,
          name: `Report: ${content.slice(0, 30)}${content.length > 30 ? '...' : ''}`,
          type: determineReportType(content),
          createdAt: new Date().toISOString(),
          status: 'complete'
        };
        
        saveReport(report);
        
        // Replace the processing message with the actual response
        setMessages(prev => prev.map(msg => 
          msg.id === processingMessage.id 
            ? {
                id: `agent-${Date.now()}`,
                type: 'agent',
                content: response.text,
                data: response.data,
                timestamp: new Date().toISOString(),
                reportId: report.id
              }
            : msg
        ));
      } else {
        // Handle as a regular query
        const response = await agent.processMessage(content);
        
        // Add agent response to chat
        const agentMessage = {
          id: `agent-${Date.now()}`,
          type: 'agent',
          content: response.text,
          data: response.data,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, agentMessage]);
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
      setCurrentQuery(null);
    }
  };
  
  const determineReportType = (query: string): string => {
    if (/transaction|txn|tx/i.test(query)) return 'transaction';
    if (/token|spl|transfer/i.test(query)) return 'token';
    if (/nft|collection/i.test(query)) return 'nft';
    if (/program|contract/i.test(query)) return 'program';
    if (/market|price|volume/i.test(query)) return 'market';
    return 'general';
  };
  
  const handleExportReport = (reportId: string, format: 'csv' | 'json') => {
    // Find the message with this report ID
    const reportMessage = messages.find(msg => msg.reportId === reportId);
    
    if (!reportMessage || !reportMessage.data) {
      console.error('Report data not found');
      return;
    }
    
    let content: string;
    let filename: string;
    
    if (format === 'json') {
      content = JSON.stringify(reportMessage.data, null, 2);
      filename = `lcq_report_${reportId}.json`;
    } else {
      // Convert to CSV - this is a simplified implementation
      const headers = Object.keys(reportMessage.data[0] || {}).join(',');
      const rows = reportMessage.data.map((row: any) => 
        Object.values(row).join(',')
      ).join('\n');
      content = `${headers}\n${rows}`;
      filename = `lcq_report_${reportId}.csv`;
    }
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([content], {type: format === 'json' ? 'application/json' : 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const suggestedPrompts = [
    "Show me JUP token transfers in the last 24 hours",
    "Get transaction volume for Jupiter exchange",
    "Analyze SOL transfers over 100 SOL in the past week",
    "List all NFT sales for DeGods collection today",
    "Track the transactions for this wallet address"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-[#479178]">Data Scraper</h1>
        
        {reports.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-400">Recent reports:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {reports.slice(0, 3).map(report => (
                <div 
                  key={report.id}
                  className="px-2 py-1 text-xs bg-[#126444] rounded-md flex items-center"
                >
                  <span className="mr-2">{report.name}</span>
                  <button 
                    onClick={() => handleExportReport(report.id, 'csv')}
                    className="text-[#c7e4d4] hover:text-white transition-colors"
                    title="Export as CSV"
                  >
                    CSV
                  </button>
                  <span className="mx-1">|</span>
                  <button 
                    onClick={() => handleExportReport(report.id, 'json')}
                    className="text-[#c7e4d4] hover:text-white transition-colors"
                    title="Export as JSON"
                  >
                    JSON
                  </button>
                </div>
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

export default DataScraper;