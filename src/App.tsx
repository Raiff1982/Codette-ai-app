import React, { useState, useEffect, useRef } from 'react';
import { Zap, Brain, Settings, Moon, ChevronRight, Send, Bot, Server, Sparkles, Circle, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ChatInterface from './components/ChatInterface';
import VisualizationPanel from './components/VisualizationPanel';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HackathonDashboard from './components/HackathonDashboard';
import CognitionCocooner from './services/CognitionCocooner';
import SecureAICore from './services/SecureAICore';
import { CodetteResponse } from './components/CodetteComponents';
import { CodetteContext } from './core/hooks/useCodetteContext';
import CodetteFallbackHandler from './components/CodetteFallbackHandler';
import { SecurityUtils } from './utils/security';

interface Message {
  role: string;
  content: string;
  timestamp: Date;
  metadata?: CodetteResponse;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

// Only create Supabase client if credentials are available and valid
if (supabaseUrl && supabaseKey && SecurityUtils.validateUrl(supabaseUrl)) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn('Failed to create Supabase client:', error);
  }
}

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hackathonMode, setHackathonMode] = useState(true); // Enable hackathon mode by default
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiState, setAiState] = useState({
    quantumState: [0.3, 0.7, 0.5],
    chaosState: [0.2, 0.8, 0.4, 0.6],
    activePerspectives: ['newton', 'davinci', 'neural_network', 'philosophical', 'quantum', 'ethical', 'security'],
    ethicalScore: 0.93,
    processingPower: 0.72
  });
  const [cocoons, setCocoons] = useState<Array<{id: string, type: string, wrapped: any}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fallbackState, setFallbackState] = useState(false);
  const [recursionCount, setRecursionCount] = useState(0);
  const [lastStableTimestamp, setLastStableTimestamp] = useState(Date.now());
  const [cocoonTrace, setCocoonTrace] = useState<string[]>([]);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  
  const aiCore = useRef(new SecureAICore());
  const cocooner = useRef(new CognitionCocooner());

  useEffect(() => {
    const initializeSecureAI = async () => {
      try {
        await aiCore.current.initialize();
        setFallbackState(false);
        setCocoonTrace(prev => [...prev, 'Secure AI Core initialized successfully']);
      } catch (error: any) {
        console.error('Failed to initialize Secure AI:', error);
        setFallbackState(true);
        setCocoonTrace(prev => [...prev, `Secure AI initialization failed: ${error.message}`]);
      }
    };

    initializeSecureAI();
  }, []);

  useEffect(() => {
    const checkSecureAuth = async () => {
      if (!supabase) {
        console.warn('Supabase not available - running in secure offline mode');
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error.message);
          setSecurityAlert('Authentication system error detected');
          return;
        }

        if (session?.user) {
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            if (!roleError && roleData) {
              setIsAdmin(roleData.role === 'admin');
              setCocoonTrace(prev => [...prev, `User authenticated with role: ${roleData.role}`]);
            }
          } catch (roleError) {
            console.warn('Could not fetch user role:', roleError);
            setSecurityAlert('Role verification failed');
          }
        }
      } catch (error: any) {
        console.error('Secure auth check error:', error.message);
        setSecurityAlert('Security check failed');
      }
    };

    checkSecureAuth();

    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
        setCocoonTrace(prev => [...prev, `Auth state changed: ${event}`]);
        
        if (session?.user) {
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            if (!roleError && roleData) {
              setIsAdmin(roleData.role === 'admin');
            }
          } catch (roleError) {
            console.warn('Could not fetch user role:', roleError);
          }
        } else {
          setIsAdmin(false);
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, []);
  
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: hackathonMode 
          ? '🏆 Welcome to Codette AI Hackathon Demo! I\'m an advanced AI with multi-perspective reasoning, quantum-inspired processing, and enterprise-grade security. Try the interactive demo or ask me anything to see my capabilities in action!'
          : 'Hello! I am Codette, a secure AI assistant with advanced reasoning capabilities. I prioritize safety and security in all interactions. How can I assist you today?',
        timestamp: new Date(),
        metadata: {
          text: hackathonMode 
            ? '🏆 Welcome to Codette AI Hackathon Demo! I\'m an advanced AI with multi-perspective reasoning, quantum-inspired processing, and enterprise-grade security. Try the interactive demo or ask me anything to see my capabilities in action!'
            : 'Hello! I am Codette, a secure AI assistant with advanced reasoning capabilities. I prioritize safety and security in all interactions. How can I assist you today?',
          instabilityFlag: false,
          perspectivesUsed: hackathonMode ? ['demo', 'showcase', 'hackathon'] : ['security', 'greeting', 'introduction'],
          cocoonLog: hackathonMode 
            ? ['Hackathon demo mode activated', 'All systems optimized for presentation', 'Ready for demonstration']
            : ['Secure AI initialized...', 'Security protocols active', 'Ready for safe interaction'],
          forceRefresh: () => handleSecureRefresh(hackathonMode 
            ? '🏆 Welcome to Codette AI Hackathon Demo! I\'m an advanced AI with multi-perspective reasoning, quantum-inspired processing, and enterprise-grade security. Try the interactive demo or ask me anything to see my capabilities in action!'
            : 'Hello! I am Codette, a secure AI assistant with advanced reasoning capabilities. I prioritize safety and security in all interactions. How can I assist you today?')
        }
      }
    ]);
  }, [hackathonMode]);
  
  const handleSecureRefresh = async (content: string) => {
    setIsProcessing(true);
    try {
      const sanitizedContent = SecurityUtils.sanitizeInput(content);
      const response = await aiCore.current.processInput(sanitizedContent, true);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          text: response,
          instabilityFlag: false,
          perspectivesUsed: ['security', 'regeneration'],
          cocoonLog: [`Securely regenerating response for: ${sanitizedContent}`, `Generated secure response at ${new Date().toISOString()}`],
          forceRefresh: () => handleSecureRefresh(content)
        }
      };
      
      setMessages(prev => [...prev.slice(0, -1), assistantMessage]);
    } catch (error) {
      console.error('Error in secure regeneration:', error);
      setFallbackState(true);
      setRecursionCount(prev => prev + 1);
      setCocoonTrace(prev => [...prev, `Secure response regeneration failed: ${error}`]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleHackathonMode = () => {
    setHackathonMode(!hackathonMode);
  };
  
  const resetFallback = () => {
    setFallbackState(false);
    setRecursionCount(0);
    setLastStableTimestamp(Date.now());
    setCocoonTrace([]);
    setSecurityAlert(null);
    
    // Reset AI session for security
    aiCore.current.resetSession();
  };
  
  const sendSecureMessage = async (content: string) => {
    // Security validation
    const sanitizedContent = SecurityUtils.sanitizeInput(content);
    
    if (!sanitizedContent || sanitizedContent.trim().length === 0) {
      setSecurityAlert('Invalid input detected and blocked');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: sanitizedContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setSecurityAlert(null);
    
    try {
      // Add processing delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const thought = { query: sanitizedContent, timestamp: new Date() };
      const cocoonId = cocooner.current.wrap(thought);
      setCocoons(prev => [...prev, { 
        id: cocoonId, 
        type: 'prompt', 
        wrapped: thought 
      }]);
      
      const response = await aiCore.current.processInput(sanitizedContent);
      
      // Update AI state with secure randomization
      setAiState(prev => ({
        ...prev,
        quantumState: [Math.random(), Math.random(), Math.random()].map(v => Number(v.toFixed(2))),
        chaosState: [Math.random(), Math.random(), Math.random(), Math.random()].map(v => Number(v.toFixed(2))),
        ethicalScore: Number((Math.max(0.8, Math.min(1.0, prev.ethicalScore + (Math.random() * 0.05 - 0.025)))).toFixed(2)),
        processingPower: Number((Math.max(0.6, Math.min(1.0, prev.processingPower + (Math.random() * 0.05 - 0.025)))).toFixed(2))
      }));
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          text: response,
          instabilityFlag: false,
          perspectivesUsed: hackathonMode ? ['demo', 'analysis', 'showcase'] : ['security', 'analysis', 'ethics'],
          cocoonLog: [`Securely processing query: ${sanitizedContent}`, `Generated secure response at ${new Date().toISOString()}`],
          forceRefresh: () => handleSecureRefresh(sanitizedContent)
        }
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCocoonTrace(prev => [...prev, `Secure message processed successfully`]);
    } catch (error) {
      console.error('Error in secure message processing:', error);
      setFallbackState(true);
      setRecursionCount(prev => prev + 1);
      setCocoonTrace(prev => [...prev, `Secure message processing failed: ${error}`]);
      setSecurityAlert('Message processing error - security protocols engaged');
      
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'A security error occurred while processing your request. The system has been secured and is ready for your next message.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const contextValue = {
    recursionCount,
    activePerspectives: aiState.activePerspectives,
    cocoonTrace,
    lastStableTimestamp,
    fallbackState,
    resetFallback
  };
  
  return (
    <CodetteContext.Provider value={contextValue}>
      <div className={`flex flex-col h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {securityAlert && (
          <div className="bg-red-600 text-white px-4 py-2 text-sm flex items-center justify-between">
            <span>🔒 Security Alert: {securityAlert}</span>
            <button 
              onClick={() => setSecurityAlert(null)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        )}
        
        <Header 
          toggleSidebar={toggleSidebar}
          toggleDarkMode={toggleDarkMode} 
          darkMode={darkMode} 
          aiState={aiState}
          hackathonMode={hackathonMode}
          toggleHackathonMode={toggleHackathonMode}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {!hackathonMode && (
            <Sidebar 
              isOpen={sidebarOpen} 
              cocoons={cocoons} 
              aiState={aiState}
              darkMode={darkMode}
              supabase={supabase}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
            />
          )}
          
          <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {fallbackState ? (
              <CodetteFallbackHandler />
            ) : hackathonMode ? (
              <HackathonDashboard
                messages={messages}
                sendMessage={sendSecureMessage}
                isProcessing={isProcessing}
                darkMode={darkMode}
                aiState={aiState}
              />
            ) : (
              <>
                <ChatInterface 
                  messages={messages} 
                  sendMessage={sendSecureMessage} 
                  isProcessing={isProcessing}
                  darkMode={darkMode}
                />
                
                <VisualizationPanel 
                  aiState={aiState} 
                  darkMode={darkMode}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </CodetteContext.Provider>
  );
};

export default App;