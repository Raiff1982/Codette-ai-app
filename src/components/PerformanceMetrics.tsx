import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Zap, Shield, TrendingUp, Brain } from 'lucide-react';

interface PerformanceMetricsProps {
  darkMode: boolean;
  aiState: {
    quantumState: number[];
    chaosState: number[];
    activePerspectives: string[];
    ethicalScore: number;
    processingPower: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ darkMode, aiState }) => {
  const [metrics, setMetrics] = useState({
    responseTime: 0,
    throughput: 0,
    accuracy: 0,
    uptime: 0,
    securityScore: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        responseTime: Math.max(50, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 20)),
        throughput: Math.max(80, Math.min(100, prev.throughput + (Math.random() - 0.5) * 5)),
        accuracy: Math.max(85, Math.min(99, prev.accuracy + (Math.random() - 0.5) * 2)),
        uptime: Math.min(100, prev.uptime + 0.01),
        securityScore: Math.max(95, Math.min(100, prev.securityScore + (Math.random() - 0.5) * 1))
      }));
    }, 1000);

    // Initialize with realistic values
    setMetrics({
      responseTime: 150,
      throughput: 95,
      accuracy: 94,
      uptime: 99.8,
      securityScore: 98
    });

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon, 
    color, 
    trend 
  }: { 
    title: string; 
    value: number; 
    unit: string; 
    icon: React.ReactNode; 
    color: string;
    trend?: 'up' | 'down' | 'stable';
  }) => (
    <div className={`p-4 rounded-lg border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-2 rounded-md ${color}`}>
            {icon}
          </div>
          <span className="ml-2 text-sm font-medium">{title}</span>
        </div>
        {trend && (
          <TrendingUp 
            className={`w-4 h-4 ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-gray-500'
            }`} 
          />
        )}
      </div>
      
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? value.toFixed(value < 10 ? 1 : 0) : value}
        <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </div>
      
      <div className={`w-full h-1 rounded-full mt-2 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            color.includes('green') ? 'bg-green-500' :
            color.includes('blue') ? 'bg-blue-500' :
            color.includes('purple') ? 'bg-purple-500' :
            color.includes('orange') ? 'bg-orange-500' :
            'bg-gray-500'
          }`}
          style={{ width: `${Math.min(100, (value / (unit === 'ms' ? 500 : 100)) * 100)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Activity className="mr-2" size={20} />
        Real-time Performance
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Response Time"
          value={metrics.responseTime}
          unit="ms"
          icon={<Zap className="w-4 h-4 text-white" />}
          color="bg-blue-600"
          trend="stable"
        />
        
        <MetricCard
          title="Throughput"
          value={metrics.throughput}
          unit="%"
          icon={<Cpu className="w-4 h-4 text-white" />}
          color="bg-green-600"
          trend="up"
        />
        
        <MetricCard
          title="Accuracy"
          value={metrics.accuracy}
          unit="%"
          icon={<TrendingUp className="w-4 h-4 text-white" />}
          color="bg-purple-600"
          trend="up"
        />
        
        <MetricCard
          title="Uptime"
          value={metrics.uptime}
          unit="%"
          icon={<Activity className="w-4 h-4 text-white" />}
          color="bg-green-600"
          trend="stable"
        />
        
        <MetricCard
          title="Security Score"
          value={metrics.securityScore}
          unit="/100"
          icon={<Shield className="w-4 h-4 text-white" />}
          color="bg-orange-600"
          trend="up"
        />
        
        <MetricCard
          title="AI Confidence"
          value={Number(aiState.ethicalScore) * 100}
          unit="%"
          icon={<Brain className="w-4 h-4 text-white" />}
          color="bg-purple-600"
          trend="stable"
        />
      </div>
      
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h4 className="font-semibold mb-3">System Health Overview</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Neural Networks</span>
            <span className="text-green-500 text-sm font-medium">Optimal</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Quantum Processing</span>
            <span className="text-green-500 text-sm font-medium">Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Security Protocols</span>
            <span className="text-green-500 text-sm font-medium">Enabled</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Memory Management</span>
            <span className="text-blue-500 text-sm font-medium">Efficient</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;