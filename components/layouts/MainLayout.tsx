import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ThemeProvider from '../common/ThemeProvider';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'LCQ - MCP-Powered AI Agents for Solana',
  description = 'Create and deploy intelligent, context-aware AI agents that interact with the Solana blockchain ecosystem using MCP'
}) => {
  const router = useRouter();
  
  // Determine if we're on a maintenance page
  const isMaintenancePage = router.pathname === '/maintenance';
  
  // Determine if we're on an auth page (login, register, etc.)
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(router.pathname);
  
  // Get title for the current route
  const getPageTitle = () => {
    if (router.pathname.startsWith('/agents/')) {
      const agentId = router.query.id as string;
      if (agentId) {
        const formattedAgentName = agentId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return `${formattedAgentName} | LCQ`;
      }
    }
    
    const routeTitles: Record<string, string> = {
      '/': 'Dashboard | LCQ',
      '/agents': 'Agents | LCQ',
      '/agents/create': 'Create Agent | LCQ',
      '/settings': 'Settings | LCQ',
      '/login': 'Login | LCQ',
      '/register': 'Register | LCQ',
      '/forgot-password': 'Reset Password | LCQ',
      '/maintenance': 'Maintenance | LCQ'
    };
    
    return routeTitles[router.pathname] || title;
  };
  
  return (
    <ThemeProvider>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://lcq.gg${router.asPath}`} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://lcq.gg/og-image.png" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@LCQLabs" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://lcq.gg/twitter-image.png" />
      </Head>
      
      {/* Maintenance Banner */}
      {!isMaintenancePage && process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' && (
        <div className="bg-yellow-600 text-white py-2 px-4 text-center">
          <p>
            LCQ is currently undergoing scheduled maintenance. Some features may be unavailable.
            <button 
              className="ml-2 underline"
              onClick={() => router.push('/maintenance')}
            >
              Learn more
            </button>
          </p>
        </div>
      )}
      
      {/* Under Maintenance Page */}
      {isMaintenancePage ? (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
          {children}
        </div>
      ) : isAuthPage ? (
        /* Auth Pages Layout */
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {children}
          </div>
        </div>
      ) : (
        /* Main App Layout - no container here, children should implement their own layouts */
        <>{children}</>
      )}
      
      {/* Global Notification System */}
      <div id="notification-container" className="fixed bottom-4 right-4 z-50 space-y-2">
        {/* Notifications will be injected here dynamically */}
      </div>
      
      {/* Global Analytics & Tracking (you would include this in a real app) */}
      {process.env.NODE_ENV === 'production' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Analytics code would go here
              console.log('Analytics initialized');
            `
          }}
        />
      )}
    </ThemeProvider>
  );
};

export default MainLayout;