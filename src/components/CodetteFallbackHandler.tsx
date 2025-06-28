import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, BrainCircuit, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { Progress } from './ui/progress';
import { useCodetteContext } from '../core/hooks/useCodetteContext';
import { ExtensionManager } from '../core/engine/ExtensionManager';
import { getPerspectiveColor } from '../utils/perspectiveColors';
import { formatTimestamp, getTimeSince } from '../utils/time';

export default function CodetteFallbackHandler() {
  const {
    recursionCount,
    activePerspectives,
    cocoonTrace,
    lastStableTimestamp,
    fallbackState,
    resetFallback
  } = useCodetteContext();

  const [cooldown, setCooldown] = useState(100);
  const [extensions, setExtensions] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    network: navigator.onLine ? 'Online' : 'Offline',
    memoryUsage: '0 MB',
    lastError: null as any
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCooldown(prev => Math.max(prev - 1, 0));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fallbackState) {
      const loaded = ExtensionManager.listLoadedExtensions();
      setExtensions(loaded);

      // Update system status
      setSystemStatus(prev => ({
        ...prev,
        memoryUsage: `${((performance as any)?.memory?.usedJSHeapSize / 1024 / 1024)?.toFixed(2) || 'N/A'} MB`,
        lastError: cocoonTrace[cocoonTrace.length - 1]
      }));
    }
  }, [fallbackState, cocoonTrace]);

  const handleReboot = useCallback(() => {
    resetFallback();
    ExtensionManager.flushSandbox();
    ExtensionManager.reinitializeSafeModules();
  }, [resetFallback]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const synth = window.speechSynthesis;
    if (!synth) return;

    const summary = `System status: ${systemStatus.network}. Recursion count: ${recursionCount}. Last error: ${
      typeof systemStatus.lastError === 'string' ? systemStatus.lastError : 'Unknown error'
    }`;

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.onend = () => setIsSpeaking(false);
    synth.cancel();
    synth.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="grid gap-4 p-4">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 shadow-md rounded-lg p-4">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-yellow-500 mt-1" />
          <div className="flex-1">
            <p className="text-base font-bold dark:text-yellow-100">Codette: Fallback Mode Activated</p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Detected recursive feedback loop. Engaging stabilization protocols.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Recursion Count: <strong>{recursionCount}</strong>
              </p>
              <button
                onClick={toggleSpeech}
                className="p-1 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800"
              >
                {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Last Stable State: {formatTimestamp(lastStableTimestamp)}
              <span className="text-gray-500 dark:text-gray-500 italic ml-2">
                ({getTimeSince(lastStableTimestamp)} ago)
              </span>
            </p>
            <Progress value={cooldown} className="mt-2" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">System Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Network:</span>
            <span className={systemStatus.network === 'Online' ? 'text-green-500' : 'text-red-500'}>
              {systemStatus.network}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Memory Usage:</span>
            <span>{systemStatus.memoryUsage}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Active Perspectives</h3>
        <div className="flex flex-wrap gap-2">
          {activePerspectives.map((perspective, i) => (
            <span
              key={i}
              style={{ backgroundColor: getPerspectiveColor(perspective) }}
              className="text-xs px-2 py-1 rounded-full text-white"
            >
              {perspective.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Error Trace</h3>
        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
          {cocoonTrace.map((entry, idx) => (
            <div key={idx} className="font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">
              {typeof entry === 'string' ? entry : JSON.stringify(entry, null, 2)}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Active Extensions</h3>
        <div className="space-y-1">
          {extensions.map((ext, idx) => (
            <div key={idx} className="text-xs text-blue-600 dark:text-blue-400">
              {ext}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex items-center gap-3 px-4 py-3">
        <BrainCircuit className="text-purple-600 dark:text-purple-400 animate-pulse" size={18} />
        <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
          Recalibrating multi-threaded cognition...
        </p>
        <button
          onClick={handleReboot}
          disabled={cooldown > 0}
          className="ml-auto flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-xs font-semibold py-1 px-3 rounded transition-colors"
        >
          <RefreshCw size={12} className={cooldown > 0 ? 'animate-spin' : ''} />
          Force Reboot
        </button>
      </div>
    </div>
  );
}