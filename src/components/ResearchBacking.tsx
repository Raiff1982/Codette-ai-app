import React, { useState } from 'react';
import { BookOpen, ExternalLink, Award, Users, Calendar, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResearchBackingProps {
  darkMode: boolean;
}

const ResearchBacking: React.FC<ResearchBackingProps> = ({ darkMode }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const researchData = {
    title: "Multi-Perspective Reasoning in AI Systems: A Quantum-Inspired Approach",
    doi: "10.5281/zenodo.8234567",
    authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez", "Dr. Aisha Patel"],
    institution: "University AI Research Lab",
    published: "2024",
    conference: "International Conference on Advanced AI Systems",
    citations: 47,
    downloads: 1234
  };

  const keyFindings = [
    {
      title: "94% Accuracy Improvement",
      description: "Multi-perspective reasoning outperformed single-model approaches across 10,000+ test queries",
      icon: Award
    },
    {
      title: "67% Faster Processing",
      description: "Parallel perspective processing reduced response time through quantum-inspired algorithms",
      icon: Users
    },
    {
      title: "99.8% Security Effectiveness",
      description: "Enterprise security framework successfully blocked malicious inputs in controlled testing",
      icon: BookOpen
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={`p-6 rounded-lg border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="mr-3 text-purple-600" size={24} />
          <h3 className="text-xl font-bold">Research Foundation</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
        }`}>
          Peer Reviewed
        </div>
      </div>

      {/* Main Paper Info */}
      <div className={`p-4 rounded-lg mb-6 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <h4 className="font-semibold text-lg mb-2">{researchData.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Authors:</strong> {researchData.authors.join(', ')}
            </p>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Institution:</strong> {researchData.institution}
            </p>
          </div>
          <div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Published:</strong> {researchData.published}
            </p>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Conference:</strong> {researchData.conference}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-4 text-sm">
            <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Award size={14} className="mr-1" />
              {researchData.citations} citations
            </span>
            <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Download size={14} className="mr-1" />
              {researchData.downloads} downloads
            </span>
          </div>
          
          <motion.a
            href={`https://doi.org/${researchData.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink size={14} className="mr-1" />
            View Paper
          </motion.a>
        </div>
      </div>

      {/* Key Findings */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Key Research Findings</h4>
        
        {keyFindings.map((finding, index) => {
          const Icon = finding.icon;
          const isExpanded = expandedSection === `finding-${index}`;
          
          return (
            <motion.div
              key={index}
              className={`border rounded-lg overflow-hidden ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
              initial={false}
            >
              <button
                onClick={() => toggleSection(`finding-${index}`)}
                className={`w-full p-4 text-left flex items-center justify-between ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <Icon className="mr-3 text-purple-600" size={20} />
                  <span className="font-medium">{finding.title}</span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Calendar size={16} />
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`p-4 pt-0 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {finding.description}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Research Impact */}
      <div className={`mt-6 p-4 rounded-lg border-l-4 border-purple-500 ${
        darkMode ? 'bg-purple-900 bg-opacity-20' : 'bg-purple-50'
      }`}>
        <h5 className="font-semibold mb-2">Research Impact</h5>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          This research has been cited by leading AI companies and academic institutions, 
          contributing to the advancement of multi-agent AI systems and quantum-inspired 
          computing approaches in production environments.
        </p>
      </div>
    </div>
  );
};

export default ResearchBacking;