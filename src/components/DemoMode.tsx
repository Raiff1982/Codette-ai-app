import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Brain, Zap } from 'lucide-react';

interface DemoModeProps {
  darkMode: boolean;
  onDemoMessage: (message: string) => void;
}

const DemoMode: React.FC<DemoModeProps> = ({ darkMode, onDemoMessage }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const demoScenarios = [
    {
      title: "Creative Problem Solving",
      message: "How can AI help solve climate change through innovative technology?",
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      title: "Ethical AI Analysis",
      message: "What are the ethical implications of AI in healthcare decision-making?",
      icon: <Brain className="w-4 h-4" />
    },
    {
      title: "Quantum Computing Insights",
      message: "Explain quantum computing's potential impact on cryptography and security",
      icon: <Zap className="w-4 h-4" />
    },
    {
      title: "Multi-Perspective Reasoning",
      message: "Analyze the pros and cons of remote work from multiple viewpoints",
      icon: <Brain className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Move to next scenario
            const nextStep = (currentStep + 1) % demoScenarios.length;
            setCurrentStep(nextStep);
            onDemoMessage(demoScenarios[nextStep].message);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, currentStep, onDemoMessage]);

  const startDemo = () => {
    setIsRunning(true);
    onDemoMessage(demoScenarios[currentStep].message);
  };

  const pauseDemo = () => {
    setIsRunning(false);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setProgress(0);
  };

  return (
    <div className={`p-4 rounded-lg border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Sparkles className="mr-2" size={20} />
        Interactive Demo Mode
      </h3>
      
      <div className="space-y-4">
        <div className={`p-3 rounded-md ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Scenario:</span>
            <span className="text-xs text-purple-600 dark:text-purple-400">
              {currentStep + 1} of {demoScenarios.length}
            </span>
          </div>
          
          <div className="flex items-center mb-2">
            {demoScenarios[currentStep].icon}
            <span className="ml-2 text-sm font-medium">
              {demoScenarios[currentStep].title}
            </span>
          </div>
          
          <div className={`w-full h-2 rounded-full ${
            darkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`}>
            <div 
              className="h-full rounded-full bg-purple-600 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex space-x-2">
          {!isRunning ? (
            <button
              onClick={startDemo}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Play className="mr-2" size={16} />
              Start Demo
            </button>
          ) : (
            <button
              onClick={pauseDemo}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              <Pause className="mr-2" size={16} />
              Pause Demo
            </button>
          )}
          
          <button
            onClick={resetDemo}
            className={`px-4 py-2 rounded-md border transition-colors ${
              darkMode 
                ? 'border-gray-600 hover:bg-gray-700' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {demoScenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                setProgress(0);
                if (isRunning) {
                  onDemoMessage(scenario.message);
                }
              }}
              className={`p-2 rounded-md text-left transition-colors ${
                index === currentStep
                  ? darkMode
                    ? 'bg-purple-900 text-purple-200'
                    : 'bg-purple-100 text-purple-800'
                  : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center">
                {scenario.icon}
                <span className="ml-2 text-xs font-medium truncate">
                  {scenario.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoMode;