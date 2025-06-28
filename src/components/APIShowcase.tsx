import React, { useState } from 'react';
import { Code, Copy, Play, CheckCircle, AlertCircle } from 'lucide-react';

interface APIShowcaseProps {
  darkMode: boolean;
}

const APIShowcase: React.FC<APIShowcaseProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('javascript');
  const [copied, setCopied] = useState<string | null>(null);

  const codeExamples = {
    javascript: `// Codette AI JavaScript SDK
import { CodetteAI } from '@codette/ai-sdk';

const codette = new CodetteAI({
  apiKey: 'your-api-key',
  model: 'codette-v2',
  security: 'maximum'
});

// Multi-perspective reasoning
const response = await codette.analyze({
  query: "How can AI improve healthcare?",
  perspectives: ['ethical', 'technical', 'creative'],
  reasoning: 'recursive'
});

console.log(response.insights);
// Output: Comprehensive analysis from multiple AI perspectives`,

    python: `# Codette AI Python SDK
from codette_ai import CodetteClient

client = CodetteClient(
    api_key="your-api-key",
    model="codette-v2",
    security_level="maximum"
)

# Quantum-inspired processing
result = client.quantum_analyze(
    prompt="Explain quantum computing",
    depth="deep",
    perspectives=["scientific", "practical", "futuristic"]
)

print(result.response)
# Output: Multi-dimensional analysis with quantum reasoning`,

    curl: `# Codette AI REST API
curl -X POST "https://api.codette.ai/v2/analyze" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What are the ethical implications of AI?",
    "config": {
      "reasoning": "recursive",
      "perspectives": ["ethical", "philosophical", "practical"],
      "security": "maximum",
      "output_format": "structured"
    }
  }'

# Response: Comprehensive ethical analysis with citations`,

    react: `// React Integration
import { useCodetteAI } from '@codette/react-hooks';

function AIAssistant() {
  const { analyze, loading, response } = useCodetteAI({
    apiKey: process.env.REACT_APP_CODETTE_KEY,
    security: 'maximum'
  });

  const handleQuery = async (query) => {
    const result = await analyze({
      query,
      perspectives: ['creative', 'logical', 'ethical'],
      reasoning: 'multi-threaded'
    });
    
    return result;
  };

  return (
    <div>
      {loading ? <Spinner /> : <Response data={response} />}
    </div>
  );
}`
  };

  const copyToClipboard = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'javascript', label: 'JavaScript', icon: '🟨' },
    { id: 'python', label: 'Python', icon: '🐍' },
    { id: 'curl', label: 'cURL', icon: '🌐' },
    { id: 'react', label: 'React', icon: '⚛️' }
  ];

  return (
    <div className={`p-6 rounded-lg border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <Code className="mr-2" size={24} />
          API Integration Examples
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">Production Ready</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? darkMode
                  ? 'bg-purple-900 text-purple-200'
                  : 'bg-purple-100 text-purple-800'
                : darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className={`relative rounded-lg border ${
        darkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-300'
      }`}>
        <div className="flex items-center justify-between p-3 border-b border-gray-600">
          <span className="text-sm font-medium text-gray-500">
            {tabs.find(t => t.id === activeTab)?.label} Example
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(codeExamples[activeTab as keyof typeof codeExamples], activeTab)}
              className={`p-2 rounded-md transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              title="Copy to clipboard"
            >
              {copied === activeTab ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              className={`p-2 rounded-md transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              title="Run example"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <pre className={`p-4 overflow-x-auto text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-800'
        }`}>
          <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
        </pre>
      </div>

      {/* Features Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <h4 className="font-semibold mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Key Features
          </h4>
          <ul className="text-sm space-y-1">
            <li>• Multi-perspective reasoning</li>
            <li>• Quantum-inspired processing</li>
            <li>• Real-time security scanning</li>
            <li>• Recursive thought loops</li>
            <li>• Ethical AI governance</li>
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <h4 className="font-semibold mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-blue-500" />
            Enterprise Ready
          </h4>
          <ul className="text-sm space-y-1">
            <li>• 99.9% uptime SLA</li>
            <li>• SOC 2 Type II compliant</li>
            <li>• GDPR & CCPA compliant</li>
            <li>• 24/7 technical support</li>
            <li>• Custom model training</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          Get API Access
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Start with 1,000 free API calls • No credit card required
        </p>
      </div>
    </div>
  );
};

export default APIShowcase;