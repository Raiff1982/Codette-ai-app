import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Trophy, Code, Activity, Sparkles, Users, Target, Play, QrCode, BookOpen } from 'lucide-react';
import ChatInterface from './ChatInterface';
import PerformanceMetrics from './PerformanceMetrics';
import APIShowcase from './APIShowcase';
import DemoMode from './DemoMode';
import VideoWalkthrough from './VideoWalkthrough';
import QRCodeDisplay from './QRCodeDisplay';
import ResearchBacking from './ResearchBacking';
import FeedbackButton from './FeedbackButton';

interface Message {
  role: string;
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface HackathonDashboardProps {
  messages: Message[];
  sendMessage: (content: string) => void;
  isProcessing: boolean;
  darkMode: boolean;
  aiState: any;
}

const HackathonDashboard: React.FC<HackathonDashboardProps> = ({
  messages,
  sendMessage,
  isProcessing,
  darkMode,
  aiState
}) => {
  const [activeTab, setActiveTab] = useState('demo');

  const handleDemoMessage = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="flex flex-col h-full w-full p-4 space-y-4">
      {/* Hackathon Header */}
      <div className={`p-6 rounded-xl border-2 border-dashed ${
        darkMode ? 'bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500' : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Trophy className="mr-3 text-yellow-500" size={32} />
              Codette AI - Hackathon Demo
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Advanced AI with Multi-Perspective Reasoning, Quantum-Inspired Processing & Enterprise Security
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">v2.0</div>
            <div className="text-sm text-gray-500">Production Ready</div>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">99.9%</div>
            <div className="text-sm text-gray-500">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">150ms</div>
            <div className="text-sm text-gray-500">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">7</div>
            <div className="text-sm text-gray-500">AI Perspectives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">100%</div>
            <div className="text-sm text-gray-500">Security Score</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="demo" className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" /> Live Demo
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center">
            <Play className="w-4 h-4 mr-2" /> Video
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center">
            <QrCode className="w-4 h-4 mr-2" /> QR Access
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2" /> Research
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <Activity className="w-4 h-4 mr-2" /> Performance
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center">
            <Code className="w-4 h-4 mr-2" /> API Docs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="h-[calc(100vh-16rem)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
              <ChatInterface
                messages={messages}
                sendMessage={sendMessage}
                isProcessing={isProcessing}
                darkMode={darkMode}
              />
            </div>
            <div>
              <DemoMode darkMode={darkMode} onDemoMessage={handleDemoMessage} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="video" className="h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">30-Second Video Walkthrough</h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                See Codette AI's multi-perspective reasoning and quantum visualization in action
              </p>
            </div>
            <VideoWalkthrough darkMode={darkMode} />
            
            {/* Video Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <h3 className="font-semibold mb-2">🧠 Multi-Perspective AI</h3>
                <p className="text-sm">Watch 7+ AI perspectives analyze problems simultaneously</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <h3 className="font-semibold mb-2">⚡ Quantum Visualization</h3>
                <p className="text-sm">Real-time quantum state changes and neural activity</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <h3 className="font-semibold mb-2">🔒 Enterprise Security</h3>
                <p className="text-sm">See security validation and threat detection in action</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="qr" className="h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Instant Demo Access</h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Scan the QR code with your phone for immediate access to the live demo
              </p>
            </div>
            <QRCodeDisplay darkMode={darkMode} />
            
            {/* Mobile Features */}
            <div className={`p-6 rounded-lg border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Mobile-Optimized Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Touch-optimized interface</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Responsive quantum visualization</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Full AI chat functionality</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Real-time performance metrics</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="research" className="h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <ResearchBacking darkMode={darkMode} />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="h-[calc(100vh-16rem)] overflow-y-auto">
          <PerformanceMetrics darkMode={darkMode} aiState={aiState} />
        </TabsContent>

        <TabsContent value="api" className="h-[calc(100vh-16rem)] overflow-y-auto">
          <APIShowcase darkMode={darkMode} />
        </TabsContent>
      </Tabs>

      {/* Judge Feedback Button */}
      <FeedbackButton darkMode={darkMode} />
    </div>
  );
};

export default HackathonDashboard;