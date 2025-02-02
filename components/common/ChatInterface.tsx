import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'error' | 'system';
  content: string;
  timestamp: string;
  data?: any;
  attachment?: {
    name: string;
    type: string;
  };
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onFileUpload?: (file: File) => void;
  isLoading?: boolean;
  suggestedPrompts?: string[];
  allowFileUpload?: boolean;
  fileTypes?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onFileUpload,
  isLoading = false,
  suggestedPrompts = [],
  allowFileUpload = false,
  fileTypes = ''
}) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      // Hide suggestions after first message
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
    setShowSuggestions(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onFileUpload) {
      onFileUpload(e.target.files[0]);
      // Reset the input
      e.target.value = '';
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Render a code block with syntax highlighting
  const renderCode = (code: string, language: string = '') => {
    return (
      <pre className="p-4 bg-gray-800 rounded-md overflow-x-auto">
        <code className={language ? `language-${language}` : ''}>
          {code}
        </code>
      </pre>
    );
  };
  
  // Process message content to render markdown-like formatting
  const renderMessageContent = (content: string) => {
    // Process code blocks
    const parts = content.split(/```(\w*)\n([\s\S]*?)```/g);
    
    if (parts.length === 1) {
      // No code blocks, render as plain text with line breaks
      return (
        <div className="whitespace-pre-wrap">
          {content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      );
    }
    
    return (
      <div>
        {parts.map((part, index) => {
          if (index % 3 === 0) {
            // Regular text
            return (
              <div key={index} className="whitespace-pre-wrap mb-2">
                {part}
              </div>
            );
          } else if (index % 3 === 1) {
            // Language identifier
            return null;
          } else {
            // Code block
            const language = parts[index - 1];
            return (
              <div key={index} className="mb-4">
                {renderCode(part, language)}
              </div>
            );
          }
        })}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-[#126444] text-white'
                  : message.type === 'error'
                    ? 'bg-red-900 text-white'
                    : 'bg-gray-800 text-white'
              }`}
            >
              {message.attachment && (
                <div className="mb-2 p-2 bg-gray-700 rounded text-sm">
                  <span>📎 {message.attachment.name}</span>
                </div>
              )}
              
              {renderMessageContent(message.content)}
              
              {message.data && message.data.visualizations && (
                <div className="mt-4 p-2 bg-gray-900 rounded">
                  {/* Visualization placeholder - in a real app, you'd render charts/graphs here */}
                  <div className="text-center text-sm text-gray-400">
                    [Visualization rendered here]
                  </div>
                </div>
              )}
              
              <div className="mt-2 text-right">
                <span className="text-xs opacity-50">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-4 flex items-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-[#91d0b8] rounded-full"></div>
                <div className="h-2 w-2 bg-[#91d0b8] rounded-full"></div>
                <div className="h-2 w-2 bg-[#91d0b8] rounded-full"></div>
              </div>
              <span className="ml-3 text-sm text-gray-300">Processing...</span>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="mb-4">No messages in this conversation yet.</p>
              <p>Type something to start chatting!</p>
            </div>
          </div>
        )}
        
        {/* Suggested prompts */}
        {showSuggestions && suggestedPrompts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-gray-400 mb-2 text-sm">Suggested questions:</h3>
            <div className="grid grid-cols-1 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="text-left p-3 bg-gray-800 hover:bg-[#08503d] rounded-lg text-white transition-colors"
                  onClick={() => handleSuggestionClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <textarea
              className="w-full p-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#479178]"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              maxLength={2000}
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {input.length}/2000
            </div>
          </div>
          
          {allowFileUpload && onFileUpload && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept={fileTypes}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </Button>
            </>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            disabled={!input.trim() || isLoading}
            className="px-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;